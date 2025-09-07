import { storage } from './mmkv';

const KEY = 'favs';

export function loadFavs(): Set<number> {
  try {
    const raw = storage.getString(KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as number[];
    return new Set(arr);
  } catch {
    return new Set();
  }
}

export function saveFavs(favs: Set<number>) {
  const arr = Array.from(favs);
  storage.set(KEY, JSON.stringify(arr));
}
