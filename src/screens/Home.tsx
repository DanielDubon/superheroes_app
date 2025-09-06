import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";

import { getAllHeroes } from "../api/superhero";

export default function Home() {

  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const heroes = await getAllHeroes();
        setCount(heroes.length);
        console.log("Heroes cargados:", heroes.length);
      } catch (e) {
        console.error("Fallo al jalar los heroes", e);
        setCount(-1);
      }
    })();
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.title}>
    Superheroes - Home {count !== null ? `(${count})` : ""}
  </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "700" },
});
