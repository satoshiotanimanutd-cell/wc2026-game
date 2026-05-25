// Upstash Redis REST API を使用（Vercel Blob から移行）
const REDIS_URL   = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const KEY = 'wc2026-game-state';

export const dynamic = 'force-dynamic';

const NO_CACHE_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Surrogate-Control': 'no-store',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
};

export async function GET() {
  try {
    const res = await fetch(`${REDIS_URL}/get/${KEY}`, {
      headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`Redis GET failed: ${res.status}`);
    const { result } = await res.json();
    // resultが文字列なら JSON.parse、オブジェクト（Upstashが自動変換）ならそのまま使う
    let data = null;
    if (result !== null && result !== undefined) {
      data = (typeof result === 'string') ? JSON.parse(result) : result;
      // 二重エンコードされていた場合の対応
      if (typeof data === 'string') data = JSON.parse(data);
    }
    return new Response(JSON.stringify(data), { headers: NO_CACHE_HEADERS });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const res = await fetch(`${REDIS_URL}/set/${KEY}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${REDIS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Redis SET failed: ${res.status}`);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
