import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView, View, Text, FlatList, Pressable, Modal,
  TextInput, StyleSheet, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { H1 } from '../ui/Typography';
import type { Team } from '../types/teams';
import { getTeams, createTeam } from '../storage/teams';
import { verifyBiometric } from '../native/biometric';
import Logo from '../../assets/logo/logo.svg';

export default function Teams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => { setTeams(getTeams()); }, []);

  const openCreate = useCallback(async () => {
    try {
      await verifyBiometric();
      setShow(true);
    } catch (e: any) {
      Alert.alert('Verification failed', e?.message ?? 'Try again');
    }
  }, []);

  const onCreate = useCallback(() => {
    const n = name.trim();
   
   
    const t = createTeam(n);
    setTeams(prev => [t, ...prev]);
    setName('');
    setShow(false);
  }, [name, teams]);

  const empty = useMemo(() => teams.length === 0, [teams]);

  return (
    <SafeAreaView style={s.root}>
    
      <View style={s.header}>
        <H1>Teams</H1>
        <Pressable style={s.headerFab} onPress={openCreate} android_ripple={{ color: '#00000022', borderless: true }}>
          <Text style={s.plus}>+</Text>
        </Pressable>
      </View>

        
      {empty ? (
        <View style={s.empty}>
          <Logo width={24} height={24} />
          <Text style={s.emptyHint}>Create your first team</Text>
          <Pressable style={s.centerFab} onPress={openCreate}>
            <Text style={s.plus}>+</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={teams}
          keyExtractor={t => t.id}
          contentContainerStyle={{ paddingBottom: 24, gap: 12 }}
          renderItem={({ item }) => (
            <Pressable style={s.teamCard}>
              <View>
                <Text style={s.teamName}>{item.name}</Text>
                <Text style={s.teamMeta}>
                  {item.members.length === 0 ? 'No members' : `${item.members.length} member(s)`}
                </Text>
              </View>
              <Text style={s.arrow}>›</Text>
            </Pressable>
          )}
        />
      )}

      
      <Modal visible={show} transparent animationType="slide" onRequestClose={() => setShow(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={s.modalWrap}>
          <Pressable style={s.scrim} onPress={() => setShow(false)} />
          <View style={s.sheet}>
            <Text style={s.sheetTitle}>Add a new team</Text>
            <Text style={s.label}>Team name:</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Thunderbolts"
              placeholderTextColor={colors.subtext}
              style={s.input}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={onCreate}
            />
            <Pressable style={s.primaryBtn} onPress={onCreate}>
              <Text style={s.primaryTxt}>Create team</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 16, paddingTop: 8 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerFab: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.heartplaceholder,
    alignItems: 'center', justifyContent: 'center',
  },
  plus: { color: '#fff', fontSize: 22, fontFamily: fonts.semiBold, marginTop: -2 },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyIcon: { fontSize: 64, color: colors.subtext, opacity: 0.6 },
  emptyHint: { color: colors.subtext, fontFamily: fonts.regular },
  centerFab: {
    marginTop: 4, width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.heartplaceholder, alignItems: 'center', justifyContent: 'center',
  },

  teamCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.Herocard, padding: 14, borderRadius: 16,
  },
  teamName: { color: colors.text, fontFamily: fonts.semiBold, fontSize: 16 },
  teamMeta: { color: colors.subtext, marginTop: 2, fontFamily: fonts.regular, fontSize: 12 },
  arrow: { color: colors.subtext, fontSize: 28, marginLeft: 8, marginRight: 2 },

  
  modalWrap: { flex: 1, justifyContent: 'flex-end' },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: '#0007' },
  sheet: {
    backgroundColor: colors.Herocard, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 16, paddingBottom: 24,
  },
  sheetTitle: { color: colors.text, fontFamily: fonts.semiBold, fontSize: 22, marginBottom: 12 },
  label: { color: colors.text, fontFamily: fonts.medium, marginBottom: 6 },
  input: {
    backgroundColor: colors.SearchinputBg, borderRadius: 12, borderWidth: 1, borderColor: colors.border,
    color: colors.text, paddingHorizontal: 12, paddingVertical: 10, fontFamily: fonts.regular,
  },
  primaryBtn: {
    marginTop: 12, backgroundColor: colors.heartplaceholder, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', height: 46,
  },
  primaryTxt: { color: '#fff', fontFamily: fonts.semiBold, fontSize: 16 },
});
