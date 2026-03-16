// src/utils/ai.ts
import type { JournalEntry } from '../types/entry';

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

export async function generateAIOverview(entries: JournalEntry[]) {
  const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;

  if (!apiKey) {
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
    You are an empathetic mental health AI analyzer. 
    Analyze the following journal entries and mood data for a student. 
    Look for correlations between their life events (in the text) and their mood scores.
    
    Data:
    ${JSON.stringify(formattedEntries, null, 2)}
    
    Output Format (JSON):
    {
      "summary": "2-3 sentences overall",
      "correlations": ["bullet point correlation 1", "bullet point correlation 2"],
      "emotionalTone": "one word"
    }
  `;

  const response = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'dangerouslyAllowBrowser': 'true' // Note: This header is usually for SDK, direct fetch might need different handling or a proxy
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
  
  // Try to parse the JSON out of the response
  try {
    const jsonStart = content.indexOf('{');
    const jsonEnd = content.lastIndexOf('}') + 1;
    return JSON.parse(content.substring(jsonStart, jsonEnd));
  } catch (e) {
    return {
      summary: content,
      correlations: [],
      emotionalTone: "Unknown"
    };
  }
}
