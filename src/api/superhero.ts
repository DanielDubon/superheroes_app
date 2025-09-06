import type { Hero } from "../types/superhero";

const BASE =
  "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api";

export async function getAllHeroes(): Promise<Hero[]> {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), 10000);

  try {
    const res = await fetch(`${BASE}/all.json`, { signal: ac.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as Hero[];
  } finally {
    clearTimeout(t);
  }
}
