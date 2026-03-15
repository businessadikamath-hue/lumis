import { db } from '../db/db';
import { supabase } from '../lib/supabase';
import { buildReflectionPayload } from './buildReflectionPayload';

export const checkIfReflectionDue = async () => {
  const lastReflection = await db.reflections.orderBy('createdAt').last();
  const now = Date.now();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;

  if (!lastReflection || (now - lastReflection.generatedAt > (oneWeek as number))) {
    return true;
  }
  return false;
};

export const generateReflection = async (type: 'weekly' | 'monthly') => {
  const entries = await db.entries.where('deleted').equals(0).toArray();
  const payload = buildReflectionPayload(entries, type);

  if (!payload) return null;

  const { data, error } = await supabase.functions.invoke('generate-reflection', {
    body: payload
  });

  if (error) throw error;

  const reflection: any = {
    id: crypto.randomUUID(),
    type,
    content: data.content,
    advice: data.advice,
    createdAt: Date.now(),
  };

  await db.reflections.add(reflection);
  return reflection;
};
