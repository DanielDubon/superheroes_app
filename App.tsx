import React from "react";
import { StatusBar, useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Tabs from './src/navigation/Tabs';

export default function App() {
  const isDark = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isDark ? 'light-content' : 'dark-content'}
      />
      <Tabs />
    </SafeAreaProvider>
  );
}