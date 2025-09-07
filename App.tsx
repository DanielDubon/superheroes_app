import React from "react";
import { StatusBar, useColorScheme } from "react-native";
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  const isDark = useColorScheme() === 'dark';

  return <RootNavigator />;
}