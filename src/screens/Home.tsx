import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, StyleSheet, View } from "react-native";
import { getAllHeroes } from "../api/superhero";
import { colors } from "../theme/colors";

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
      <View style={styles.header}>
        <Text style={styles.h1}>Superheroes</Text>
        <Text style={styles.hint}>
          {count !== null ? `${count} heroes` : "cargando…"}
        </Text>
      </View>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  header: { paddingVertical: 8 },
  h1: { color: colors.text, fontSize: 28, fontWeight: "800" },
  hint: { color: colors.subtext, marginTop: 2, fontSize: 12 },
});
