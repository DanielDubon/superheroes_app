import React, { useMemo, useEffect, useState, useCallback } from "react";
import { SafeAreaView, Text, StyleSheet, View, FlatList, ActivityIndicator } from "react-native";
import { getAllHeroes } from "../api/superhero";
import { colors } from "../theme/colors";
import type { Hero } from "../types/superhero";
import SearchBar from "../components/SearchBar";
import HeroCard from "../components/HeroCard";
import { fonts } from '../theme/typography';
import { loadFavs, saveFavs } from '../storage/favs';
import { H1 } from '../ui/Typography';

export default function Home() {
  const [count, setCount] = useState<number | null>(null);
  const [q, setQ] = useState("");
  const [data, setData] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);
  const [favs, setFavs] = useState<Set<number>>(new Set());
  
  useEffect(() => {
  setFavs(loadFavs());
}, []);

  const toggleFav = useCallback((id: number) => {
    setFavs(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      saveFavs(next);
      return next;
    });
  }, []);

 useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const cached = await getAllHeroes();
        if (!alive) return;
        console.log("[HOME] cached len:", cached.length);
        setData(cached);
        setCount(cached.length);
      } catch (e) {
        console.warn("[HOME] no cache:", e);
      } finally {
        setLoading(false);
      }

      try {
        const fresh = await getAllHeroes({ force: true }); 
        if (!alive) return;
        console.log("[HOME] fresh len:", fresh.length);
        setData(fresh);
        setCount(fresh.length);
      } catch (e) {
        console.warn("[HOME] refresh failed:", e);
      }
    })();

    return () => { alive = false; };
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
        <H1>Superheroes</H1>
      </View>

      <View style={{ marginTop: 8, marginBottom: 12 }}>
        <SearchBar value={q} onChangeText={setQ} />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(it) => String(it.id)}
        contentContainerStyle={{ paddingBottom: 24 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => (
          <HeroCard hero={item} fav={favs.has(item.id)} onToggle={toggleFav} />
        )}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 32 }}>
            {loading ? (
              <>
                <ActivityIndicator color={colors.subtext} />
                <Text style={{ color: colors.subtext, marginTop: 8 }}>
                  Cargando…
                </Text>
              </>
            ) : (
              <Text style={{ color: colors.subtext }}>
                Sin datos. ¿Hay internet? (cerrar/abrir para reintentar)
              </Text>
            )}
          </View>
        }
        extraData={favs}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 16},
  header: { paddingTop: 8,paddingVertical: 8 },
  h1: { color: colors.text, fontSize: 28, fontFamily: fonts.semiBold },
});