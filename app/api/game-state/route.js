import { list, put, del } from '@vercel/blob';

const PREFIX = 'wc2026-game-state';

export async function GET() {
  try {
    const { blobs } = await list({ prefix: PREFIX });
    if (!blobs.length) return Response.json(null);
    const res = await fetch(blobs[0].url, { cache: 'no-store' });
    const data = await res.json();
    return Response.json(data);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { blobs } = await list({ prefix: PREFIX });
    await Promise.all(blobs.map(b => del(b.url)));
    await put(`${PREFIX}.json`, JSON.stringify(body), {
      access: 'public',
      contentType: 'application/json',
    });
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
