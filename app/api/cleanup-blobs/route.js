import { list, del } from '@vercel/blob';

export const dynamic = 'force-dynamic';

// Vercel Blob に残っている古いファイルを全削除する管理者用API
export async function POST(request) {
  try {
    // 全Blobを取得（最大1000件ずつ）
    let deleted = 0;
    let cursor;

    do {
      const result = await list({ cursor, limit: 1000 });
      if (result.blobs.length > 0) {
        const urls = result.blobs.map(b => b.url);
        await del(urls);
        deleted += urls.length;
      }
      cursor = result.cursor;
    } while (cursor);

    return new Response(JSON.stringify({ ok: true, deleted }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// 削除前に何件あるか確認する
export async function GET() {
  try {
    let count = 0;
    let totalSize = 0;
    let cursor;

    do {
      const result = await list({ cursor, limit: 1000 });
      count += result.blobs.length;
      totalSize += result.blobs.reduce((s, b) => s + (b.size || 0), 0);
      cursor = result.cursor;
    } while (cursor);

    return new Response(JSON.stringify({ count, totalSizeMB: (totalSize / 1024 / 1024).toFixed(2) }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
