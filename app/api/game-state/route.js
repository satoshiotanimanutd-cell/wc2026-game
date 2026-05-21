import { put, head, del } from '@vercel/blob';

const BLOB_KEY = 'wc2026-game-state.json';

async function getState() {
  try {
    const blobList = await head(`https://blob.vercel-storage.com/${BLOB_KEY}`).catch(() => null);
    if (!blobList) return null;
    const res = await fetch(blobList.url);
    return await res.json();
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) return Response.json({ error: 'No token' }, { status: 500 });

    // List blobs to find our state file
    const { list } = await import('@vercel/blob');
    const { blobs } = await list({ prefix: 'wc2026-game-state', token });

    if (!blobs || blobs.length === 0) {
      return Response.json(null);
    }

    const blob = blobs[0];
    const res = await fetch(blob.url);
    const data = await res.json();
    return Response.json(data);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) return Response.json({ error: 'No token' }, { status: 500 });

    const body = await request.json();
    const json = JSON.stringify(body);

    // Delete old blob first
    const { list, del } = await import('@vercel/blob');
    const { blobs } = await list({ prefix: 'wc2026-game-state', token });
    for (const blob of blobs) {
      await del(blob.url, { token });
    }

    // Save new state
    const { put } = await import('@vercel/blob');
    await put('wc2026-game-state.json', json, {
      access: 'public',
      token,
      contentType: 'application/json',
    });

    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
