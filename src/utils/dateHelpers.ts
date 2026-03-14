export const getDateNDaysAgo = (n: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
};

export const getDayOfYear = (date: Date): number => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = (date.getTime() - start.getTime()) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
  return Math.floor(diff / 86400000);
};

export const getPreviousMonthRange = () => {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  const firstDay = new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0];
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().split('T')[0];
  return { firstDay, lastDay };
};
