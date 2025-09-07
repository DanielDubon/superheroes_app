import { storage } from './mmkv';

const FAVS_KEY = 'favs-v1';

export function loadFavs(): Set<number> {
  try {
    const s = storage.getString(FAVS_KEY);
    return s ? new Set<number>(JSON.parse(s)) : new Set<number>();
  } catch {
    return new Set<number>();
  }
}

export function saveFavs(next: Set<number>) {
  storage.set(FAVS_KEY, JSON.stringify([...next]));
}

import { useCallback, useEffect, useState } from 'react';

export function useFavs() {
  const [favs, setFavs] = useState<Set<number>>(loadFavs());

  useEffect(() => {
    const sub = storage.addOnValueChangedListener((changedKey) => {
      if (changedKey === FAVS_KEY) setFavs(loadFavs());
    });
    return () => sub.remove();
  }, []);

  const toggle = useCallback((id: number) => {
    const cur = loadFavs();
    cur.has(id) ? cur.delete(id) : cur.add(id);
    saveFavs(cur); 
  }, []);

  const isFav = useCallback((id: number) => favs.has(id), [favs]);

  return { favs, toggle, isFav };
}
