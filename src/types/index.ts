export type MessageStatus = 'queued' | 'sending' | 'sent' | 'delivered' | 'failed' | 'conflicted';
export type MessageKind = 'text' | 'image' | 'system';

export interface Conversation { id: string; title: string; subtitle: string; avatar: string; avatarColor: string; lastMessage: string; lastMessageAt: string; unreadCount: number; isPinned?: boolean; isMuted?: boolean; online?: boolean; }
export interface Message { id: string; conversationId: string; senderId: string; senderName: string; text: string; createdAt: string; kind: MessageKind; status: MessageStatus; isMine: boolean; serverRevision?: number; attemptCount?: number; }
export interface OutboxItem { id: string; messageId: string; conversationId: string; priority: number; status: MessageStatus; attemptCount: number; nextAttemptAt: number; lastError?: string; createdAt: number; body?: string; kind?: MessageKind; }
export type SyncReason = 'launch' | 'foreground' | 'network-restored' | 'user-send' | 'background' | 'push';
export interface SyncSummary { runId: string; reason: SyncReason; sent: number; received: number; failed: number; conflicted: number; completedAt: number; }
export interface SyncSnapshot { state: 'idle' | 'running' | 'paused' | 'error' | 'queued'; queued: number; sending: number; failed: number; lastSyncAt?: number; currentLabel?: string; }
export interface EnqueueMessageInput { conversationId: string; senderId: string; senderName: string; text: string; kind?: MessageKind; }
