import {open, NitroSQLiteConnection} from 'react-native-nitro-sqlite';
import {Message, OutboxItem, SyncSnapshot} from '../types';

const database: NitroSQLiteConnection = open({name: 'signal-glass.sqlite'});
let initialized = false;

export function initLocalDatabase() {
  if (initialized) return;
  database.execute('PRAGMA journal_mode = WAL;');
  database.execute('PRAGMA synchronous = FULL;');
  database.execute(`CREATE TABLE IF NOT EXISTS messages (id TEXT PRIMARY KEY NOT NULL, conversation_id TEXT NOT NULL, sender_id TEXT NOT NULL, sender_name TEXT NOT NULL, text TEXT NOT NULL, created_at TEXT NOT NULL, kind TEXT NOT NULL, status TEXT NOT NULL, is_mine INTEGER NOT NULL, server_revision INTEGER, attempt_count INTEGER NOT NULL DEFAULT 0); CREATE TABLE IF NOT EXISTS outbox (id TEXT PRIMARY KEY NOT NULL, message_id TEXT NOT NULL UNIQUE, conversation_id TEXT NOT NULL, priority INTEGER NOT NULL, status TEXT NOT NULL, attempt_count INTEGER NOT NULL DEFAULT 0, next_attempt_at INTEGER NOT NULL, last_error TEXT, created_at INTEGER NOT NULL); CREATE TABLE IF NOT EXISTS sync_leases (name TEXT PRIMARY KEY NOT NULL, owner TEXT NOT NULL, expires_at INTEGER NOT NULL); CREATE TABLE IF NOT EXISTS sync_cursors (conversation_id TEXT PRIMARY KEY NOT NULL, revision INTEGER NOT NULL DEFAULT 0); CREATE TABLE IF NOT EXISTS conflicts (message_id TEXT PRIMARY KEY NOT NULL, local_text TEXT NOT NULL, server_text TEXT NOT NULL, created_at INTEGER NOT NULL); CREATE TABLE IF NOT EXISTS sync_runs (id TEXT PRIMARY KEY NOT NULL, reason TEXT NOT NULL, state TEXT NOT NULL, completed_at INTEGER);`);
  initialized = true;
}

export function insertMessageDurably(message: Message, outbox?: OutboxItem) {
  initLocalDatabase();
  try {
    database.execute('BEGIN IMMEDIATE TRANSACTION;');
    database.execute('INSERT OR REPLACE INTO messages (id, conversation_id, sender_id, sender_name, text, created_at, kind, status, is_mine, server_revision, attempt_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);', [message.id, message.conversationId, message.senderId, message.senderName, message.text, message.createdAt, message.kind, message.status, message.isMine ? 1 : 0, message.serverRevision ?? null, message.attemptCount ?? 0]);
    if (outbox) database.execute('INSERT OR REPLACE INTO outbox (id, message_id, conversation_id, priority, status, attempt_count, next_attempt_at, last_error, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);', [outbox.id, outbox.messageId, outbox.conversationId, outbox.priority, outbox.status, outbox.attemptCount, outbox.nextAttemptAt, outbox.lastError ?? null, outbox.createdAt]);
    database.execute('COMMIT;');
  } catch (error) {
    database.execute('ROLLBACK;');
    throw error;
  }
}

export function updateMessageStatus(messageId: string, status: Message['status'], attemptCount?: number) {
  initLocalDatabase();
  database.execute('UPDATE messages SET status = ?, attempt_count = COALESCE(?, attempt_count) WHERE id = ?;', [status, attemptCount ?? null, messageId]);
  database.execute('UPDATE outbox SET status = ?, attempt_count = COALESCE(?, attempt_count) WHERE message_id = ?;', [status, attemptCount ?? null, messageId]);
}
export function getPendingOutbox(limit = 40): OutboxItem[] { initLocalDatabase(); const result = database.execute<any>(`SELECT o.id, o.message_id as messageId, o.conversation_id as conversationId, o.priority, o.status, o.attempt_count as attemptCount, o.next_attempt_at as nextAttemptAt, o.last_error as lastError, o.created_at as createdAt, m.text as body, m.kind as kind FROM outbox o JOIN messages m ON m.id = o.message_id WHERE o.status IN ('queued', 'sending', 'failed') AND o.next_attempt_at <= ? ORDER BY o.priority DESC, o.conversation_id, o.created_at ASC LIMIT ?;`, [Date.now(), limit]); return result.rows._array as OutboxItem[]; }
export function removeFromOutbox(messageId: string) { initLocalDatabase(); database.execute('DELETE FROM outbox WHERE message_id = ?;', [messageId]); }
export function rescheduleOutbox(messageId: string, attemptCount: number, nextAttemptAt: number, errorMessage: string) { initLocalDatabase(); database.execute('UPDATE outbox SET status = ?, attempt_count = ?, next_attempt_at = ?, last_error = ? WHERE message_id = ?;', [attemptCount >= 12 ? 'failed' : 'queued', attemptCount, nextAttemptAt, errorMessage, messageId]); database.execute('UPDATE messages SET status = ?, attempt_count = ? WHERE id = ?;', [attemptCount >= 12 ? 'failed' : 'queued', attemptCount, messageId]); }
export function acquireSyncLease(owner: string, ttlMs = 45000) { initLocalDatabase(); try { database.execute('BEGIN IMMEDIATE TRANSACTION;'); database.execute('DELETE FROM sync_leases WHERE name = ? OR expires_at < ?;', ['global', Date.now()]); const result = database.execute('INSERT OR IGNORE INTO sync_leases (name, owner, expires_at) VALUES (?, ?, ?);', ['global', owner, Date.now() + ttlMs]); database.execute((result.rowsAffected ?? 0) > 0 ? 'COMMIT;' : 'ROLLBACK;'); return (result.rowsAffected ?? 0) > 0; } catch { database.execute('ROLLBACK;'); return false; } }
export function releaseSyncLease(owner: string) { initLocalDatabase(); database.execute('DELETE FROM sync_leases WHERE name = ? AND owner = ?;', ['global', owner]); }
export function readSyncSnapshot(): SyncSnapshot { initLocalDatabase(); const result = database.execute<any>(`SELECT SUM(CASE WHEN status = 'queued' THEN 1 ELSE 0 END) as queued, SUM(CASE WHEN status = 'sending' THEN 1 ELSE 0 END) as sending, SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed FROM outbox;`); const row = result.rows.item(0) ?? {}; return {state: 'idle', queued: Number(row.queued ?? 0), sending: Number(row.sending ?? 0), failed: Number(row.failed ?? 0)}; }
