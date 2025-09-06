import React, { useMemo, useEffect, useState, useCallback } from "react";
import { SafeAreaView, Text, StyleSheet, View, FlatList } from "react-native";
import { getAllHeroes } from "../api/superhero";
import { colors } from "../theme/colors";
import type { Hero } from "../types/superhero";
import SearchBar from "../components/SearchBar";
import HeroCard from "../components/HeroCard";
import { fonts } from '../theme/typography';

export default function Home() {
  const [count, setCount] = useState<number | null>(null);
  const [q, setQ] = useState("");
  const [data, setData] = useState<Hero[]>([]);
  const [favs, setFavs] = useState<Set<number>>(new Set());

  const toggleFav = useCallback((id: number) => {
    setFavs(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const heroes = await getAllHeroes();
        setCount(heroes.length);
        setData(heroes.slice(0, 40));
        console.log("Heroes cargados:", heroes.length);
      } catch (e) {
        console.error("Fallo al jalar los heroes", e);
        setCount(-1);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
  const t = q.trim().toLowerCase();
  if (!t) return data;
  return data.filter(
      h =>
        h.name.toLowerCase().includes(t) ||
        (h.biography?.fullName ?? "").toLowerCase().includes(t)
    );
  }, [q, data]);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.h1}>Superheroes</Text>
        
      </View>

      <View style = {{marginTop: 8, marginBottom: 12}}>
        <SearchBar value={q} onChangeText={setQ} />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(it) => String(it.id)}
        contentContainerStyle={{ paddingBottom: 24, gap: 12 }}
        renderItem={({ item }) => (
          <HeroCard
            hero={item}
            fav={favs.has(item.id)}
            onToggle={toggleFav}
          />
        )}
        extraData={favs}
      />
      
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
  h1: { color: colors.text, fontSize: 28, fontFamily: fonts.semiBold },
  hint: { color: colors.subtext, marginTop: 2, fontSize: 12 },
});
