import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { View, FlatList, Text, StyleSheet, RefreshControl, SafeAreaView } from 'react-native';
import { getAllHeroes } from '../api/superhero';
import type { Hero } from '../types/superhero';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { useFavs } from '../storage/favs';
import HeroCard from '../components/HeroCard';
import { H1 } from '../ui/Typography';

export default function Favorites() {
  const { favs, toggle } = useFavs();
  const [all, setAll] = useState<Hero[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    let alive = true;
    getAllHeroes().then(h => { if (alive) setAll(h); });
    return () => { alive = false; };
  }, []);

  const onlyFavs = useMemo(
    () => all.filter(h => favs.has(h.id)),
    [all, favs]
  );

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return onlyFavs;
    return onlyFavs.filter(h =>
      h.name.toLowerCase().includes(t) ||
      (h.biography?.fullName ?? '').toLowerCase().includes(t)
    );
  }, [q, onlyFavs]);

  const onRefresh = useCallback(async () => {
    try {
      setLoading(true);
      const fresh = await getAllHeroes({ force: true });
      setAll(fresh);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <SafeAreaView style={styles.root}>
    <View style={styles.header}>
      <H1>Favorites</H1>

      

      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No favorites yet</Text>
          <Text style={styles.emptyHint}>
            Tap the heart on any hero to save it here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(it) => String(it.id)}
          contentContainerStyle={{ paddingBottom: 24, gap: 12 , paddingTop: 25}}
          renderItem={({ item }) => (
            <HeroCard hero={item} fav={true} onToggle={toggle} />
          )}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={onRefresh}
              tintColor={colors.text}
              colors={[colors.text]}
            />
          }
        />
      )}
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: 16,
  },
  h1: { color: colors.text, fontSize: 28, fontFamily: fonts.semiBold },
  header: { paddingTop: 8, paddingBottom: 4 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { color: colors.text, fontFamily: fonts.semiBold, fontSize: 18 },
  emptyHint: { color: colors.subtext, marginTop: 6, fontFamily: fonts.regular },
});
