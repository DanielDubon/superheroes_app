import { storage } from './mmkv';
import type { Team } from '../types/teams';

const TEAMS_KEY = 'teams-v1';

export function getTeams(): Team[] {
  try {
    const raw = storage.getString(TEAMS_KEY);
    return raw ? (JSON.parse(raw) as Team[]) : [];
  } catch {
    return [];
  }
}

function saveTeams(list: Team[]) {
  storage.set(TEAMS_KEY, JSON.stringify(list));
}

export function createTeam(name: string): Team {
  const team: Team = {
    id: String(Date.now()),
    name: name.trim(),
    members: [],
    createdAt: Date.now(),          
  };

  const all = getTeams();
  const updated = [team, ...all];
  saveTeams(updated);          
  return team;
}

export function removeTeam(id: string) {
  const next = getTeams().filter(t => t.id !== id);
  saveTeams(next);
}

export function upsertTeams(list: Team[]) {
  saveTeams(list);
}

export function clearTeams() {
  saveTeams([]);
}


export function addMember(teamId: string, memberName: string): Team | null {
  const list = getTeams();
  const idx: number = list.findIndex(t => t.id === teamId);
  if (idx < 0) return null;

  const name = memberName.trim();
  if (!name) return null;

  const updatedTeam: Team = {
    ...list[idx],
    members: [...(list[idx].members ?? []), name],
  };

  const next = [...list];
  next[idx] = updatedTeam;
  saveTeams(next);
  return updatedTeam;
}

export function removeMember(teamId: string, memberIndex: number): Team | null {
  const list = getTeams();
  const idx: number = list.findIndex(t => t.id === teamId);
  if (idx < 0) return null;

  const updatedTeam: Team = {
    ...list[idx],
    members: (list[idx].members ?? []).filter((_, i) => i !== memberIndex),
  };

  const next = [...list];
  next[idx] = updatedTeam;
  saveTeams(next);
  return updatedTeam;
}
