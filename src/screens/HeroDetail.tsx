import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import Fist from '../../assets/fist/fist.svg';
import Heart from '../../assets/medium-heart/medium-heart.svg';
import FilledHeart from '../../assets/medium-filled-heart/medium-filled-heart.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'HeroDetail'>;

function toNum(v: any): number | null {
  if (v === null || v === undefined) return null;
  const s = String(v).trim().toLowerCase();
  if (!s || s === 'null' || s === 'n/a' || s === 'unknown') return null;
  const n = Number(s);
  return Number.isNaN(n) ? null : n;
}

export default function HeroDetail({ route, navigation }: Props) {
  const hero = route.params.hero;
  const [fav, setFav] = useState(false);

  const banner =
    hero?.images?.lg || hero?.images?.md || hero?.images?.sm || hero?.image || hero?.thumbnail;

  
  const H = Dimensions.get('window').height;
  const BANNER_H = Math.round(H * 0.5);

  const stats: Array<[string, number | null]> = [
    ['Ingeligence', toNum(hero?.powerstats?.intelligence)],
    ['Strength',     toNum(hero?.powerstats?.strength)],
    ['Speed',        toNum(hero?.powerstats?.speed)],
    ['Durability',   toNum(hero?.powerstats?.durability)],
    ['Power',        toNum(hero?.powerstats?.power)],
    ['Combat',       toNum(hero?.powerstats?.combat)],
  ];

  const avg = useMemo(() => {
    const v = stats.map(s => s[1]).filter((n): n is number => n !== null);
    if (!v.length) return null;
    return Math.round(v.reduce((a, b) => a + b, 0) / v.length);
  }, [stats]);

  const LABEL_W = 95;
  
  return (
    <SafeAreaView style={s.safe}>
     
      <View style={s.topBar}>
        <Pressable style={s.circleBtn} onPress={() => navigation.goBack()}>
          <Text style={s.backArrow}>‹</Text>
        </Pressable>
        <Pressable style={s.circleBtn} onPress={() => setFav(x => !x)}>
          {fav ? <FilledHeart width={20} height={20} /> : <Heart width={20} height={20} />}
        </Pressable>
      </View>

     
      {!!banner && <Image source={{ uri: banner }} style={[s.banner, { height: BANNER_H }]} />}

     
      <View style={s.bottom}>
        <Text style={s.title}>{hero?.name}</Text>

        <View style={{ marginTop: 8 }}>
          {!!hero?.biography?.fullName && (
            <Text style={s.meta}>
              <Text style={s.metaLabel}>Real Name: </Text>
              {hero.biography.fullName}
            </Text>
          )}
          {!!hero?.biography?.alterEgos && (
            <Text style={s.meta}>
              <Text style={s.metaLabel}>Alter egos: </Text>
              {hero.biography.alterEgos}
            </Text>
          )}
        </View>

        <View style={s.list}>
          {stats.map(([label, val]) => (
            <View key={label} style={s.row}>
              <Text style={[s.rowLabel, { width: LABEL_W }]}>{label}</Text>
      <Text style={s.rowValue}>{val ?? '—'}</Text>
            </View>
          ))}

          <View style={[s.row, { marginTop: 6 }]}>
    <View style={{ width: LABEL_W, flexDirection: 'row', alignItems: 'center' }}>
      <Fist width={18} height={18} />
      <Text style={s.AvgrowLabel}> Avg. Score:</Text>
    </View>
    <Text style={s.AvgrowValue}>
      {avg ?? '—'} <Text style={s.outOf}>/ 100</Text>
    </Text>
    
  </View>
</View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },

  // header
  topBar: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  circleBtn: {
    width: 44, height: 44, borderRadius: 100,
    backgroundColor: colors.heartplaceholder, alignItems: 'center', justifyContent: 'center',
  },
  backArrow: { color: '#fff', fontSize: 26, fontFamily: fonts.semiBold, marginTop: -2 },

  // imagen
  banner: { width: '100%', resizeMode: 'cover' },

  // mitad inferior con la data
  bottom: {
    flex: 1,
    backgroundColor: colors.subbg,
    paddingHorizontal: 15,
    paddingTop: 14,
  },

  // texto
  title: { color: colors.text, fontSize: 28, fontFamily: fonts.semiBold },
  meta: { color: colors.text, fontFamily: fonts.regular, marginTop: 2, fontSize: 11 },
  metaLabel: { color: colors.subtext, fontFamily: fonts.regular },

  // lista de stats
  list: { marginTop: 7 },
  row: {
    flexDirection: 'row',
    
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  rowLabel: { color: colors.subtext, fontFamily: fonts.regular, fontSize: 11, marginRight: 8 },
  AvgrowLabel: { color: colors.text, fontFamily: fonts.regular, fontSize: 11, marginRight: 8 },
  rowValue: { color: colors.text, fontFamily: fonts.regular, fontSize: 11 },
  AvgrowValue: { color: colors.text, fontFamily: fonts.regular, fontSize: 11, left: 8 },
  outOf: { color: colors.subtext },
});
