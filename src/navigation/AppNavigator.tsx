import React from 'react';
import {DarkTheme, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAppStore} from '../store/useAppStore';
import {LoginScreen} from '../screens/LoginScreen';
import {InboxScreen} from '../screens/InboxScreen';
import {ChatScreen} from '../screens/ChatScreen';
import {SyncCenterScreen} from '../screens/SyncCenterScreen';

export type RootStackParamList = {Login: undefined; Inbox: undefined; Chat: {conversationId: string}; SyncCenter: undefined};
const Stack = createNativeStackNavigator<RootStackParamList>();
export function AppNavigator() { const authenticated = useAppStore(state => state.isAuthenticated); return <NavigationContainer theme={DarkTheme}><Stack.Navigator screenOptions={{headerShown: false, animation: 'fade'}}>{!authenticated ? <Stack.Screen name="Login" component={LoginScreen} /> : <><Stack.Screen name="Inbox" component={InboxScreen} /><Stack.Screen name="Chat" component={ChatScreen} /><Stack.Screen name="SyncCenter" component={SyncCenterScreen} options={{presentation: 'modal'}} /></>}</Stack.Navigator></NavigationContainer>; }
