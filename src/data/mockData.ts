import {Conversation, Message} from '../types';

export const conversations: Conversation[] = [
  {id: 'design-systems', title: 'Design systems club', subtitle: '4 members · active now', avatar: 'DS', avatarColor: '#F4B57A', lastMessage: 'Maya: The new composer feels lovely.', lastMessageAt: '09:42', unreadCount: 3, isPinned: true, online: true},
  {id: 'maya', title: 'Maya Chen', subtitle: 'online · replying quickly', avatar: 'MC', avatarColor: '#8DA8FF', lastMessage: 'Send me the latest build when ready', lastMessageAt: '08:18', unreadCount: 0, online: true},
  {id: 'weekend-plans', title: 'Weekend plans', subtitle: '6 members · last active yesterday', avatar: 'WP', avatarColor: '#8DE2C0', lastMessage: 'Nico shared a location', lastMessageAt: 'Yesterday', unreadCount: 1},
  {id: 'studio', title: 'The studio', subtitle: '12 members · muted', avatar: 'TS', avatarColor: '#FF8E78', lastMessage: 'Ari: We are shipping at 4pm.', lastMessageAt: 'Tue', unreadCount: 0, isMuted: true},
  {id: 'sam', title: 'Sam Rivera', subtitle: 'last seen Monday', avatar: 'SR', avatarColor: '#C9A4FF', lastMessage: 'That works for me.', lastMessageAt: 'Mon', unreadCount: 0},
];

export const seedMessages: Message[] = [
  {id: 'm-1', conversationId: 'design-systems', senderId: 'maya', senderName: 'Maya', text: 'I pulled together three ways to make the offline state feel less like an interruption.', createdAt: '09:24', kind: 'text', status: 'delivered', isMine: false},
  {id: 'm-2', conversationId: 'design-systems', senderId: 'me', senderName: 'You', text: 'Perfect. I want it to feel like the app is quietly taking care of things.', createdAt: '09:28', kind: 'text', status: 'delivered', isMine: true},
  {id: 'm-3', conversationId: 'design-systems', senderId: 'nico', senderName: 'Nico', text: 'The sync center can hold the technical detail for people who want it.', createdAt: '09:31', kind: 'text', status: 'delivered', isMine: false},
  {id: 'm-4', conversationId: 'design-systems', senderId: 'me', senderName: 'You', text: 'Yes — calm by default, transparent when something needs attention.', createdAt: '09:36', kind: 'text', status: 'sent', isMine: true},
  {id: 'm-5', conversationId: 'design-systems', senderId: 'maya', senderName: 'Maya', text: 'The new composer feels lovely.', createdAt: '09:42', kind: 'text', status: 'delivered', isMine: false},
];
