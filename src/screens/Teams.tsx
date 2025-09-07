import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  SafeAreaView, View, Text, FlatList, Pressable, Modal,
  TextInput, StyleSheet, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import {colors} from '../theme/colors';
import {fonts} from '../theme/typography';
import {H1} from '../ui/Typography';
import type {Team} from '../types/teams';
import {
  getTeams, createTeam, removeTeam, clearTeams,
  addMember as addMemberToTeam, removeMember as removeMemberFromTeam
} from '../storage/teams';
import {verifyBiometric} from '../native/biometric';
import Logo from '../../assets/logo/logo.svg';

import * as HeroAPI from '../api/superhero';

import HeroCard from '../components/HeroCard';
import MiniHeroCard from '../components/MiniHeroCard';
import SearchIcon from '../../assets/search/search.svg';


type Hero = any;



export default function Teams() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [teams, setTeams] = useState<Team[]>([]);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [teamName, setTeamName] = useState('');

  // detalle
  const [selected, setSelected] = useState<Team | null>(null);

  // picker de heroes
  const [showPicker, setShowPicker] = useState(false);
  const [query, setQuery] = useState('');

  // cargar equipos guardados
  useEffect(() => { setTeams(getTeams()); }, []);

  //cargar heroes de la API 
  const [allHeroes, setAllHeroes] = useState<Hero[]>([]);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const mod: any = HeroAPI;

   
        const fnNames = ['getSuperheroes', 'getAllHeroes', 'fetchSuperheroes', 'list', 'all'];
        let list: any[] | undefined;

        for (const n of fnNames) {
          if (typeof mod[n] === 'function') {
            const r = mod[n]();
            list = (r && typeof r.then === 'function') ? await r : r;
            break;
          }
        }

        if (!Array.isArray(list)) {
          const fallback = mod.default ?? mod.HEROES ?? mod.heroes ?? [];
          list = Array.isArray(fallback) ? fallback : [];
        }

        if (alive) setAllHeroes(list);
      } catch {
        if (alive) setAllHeroes([]);
      }
    })();
    return () => { alive = false; };
  }, []);


  const heroIndex = useMemo(() => {
    const map = new Map<string, Hero>();
    for (const h of allHeroes) {
      if (h?.id != null) map.set(String(h.id), h);
      if (h?.name) map.set(String(h.name), h);
    }
    return map;
  }, [allHeroes]);

  // miembros
  const memberHeroes = useMemo(() => {
    if (!selected) return [];
    return selected.members
      .map(k => heroIndex.get(String(k)))
      .filter(Boolean) as Hero[];
  }, [selected, heroIndex]);

  // candidatos para agregar 
  const candidates = useMemo(() => {
    if (!selected) return [];
    const already = new Set(selected.members.map(String));
    const text = query.trim().toLowerCase();
    const base = text
      ? allHeroes.filter(h => (h?.name || '').toLowerCase().includes(text))
      : allHeroes;
    return base.filter(h => !already.has(String(h?.id)) && !already.has(String(h?.name)));
  }, [allHeroes, selected, query]);

  // ====== acciones lista
  const openCreate = useCallback(async () => {
    try {
      await verifyBiometric();
      setShowCreateTeam(true);
    } catch (e: any) {
      Alert.alert('Verification failed', e?.message ?? 'Try again');
    }
  }, []);

  const confirmClearAll = useCallback(() => {
    Alert.alert('Clear all teams?', 'This cannot be undone.', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete all',
        style: 'destructive' as any,
        onPress: () => {
          clearTeams();
          setTeams([]);
          setSelected(null);
        },
      },
    ]);
  }, []);

  const onCreate = useCallback(() => {
    const n = teamName.trim();
    if (!n) {
      Alert.alert('Enter a team name', 'The name cannot be empty.');
      return;
    }
    const t = createTeam(n);
    setTeams(prev => [t, ...prev]);
    setTeamName('');
    setShowCreateTeam(false);
  }, [teamName]);

  const onRemoveOne = useCallback((id: string) => {
    Alert.alert('Delete team?', 'This cannot be undone.', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive' as any,
        onPress: () => {
          removeTeam(id);
          setTeams(prev => prev.filter(t => t.id !== id));
          if (selected?.id === id) setSelected(null);
        },
      },
    ]);
  }, [selected]);

  const empty = useMemo(() => teams.length === 0, [teams]);

  // ====== acciones detalle
  const openPicker = useCallback(() => {
    setQuery('');
    setShowPicker(true);
  }, []);

  const addHero = useCallback((hero: Hero) => {
    if (!selected) return;
    
    const key = hero?.id != null ? String(hero.id) : String(hero?.name ?? '');
    const updated = addMemberToTeam(selected.id, key);
    if (updated) {
      setSelected(updated);
      setTeams(prev => prev.map(t => (t.id === updated.id ? updated : t)));
    }
  }, [selected]);

  const onRemoveMember = useCallback((index: number) => {
    if (!selected) return;
    Alert.alert('Remove member?', '', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Remove',
        style: 'destructive' as any,
        onPress: () => {
          const updated = removeMemberFromTeam(selected.id, index);
          if (updated) {
            setSelected(updated);
            setTeams(prev => prev.map(t => (t.id === updated.id ? updated : t)));
          }
        },
      },
    ]);
  }, [selected]);

  // ================== RENDER ==================
  if (selected) {
    return (
      <SafeAreaView style={s.root}>
        {/* Header detalle */}
        <View style={s.detailHeader}>
          <Pressable onPress={() => setSelected(null)} hitSlop={12}>
            <Text style={s.back}>‹</Text>
          </Pressable>
          <Text style={s.detailTitle}>{selected.name}</Text>
          <Pressable style={s.headerFab} onPress={openPicker}>
            <Text style={s.plus}>+</Text>
          </Pressable>
        </View>

        {memberHeroes.length === 0 ? (
          <View style={s.emptyDetail}>
            <Text style={s.emptyHint}>No team members</Text>
          </View>
        ) : (
          <FlatList
            data={memberHeroes}
            keyExtractor={(h) => String(h?.id ?? h?.name)}
            contentContainerStyle={{paddingBottom: 24, gap: 12}}
            renderItem={({item, index}) => (
              <Pressable
      onPress={() => nav.navigate('HeroDetail', { hero: item })}
      onLongPress={() => onRemoveMember(index)}
    >
                <HeroCard hero={item} fav={false} onToggle={() => {}} />
              </Pressable>
            )}
          />
        )}

        {/* Picker de miembros mini tarjetas */}
        <Modal
          visible={showPicker}
          animationType="slide"
          onRequestClose={() => setShowPicker(false)}
          transparent={false}
        >
          <SafeAreaView style={s.pickerPage}>
            <Text style={s.pickerTitle}>Add member</Text>

            <View style={s.searchBox}>
             <SearchIcon width={24} height={24} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search"
                placeholderTextColor={colors.subtext}
                style={s.searchInput}
                autoFocus
              />
            </View>

            <FlatList
              data={candidates}
              keyExtractor={(h) => String(h?.id ?? h?.name)}
              contentContainerStyle={{paddingHorizontal: 16, paddingBottom: 20, rowGap: 12}}
              renderItem={({item}) => (
                <MiniHeroCard
                  hero={item}
                  onPress={() => nav.navigate('HeroDetail', { hero: item })}
                  onAdd={() => {
                    addHero(item);
                    setShowPicker(false);
                  }}
                />
              )}
            />
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    );
  }

  // ====== Lista de equipos
  return (
    <SafeAreaView style={s.root}>
      <View style={s.header}>
        <H1>Teams</H1>
        <Pressable
          style={s.headerFab}
          onPress={openCreate}
          onLongPress={confirmClearAll}
          android_ripple={{color: '#00000022', borderless: true}}
        >
          <Text style={s.plus}>+</Text>
        </Pressable>
      </View>

      {empty ? (
        <View style={s.empty}>
          <Logo width={44} height={44} />
          <Text style={s.emptyHint}>Create your first team</Text>
          <Pressable style={s.centerFab} onPress={openCreate} onLongPress={confirmClearAll}>
            <Text style={s.plus}>+</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={teams}
          keyExtractor={t => t.id}
          contentContainerStyle={{paddingBottom: 24, gap: 12}}
          renderItem={({item}) => {
            const count = item.members.length;
            const membersText =
              count === 0 ? 'No members' : count === 1 ? '1 member' : `${count} members`;

            return (
              <Pressable
                style={s.teamCard}
                onPress={() => setSelected(item)}
                onLongPress={() => onRemoveOne(item.id)}
              >
                <View>
                  <Text style={s.teamName}>{item.name || 'Unnamed team'}</Text>
                  <Text style={s.teamMeta}>{membersText}</Text>
                </View>
                <Text style={s.arrow}>›</Text>
              </Pressable>
            );
          }}
        />
      )}

      {/* Crear equipo */}
      <Modal visible={showCreateTeam} transparent animationType="slide" onRequestClose={() => setShowCreateTeam(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={s.modalWrap}>
          <Pressable style={s.scrim} onPress={() => setShowCreateTeam(false)} />
          <View style={s.sheet}>
            <Text style={s.sheetTitle}>Add a new team</Text>
            <Text style={s.label}>Team name:</Text>
            <TextInput
              value={teamName}
              onChangeText={setTeamName}
              placeholder="Thunderbolts"
              placeholderTextColor={colors.subtext}
              style={s.input}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={onCreate}
            />
            <Pressable style={[s.primaryBtn, !teamName.trim() && {opacity: 0.6}]} onPress={onCreate} disabled={!teamName.trim()}>
              <Text style={s.primaryTxt}>Create team</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.bg, paddingHorizontal: 16, paddingTop: 8},

  // Header lista
  header: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  headerFab: {
    width: 50, height: 50, borderRadius: 100, backgroundColor: colors.heartplaceholder,
    alignItems: 'center', justifyContent: 'center', marginTop: 16,
  },
  plus: {color: '#fff', fontSize: 22, fontFamily: fonts.semiBold, marginTop: 3},

  // Tarjetas teams
  teamCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.Herocard, padding: 14, borderRadius: 16, marginTop: 30
  },
  teamName: {color: colors.text, fontFamily: fonts.semiBold, fontSize: 16},
  teamMeta: {color: colors.subtext, marginTop: 2, fontFamily: fonts.regular, fontSize: 12},
  arrow: {color: colors.subtext, fontSize: 28, marginLeft: 8, marginRight: 2, marginTop: -4},

  // Empty lista
  empty: {flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12},
  emptyHint: {color: colors.subtext, fontFamily: fonts.regular},
  centerFab: {
    marginTop: 4, width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.heartplaceholder, alignItems: 'center', justifyContent: 'center',
  },

  // Detalle
  detailHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4,
  },
  back: {color: colors.text, fontSize: 28, fontFamily: fonts.semiBold, marginTop: 4, marginRight: 8},
  detailTitle: {color: colors.text, fontFamily: fonts.semiBold, fontSize: 22, marginTop: 6},
  emptyDetail: {flex: 1, alignItems: 'center', justifyContent: 'center'},

  // Sheet crear
  modalWrap: {flex: 1, justifyContent: 'flex-end'},
  scrim: {...StyleSheet.absoluteFillObject, backgroundColor: '#0007'},
  sheet: {
    backgroundColor: colors.Herocard, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 16, paddingBottom: 24,
  },
  sheetTitle: {color: colors.text, fontFamily: fonts.semiBold, fontSize: 22, marginBottom: 12},
  label: {color: colors.text, fontFamily: fonts.medium, marginBottom: 6},
  input: {
    backgroundColor: colors.text, borderRadius: 12, borderWidth: 1, borderColor: colors.searchSubInputBg,
    color: '#000', paddingHorizontal: 12, paddingVertical: 10, fontFamily: fonts.regular,
  },
  primaryBtn: {
    marginTop: 12, backgroundColor: colors.heartplaceholder, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', height: 46,
  },
  primaryTxt: {color: '#fff', fontFamily: fonts.semiBold, fontSize: 16},

  // Picker
  pickerPage: {flex: 1, backgroundColor: colors.subbg, paddingHorizontal: 16, paddingTop: 8},
  pickerTitle: {color: colors.text, fontFamily: fonts.semiBold, fontSize: 22, marginBottom: 12, marginTop: 8},
  searchBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.searchSubInputBg, borderRadius: 12, paddingHorizontal: 10, marginBottom: 12,
    borderWidth: 1, borderColor: colors.searchSubInputBg,
  },
  searchIcon: {color: colors.subtext, marginRight: 6, fontSize: 14},
  searchInput: {flex: 1, color: colors.text, fontFamily: fonts.regular, paddingVertical: 8},
});
