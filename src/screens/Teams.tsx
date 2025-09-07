import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

export default function Teams() {
  return (
    <SafeAreaView style={s.root}>
      <Text style={s.txt}>Teams</Text>
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  txt: { color: colors.text, fontFamily: fonts.bold, fontSize: 20 },
});
