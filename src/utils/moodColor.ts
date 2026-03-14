export const getMoodColor = (score: number): string => {
  if (score <= 2) return '#ff4757'; // mood-1: deep red
  if (score <= 4) return '#ff8c69'; // mood-3: coral
  if (score <= 6) return '#ffcf70'; // mood-5: amber
  if (score <= 8) return '#4fd1a0'; // mood-7: mint
  return '#5ec4ff';               // mood-9: sky
};

export const getMoodLabel = (score: number): string => {
  const labels = [
    '',
    'Really rough',
    'Struggling',
    'Pretty low',
    'Below average',
    'Okay',
    'Pretty good',
    'Good',
    'Great',
    'Really well',
    'Amazing'
  ];
  return labels[score] ?? 'Unknown';
};
