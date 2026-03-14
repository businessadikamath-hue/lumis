import { JournalEntry } from '../types/entry';

export const calculateStreak = (entries: JournalEntry[]): number => {
  if (entries.length === 0) return 0;

  const sortedDates = [...new Set(entries.map(e => e.date))].sort().reverse();
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (sortedDates[0] !== today && sortedDates[0] !== yesterday) return 0;

  let streak = 0;
  let curr = new Date(sortedDates[0]);

  for (const dateStr of sortedDates) {
    const d = new Date(dateStr);
    const diff = (curr.getTime() - d.getTime()) / 86400000;
    
    if (diff === 0 || diff === 1) {
      streak++;
      curr = d;
    } else {
      break;
    }
  }

  return streak;
};
