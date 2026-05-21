import { list, put, del, download } from '@vercel/blob';

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
    // privateストアはdownload()でサーバー側認証を使って取得
    const res = await download(blobs[0].url);
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
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
    // 既存ファイルを全削除してから新規保存（privateストア対応）
    const { blobs } = await list({ prefix: PREFIX });
    await Promise.allSettled(blobs.map(b => del(b.url)));
    await put(`${PREFIX}.json`, JSON.stringify(body), {
      access: 'private',
      contentType: 'application/json',
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
