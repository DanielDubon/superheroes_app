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
  const clean = name.trim();
  const team: Team = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: clean,
    members: [],
    createdAt: Date.now(),
  };
  const next = [team, ...getTeams()];
  saveTeams(next);
  return team;
}

export function removeTeam(id: string) {
  const next = getTeams().filter(t => t.id !== id);
  saveTeams(next);
}

export function upsertTeams(list: Team[]) {
  saveTeams(list);
}
