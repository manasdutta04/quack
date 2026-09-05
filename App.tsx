import 'react-native-gesture-handler';

import React from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {AppNavigator} from './src/navigation/AppNavigator';
import {AppBootstrap} from './src/store/useAppStore';

export default function App() {
  const scheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={scheme === 'light' ? 'dark-content' : 'light-content'} />
      <AppBootstrap>
        <AppNavigator />
      </AppBootstrap>
    </SafeAreaProvider>
  );
}
