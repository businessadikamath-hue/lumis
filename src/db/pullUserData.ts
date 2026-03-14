import { supabase } from '../lib/supabase';
import { db } from './db';

export const pullUserData = async (userId: string) => {
  // Pull entries
  const { data: entries, error: entryError } = await supabase
    .from('entries')
    .select('*')
    .eq('user_id', userId);

  if (!entryError && entries) {
    for (const entry of entries) {
      await db.entries.put({
        ...entry,
        userId: entry.user_id,
        createdAt: entry.created_at,
        updatedAt: entry.updated_at,
        synced: 1,
        deleted: entry.deleted || 0
      });
    }
  }

  // Pull reflections
  const { data: reflections, error: reflectError } = await supabase
    .from('reflections')
    .select('*')
    .eq('user_id', userId);

  if (!reflectError && reflections) {
    for (const reflect of reflections) {
      await db.reflections.put({
        ...reflect,
        userId: reflect.user_id,
        createdAt: reflect.created_at,
        synced: 1
      });
    }
  }
};
