import { storage } from '../storage/mmkv';
import type { Hero } from '../types/superhero';

const BASE = 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api';
const HEROES_KEY = 'heroes-cache-v1';
const HEROES_TS  = 'heroes-cache-updatedAt';



export async function getAllHeroes(
  { force = false }: { force?: boolean } = {}
): Promise<Hero[]> {
  
  const cachedStr = storage.getString(HEROES_KEY);
  const cached: Hero[] | null = cachedStr ? JSON.parse(cachedStr) : null;
  if (cached && !force) return cached;

  
  try {
    const res = await fetch(`${BASE}/all.json?ts=${Date.now()}`, {
      headers: {
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const fresh: Hero[] = await res.json();

    storage.set(HEROES_KEY, JSON.stringify(fresh));
    storage.set(HEROES_TS, String(Date.now()));
    return fresh;
  } catch (err) {
    
    if (cached) return cached;
    throw err;
  }
}

export function getHeroesUpdatedAt(): number {
  return Number(storage.getString(HEROES_TS) ?? 0);
}
