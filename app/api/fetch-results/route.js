export async function POST(request) {
  try {
    const { matches } = await request.json();
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return Response.json({ error: 'ANTHROPIC_API_KEY が設定されていません' }, { status: 500 });

    const matchList = matches.map(m => `試合${m.id}: ${m.home} vs ${m.away}`).join('\n');

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: `FIFA ワールドカップ2026 の以下の試合の最終スコアを教えてください。まだ試合が行われていない場合は null にしてください。\n\n${matchList}\n\nJSON のみで返答してください:\n[{"id":試合番号,"homeGoals":数字またはnull,"awayGoals":数字またはnull}]`,
        }],
      }),
    });

    const data = await res.json();
    const text = data.content?.[0]?.text || '';
    const match = text.match(/\[[\s\S]*?\]/);
    if (!match) return Response.json({ error: 'parse error' }, { status: 500 });

    return Response.json({ results: JSON.parse(match[0]) });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
