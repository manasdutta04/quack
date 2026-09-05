import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppState} from 'react-native';
import Config from 'react-native-config';
import {createClient} from '@supabase/supabase-js';
import {OutboxItem} from '../types';

const runtimeConfig = (globalThis as typeof globalThis & {__QUACK_CONFIG__?: {SUPABASE_URL?: string; SUPABASE_PUBLISHABLE_KEY?: string}}).__QUACK_CONFIG__ ?? {};
const supabaseUrl = runtimeConfig.SUPABASE_URL ?? Config.SUPABASE_URL ?? 'https://placeholder.supabase.co';
const supabaseKey = runtimeConfig.SUPABASE_PUBLISHABLE_KEY ?? Config.SUPABASE_PUBLISHABLE_KEY ?? 'placeholder-publishable-key';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {storage: AsyncStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false},
});

export const isSupabaseConfigured = !supabaseUrl.includes('placeholder');

export async function sendOutboxItem(item: OutboxItem) {
  if (!isSupabaseConfigured) {
    await new Promise<void>(resolve => setTimeout(resolve, 220));
    return {ok: true as const};
  }
  const {error} = await supabase.functions.invoke('sync', {body: {messageId: item.messageId, conversationId: item.conversationId, body: item.body ?? '', kind: item.kind ?? 'text', idempotencyKey: item.messageId}});
  if (error) throw error;
  return {ok: true as const};
}

if (AppState.currentState === 'active') supabase.auth.startAutoRefresh();
AppState.addEventListener('change', state => state === 'active' ? supabase.auth.startAutoRefresh() : supabase.auth.stopAutoRefresh());
