import React from 'react';
import {View, Text, Image, Pressable, StyleSheet} from 'react-native';
import {colors} from '../theme/colors';
import {fonts} from '../theme/typography';
import Fist from '../../assets/fist/fist.svg';

type Props = {
  hero: any;
  onAdd?: () => void;
  right?: React.ReactNode;
  disabled?: boolean;
};

function toNumberOrNull(v: any): number | null {
  if (v === null || v === undefined) return null;
  const s = String(v).trim().toLowerCase();
  if (s === '' || s === 'null' || s === 'unknown' || s === 'n/a') return null;
  const n = Number(s);
  return isNaN(n) ? null : n;
}

export default function MiniHeroCard({hero, onAdd, right, disabled}: Props) {
  
  const avatar =
    hero?.images?.sm || hero?.images?.md || hero?.images?.lg ||
    hero?.image || hero?.thumbnail || undefined;

  
  const power =
    toNumberOrNull(hero?.powerstats?.power) ??
    toNumberOrNull(hero?.power) ??
    null;

  return (
    <View style={s.card}>
      <Image source={{uri: avatar}} style={s.avatar} />
      <View style={s.info}>
        <Text style={s.name} numberOfLines={1}>{hero?.name}</Text>

        {!!hero?.biography?.fullName && (
          <Text style={s.sub} numberOfLines={1}>{hero.biography.fullName}</Text>
        )}

        {power !== null && (
          <View style={s.statRow}>
            <Fist width={16} height={16} />
            <Text style={s.meta}>
              {' '}{power} <Text style={s.metaDim}>/ 100</Text>
            </Text>
          </View>
        )}
      </View>

      {right ? (
        right
      ) : (
        <Pressable
          style={[s.addBtn, disabled && {opacity: 0.5}]}
          onPress={onAdd}
          disabled={disabled}
        >
          <Text style={s.plus}>+</Text>
        </Pressable>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.subbg,
    borderRadius: 16,
    padding: 8,
  },
  avatar: {width: 60, height: 80, borderRadius: 12, backgroundColor: '#0002'},
  info: {flex: 1, marginLeft: 12},
  name: {color: colors.text, fontFamily: fonts.semiBold, fontSize: 16},
  sub: {color: colors.subtext, fontFamily: fonts.regular, fontSize: 12, marginTop: 2},
  statRow: {flexDirection: 'row', alignItems: 'center', marginTop: 4},
  meta: {color: colors.text, fontFamily: fonts.semiBold, fontSize: 13},
  metaDim: {color: colors.subtext, fontFamily: fonts.regular, fontSize: 12},
  addBtn: {
    width: 50, height: 50, borderRadius: 100,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.heartplaceholder, marginLeft: 8,
  },
  plus: {color: '#fff', fontFamily: fonts.semiBold, fontSize: 20, marginTop: 3, left: 0.5},
});
