import React from "react";
import { StatusBar, useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Home from "./src/screens/Home";

function App() {
  const isDark = useColorScheme() === "dark";
  return (
    
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <Home />
    </SafeAreaProvider>
  );
}

export default App;
