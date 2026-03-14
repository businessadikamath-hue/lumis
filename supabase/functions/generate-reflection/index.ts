import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')

serve(async (req) => {
  const { type, periodLength, averages, tagFrequency, freeTextSummaries, personalStatements } = await req.json()

  const prompt = `You are Lumis, an empathetic AI mental wellness companion for students. 
  Analyze this ${type} data for a student over the last ${periodLength} days.
  Averages: Mood ${averages.mood}, Energy ${averages.energy}, Stress ${averages.stress}.
  Top Tags: ${JSON.stringify(tagFrequency)}.
  Summaries: ${JSON.stringify(freeTextSummaries)}.
  Statements: ${JSON.stringify(personalStatements)}.

  Provide a thoughtful, warm reflection (max 300 words) and one piece of advice.
  Return JSON: { "content": "...", "advice": "..." }`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }]
    })
  })

  const claudeData = await res.json()
  // Extract and return the JSON from Claude's response
  const result = JSON.parse(claudeData.content[0].text)

  return new Response(JSON.stringify(result), { headers: { "Content-Type": "application/json" } })
})