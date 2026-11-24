import { Redis } from '@upstash/redis';

/**
 * Guest wishes, stored newest-first in a Redis list.
 * Env vars (KV_REST_API_URL / KV_REST_API_TOKEN or UPSTASH_REDIS_REST_*) come from the
 * Upstash integration connected to this Vercel project.
 */

type StoredWish = { id: string; name: string; message: string; at: number };

const KEY = 'wishes';
const MAX_NAME = 60;
const MAX_MESSAGE = 500;
const RATE_LIMIT = 5; // posts per IP per minute

let redis: Redis | null = null;
const db = () => (redis ??= Redis.fromEnv());

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

export async function GET() {
  try {
    const wishes = await db().lrange<StoredWish>(KEY, 0, 199);
    return json(wishes);
  } catch {
    return json({ error: 'Could not load wishes' }, 500);
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const b = (body ?? {}) as Record<string, unknown>;
  const name = typeof b.name === 'string' ? b.name.trim() : '';
  const message = typeof b.message === 'string' ? b.message.trim() : '';
  if (!name || name.length > MAX_NAME || !message || message.length > MAX_MESSAGE) {
    return json({ error: `Name (1–${MAX_NAME} chars) and message (1–${MAX_MESSAGE} chars) are required` }, 400);
  }

  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const rlKey = `rl:${ip}`;
    const hits = await db().incr(rlKey);
    if (hits === 1) await db().expire(rlKey, 60);
    if (hits > RATE_LIMIT) return json({ error: 'Too many wishes, please wait a minute' }, 429);

    const wish: StoredWish = { id: crypto.randomUUID(), name, message, at: Date.now() };
    await db().lpush(KEY, wish);
    return json(wish, 201);
  } catch {
    return json({ error: 'Could not save wish' }, 500);
  }
}
