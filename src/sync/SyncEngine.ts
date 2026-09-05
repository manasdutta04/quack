import {AppState, NativeModules} from 'react-native';
import {EnqueueMessageInput, Message, SyncReason, SyncSnapshot, SyncSummary} from '../types';
import {acquireSyncLease, getPendingOutbox, initLocalDatabase, insertMessageDurably, readSyncSnapshot, releaseSyncLease, removeFromOutbox, rescheduleOutbox, updateMessageStatus} from '../storage/localDatabase';
import {sendOutboxItem} from '../services/supabase';

type Listener = (snapshot: SyncSnapshot) => void;
const listeners = new Set<Listener>();
let running = false;
let snapshot: SyncSnapshot = {state: 'idle', queued: 0, sending: 0, failed: 0};
const emit = (next: SyncSnapshot) => { snapshot = next; listeners.forEach(listener => listener(snapshot)); };

export const SyncEngine = {
  init() { initLocalDatabase(); snapshot = readSyncSnapshot(); NativeModules.SignalGlassSync?.scheduleBackgroundSync?.(); },
  getSnapshot: () => snapshot,
  subscribe(listener: Listener) { listeners.add(listener); listener(snapshot); return () => listeners.delete(listener); },
  enqueueMessage(input: EnqueueMessageInput): Message {
    const id = `local-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`; const now = Date.now();
    const message: Message = {id, conversationId: input.conversationId, senderId: input.senderId, senderName: input.senderName, text: input.text, createdAt: new Date(now).toISOString(), kind: input.kind ?? 'text', status: 'queued', isMine: true, attemptCount: 0};
    insertMessageDurably(message, {id: `outbox-${id}`, messageId: id, conversationId: input.conversationId, priority: 100, status: 'queued', attemptCount: 0, nextAttemptAt: now, createdAt: now});
    emit({...readSyncSnapshot(), state: 'queued', currentLabel: 'Queued locally'}); void this.run('user-send'); return message;
  },
  async run(reason: SyncReason): Promise<SyncSummary> {
    if (running) return {runId: 'coalesced', reason, sent: 0, received: 0, failed: 0, conflicted: 0, completedAt: Date.now()};
    const owner = `js-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    if (!acquireSyncLease(owner)) return {runId: 'leased', reason, sent: 0, received: 0, failed: 0, conflicted: 0, completedAt: Date.now()};
    running = true; const runId = `sync-${Date.now()}`; let sent = 0; let failed = 0;
    emit({...readSyncSnapshot(), state: 'running', currentLabel: reason === 'user-send' ? 'Sending securely' : 'Catching up'});
    try { const items = getPendingOutbox(); for (const item of items) { updateMessageStatus(item.messageId, 'sending', item.attemptCount); emit({...readSyncSnapshot(), state: 'running', currentLabel: `Syncing ${sent + 1} of ${items.length}`}); try { await sendOutboxItem(item); updateMessageStatus(item.messageId, 'sent', item.attemptCount); removeFromOutbox(item.messageId); sent += 1; } catch (error) { const nextAttempt = item.attemptCount + 1; const backoff = Math.min(900000, 2000 * (2 ** Math.min(nextAttempt, 9))) + Math.floor(Math.random() * 1000); rescheduleOutbox(item.messageId, nextAttempt, Date.now() + backoff, error instanceof Error ? error.message : 'Temporary sync failure'); failed += 1; } } const completedAt = Date.now(); const summary = {runId, reason, sent, received: 0, failed, conflicted: 0, completedAt}; emit({...readSyncSnapshot(), state: failed ? 'error' : 'idle', lastSyncAt: completedAt, currentLabel: failed ? 'Some messages need attention' : 'All caught up'}); return summary; } finally { running = false; releaseSyncLease(owner); }
  },
  async retryMessage(messageId: string) { updateMessageStatus(messageId, 'queued', 0); await this.run('user-send'); },
  async resolveConflict(messageId: string, resolution: 'local' | 'server') { updateMessageStatus(messageId, resolution === 'local' ? 'queued' : 'sent', 0); await this.run('user-send'); },
  attachLifecycle() { const subscription = AppState.addEventListener('change', state => { if (state === 'active') void this.run('foreground'); }); return () => subscription.remove(); },
};
