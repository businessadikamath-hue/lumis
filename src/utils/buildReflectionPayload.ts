import { JournalEntry } from '../types/entry';

export const buildReflectionPayload = (entries: JournalEntry[], type: 'weekly' | 'monthly') => {
  const count = entries.length;
  if (count === 0) return null;

  const averages = {
    mood: entries.reduce((a, b) => a + b.mood, 0) / count,
    energy: entries.reduce((a, b) => a + b.energy, 0) / count,
    stress: entries.reduce((a, b) => a + b.stress, 0) / count,
  };

  const tagFrequency: Record<string, number> = {};
  entries.flatMap(e => e.tags).forEach(tag => {
    tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
  });

  return {
    type,
    periodLength: count,
    averages,
    tagFrequency,
    freeTextSummaries: entries.map(e => ({ date: e.date, text: e.freeText || '' })),
    personalStatements: entries.flatMap(e => e.personalStatement || [])
  };
};
