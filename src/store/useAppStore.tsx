import React, {PropsWithChildren, useEffect, useSyncExternalStore} from 'react';
import {create} from 'zustand';
import {conversations, seedMessages} from '../data/mockData';
import {Message, SyncSnapshot} from '../types';
import {SyncEngine} from '../sync/SyncEngine';

interface AppState { isAuthenticated: boolean; isOffline: boolean; activeConversationId: string; messages: Message[]; setOffline: (value: boolean) => void; signIn: () => void; signOut: () => void; addMessage: (message: Message) => void; }
export const useAppStore = create<AppState>(set => ({isAuthenticated: false, isOffline: false, activeConversationId: conversations[0].id, messages: seedMessages, setOffline: isOffline => set({isOffline}), signIn: () => set({isAuthenticated: true}), signOut: () => set({isAuthenticated: false}), addMessage: message => set(state => ({messages: [...state.messages, message]}))}));
export function useSyncSnapshot(): SyncSnapshot { return useSyncExternalStore(SyncEngine.subscribe, SyncEngine.getSnapshot, SyncEngine.getSnapshot); }
export function AppBootstrap({children}: PropsWithChildren) { useEffect(() => { SyncEngine.init(); return SyncEngine.attachLifecycle(); }, []); return <>{children}</>; }
