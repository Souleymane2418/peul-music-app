import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PlayerProvider } from './src/context/PlayerContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <PlayerProvider>
      <AppNavigator />
      <StatusBar style="light" />
    </PlayerProvider>
  );
}
