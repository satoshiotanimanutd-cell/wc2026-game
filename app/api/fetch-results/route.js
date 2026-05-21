import Anthropic from 'anthropic';

export async function POST(request) {
  try {
    const { matches } = await request.json();
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return Response.json({ error: 'No API key' }, { status: 500 });

    const client = new Anthropic({ apiKey });

    const matchList = matches.map(m =>
      `試合${m.id}: ${m.home} vs ${m.away} (${m.dateLabel})`
    ).join('\n');

    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `以下のFIFAワールドカップ2026の試合結果を調べて、JSON形式で返してください。
まだ試合が行われていない場合は null を返してください。

${matchList}

返答はJSONのみ。形式:
[{"id": 試合番号, "homeGoals": ホームの得点, "awayGoals": アウェイの得点}]
試合未実施の場合: [{"id": 試合番号, "homeGoals": null, "awayGoals": null}]`
      }]
    });

    const text = message.content[0].text;
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return Response.json({ error: 'Parse error' }, { status: 500 });

    const results = JSON.parse(jsonMatch[0]);
    return Response.json({ results });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
