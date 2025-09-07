export function toNum(v: any): number | null {
  if (v === null || v === undefined) return null;
  const s = String(v).trim().toLowerCase();
  if (!s || s === 'null' || s === 'n/a' || s === 'unknown') return null;
  const n = Number(s);
  return Number.isNaN(n) ? null : n;
}

export function getAvgScore(hero: any): number | null {
  const vals = [
    toNum(hero?.powerstats?.intelligence),
    toNum(hero?.powerstats?.strength),
    toNum(hero?.powerstats?.speed),
    toNum(hero?.powerstats?.durability),
    toNum(hero?.powerstats?.power),
    toNum(hero?.powerstats?.combat),
  ].filter((n): n is number => n !== null);

  if (!vals.length) return null;
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}
