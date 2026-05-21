import Anthropic from 'anthropic';

export async function POST(request) {
  try {
    const { matches } = await request.json();
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const matchList = matches
      .map(m => `試合${m.id}: ${m.home} vs ${m.away}`)
      .join('\n');

    const msg = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `FIFA ワールドカップ2026 の以下の試合の最終スコアを教えてください。まだ試合が行われていない場合は null にしてください。\n\n${matchList}\n\nJSON のみで返答してください:\n[{"id":試合番号,"homeGoals":数字またはnull,"awayGoals":数字またはnull}]`,
      }],
    });

    const text = msg.content[0].text;
    const match = text.match(/\[[\s\S]*?\]/);
    if (!match) return Response.json({ error: 'parse error' }, { status: 500 });

    return Response.json({ results: JSON.parse(match[0]) });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
