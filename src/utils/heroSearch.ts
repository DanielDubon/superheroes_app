export function heroSearchText(h: any): string {
  
  const parts: string[] = [
    h?.name,
    h?.biography?.fullName,
    h?.biography?.alterEgos,
    ...(Array.isArray(h?.biography?.aliases) ? h.biography.aliases : []),
  ]
    .filter(Boolean)
    .map((s) => String(s).toLowerCase());

  return parts.join(" ");
}

export function heroMatchesQuery(h: any, q: string): boolean {
  const t = q.trim().toLowerCase();
  if (!t) return true;
  return heroSearchText(h).includes(t);
}
