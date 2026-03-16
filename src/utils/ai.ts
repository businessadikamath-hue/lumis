// src/utils/ai.ts
import type { JournalEntry } from '../types/entry';

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

export async function generateAIOverview(entries: JournalEntry[], type: 'weekly' | 'monthly') {
  const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;

  if (!apiKey || apiKey === 'your_claude_api_key_here') {
    throw new Error('Claude API key not found. Please set VITE_CLAUDE_API_KEY in your .env file.');
  }

  // Format the data for the AI
  const formattedEntries = entries.map(e => ({
    date: e.date,
    mood: e.mood,
    energy: e.energy,
    stress: e.stress,
    text: e.freeText,
    tags: e.tags.join(', ')
  }));

  const prompt = `
    You are an empathetic mental health AI analyzer for the app Lumis.
    Task: Provide a ${type} report for the student user based on their data.
    
    Data for the ${type}:
    ${JSON.stringify(formattedEntries, null, 2)}
    
    Instructions:
    1. Analyze the correlation between life events mentioned in the text and the mood/energy/stress scores.
    2. Be specific. If they mention a "test", "dog", "gym", or "friend", explain how it affected their scores over time.
    3. Example: "When you had to take your dog to the vet, it led to lower moods and lower sleep for nearly a week."
    4. Provide actionable, supportive insights.

    Output Format (JSON strictly):
    {
      "summary": "2-3 sentences overview of the ${type}",
      "correlations": ["3-4 specific bullet point correlations"],
      "emotionalTone": "one word (e.g. improving, tired, stable, anxious)"
    }
  `;

  const response = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'dangerouslyAllowBrowser': 'true'
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      messages: [
        { role: 'user', content: prompt }
      ]
    })
  });

  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.error?.message || 'Failed to call Claude API');
  }

  const result = await response.json();
  const content = result.content[0].text;
  
  try {
    const jsonStart = content.indexOf('{');
    const jsonEnd = content.lastIndexOf('}') + 1;
    const parsed = JSON.parse(content.substring(jsonStart, jsonEnd));
    return {
      summary: parsed.summary || "No summary provided.",
      correlations: parsed.correlations || [],
      emotionalTone: parsed.emotionalTone || "Unknown"
    };
  } catch (e) {
    return {
      summary: content,
      correlations: [],
      emotionalTone: "Unknown"
    };
  }
}
