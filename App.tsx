import React from "react";
import { StatusBar, useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Home from "./src/screens/Home";

function App() {
  const isDark = useColorScheme() === "dark";
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <Home />
    </SafeAreaProvider>
  );
}

export default App;
