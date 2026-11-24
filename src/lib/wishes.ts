export type Wish = {
  name: string;
  message: string;
};

export type StoredWish = Wish & { id: string; at: number };

const isStoredWish = (w: unknown): w is StoredWish => {
  const o = w as StoredWish | null;
  return !!o && typeof o.id === 'string' && typeof o.name === 'string' && typeof o.message === 'string';
};

/**
 * Loads every guest's wish (newest first) from the /api/wishes Vercel Function.
 * Returns [] if the API is unreachable (e.g. plain `vite dev`), so the page still renders.
 */
export async function fetchWishes(): Promise<StoredWish[]> {
  try {
    const res = await fetch('/api/wishes', { headers: { accept: 'application/json' } });
    if (!res.ok) return [];
    const data: unknown = await res.json();
    return Array.isArray(data) ? data.filter(isStoredWish) : [];
  } catch {
    return [];
  }
}

/** Saves a wish for everyone to see. Throws if it could not be saved. */
export async function submitWish(wish: Wish): Promise<StoredWish> {
  const res = await fetch('/api/wishes', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(wish),
  });
  const data: unknown = await res.json().catch(() => null);
  if (!res.ok || !isStoredWish(data)) {
    const msg = (data as { error?: string } | null)?.error;
    throw new Error(msg || 'Could not send wish');
  }
  return data;
}
