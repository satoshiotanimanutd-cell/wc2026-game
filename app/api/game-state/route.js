import { list, put, del, get } from '@vercel/blob';

const PREFIX = 'wc2026-game-state';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { blobs } = await list({ prefix: PREFIX });
    if (!blobs.length) {
      return new Response(JSON.stringify(null), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
        },
      });
    }
    // v2.4.0: get()でprivateブロブを取得（accessはストアの種別に合わせる）
    const result = await get(blobs[0].url, { access: 'private' });
    if (!result || !result.stream) {
      throw new Error('blob not found or empty');
    }
    const data = await new Response(result.stream).json();
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Surrogate-Control': 'no-store',
        'CDN-Cache-Control': 'no-store',
        'Vercel-CDN-Cache-Control': 'no-store',
      },
    });
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
    // v2.4.0: putにaccessパラメータ不要（ストア設定で自動決定）
    const { blobs } = await list({ prefix: PREFIX });
    await Promise.allSettled(blobs.map(b => del(b.url)));
    await put(`${PREFIX}.json`, JSON.stringify(body), {
      access: 'private',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return new Response(JSON.stringify({ ok: true }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
