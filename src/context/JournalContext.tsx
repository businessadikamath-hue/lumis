import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../db/db';
import type { JournalEntry } from '../types/entry';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

interface JournalContextType {
  entries: JournalEntry[];
  todayEntry: JournalEntry | null;
  loading: boolean;
  addEntry: (entry: Omit<JournalEntry, 'userId' | 'createdAt' | 'updatedAt' | 'synced' | 'deleted'>) => Promise<void>;
  updateEntry: (id: string, updates: Partial<JournalEntry>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  syncEntries: () => Promise<void>;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

export const JournalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEntriesFromDexie = async () => {
    const all = await db.entries.where('deleted').equals(0).toArray();
    setEntries(all.sort((a, b) => b.createdAt - a.createdAt));
  };

  const pullFromSupabase = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('user_id', user.id)
        .eq('deleted', 0);

      if (error) throw error;

      if (data) {
        const mapped: JournalEntry[] = data.map(item => ({
          id: item.id,
          userId: item.user_id,
          date: item.date,
          mood: item.mood,
          energy: item.energy,
          stress: item.stress,
          emoji: item.emoji,
          freeText: item.free_text || item.freeText || '',
          tags: item.tags || [],
          promptResponses: item.prompt_responses || [],
          personalStatement: item.personal_statement || [],
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          synced: 1,
          deleted: 0
        }));
        await db.entries.bulkPut(mapped);
        await fetchEntriesFromDexie();
      }
    } catch (err) {
      console.error('Data pull failed:', err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchEntriesFromDexie();
      if (user) {
        await pullFromSupabase();
        await syncEntries();
      }
      setLoading(false);
    };
    init();
  }, [user]);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayEntry = entries.find(e => e.date === todayStr) || null;

  const addEntry = async (entryData: any) => {
    const entry: JournalEntry = {
      ...entryData,
      id: crypto.randomUUID(),
      userId: user?.id || null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      synced: 0,
      deleted: 0
    };

    // Save locally first
    await db.entries.add(entry);
    await fetchEntriesFromDexie();

    // If logged in, sync to cloud
    if (user && localStorage.getItem('lumis_cloud_sync') !== 'false') {
      const { error } = await supabase.from('entries').upsert({
        id: entry.id,
        user_id: user.id,
        date: entry.date,
        mood: entry.mood,
        energy: entry.energy,
        stress: entry.stress,
        emoji: entry.emoji,
        free_text: entry.freeText,
        tags: entry.tags,
        prompt_responses: entry.promptResponses,
        personal_statement: entry.personalStatement,
        created_at: entry.createdAt,
        updated_at: entry.updatedAt,
        deleted: 0
      });
      if (!error) {
        await db.entries.update(entry.id, { synced: 1 });
        await fetchEntriesFromDexie();
      } else {
        console.error('Cloud save error:', error);
      }
    }
  };

  const updateEntry = async (id: string, updates: Partial<JournalEntry>) => {
    const existing = await db.entries.get(id);
    if (!existing) return;

    const updated = { ...existing, ...updates, updatedAt: Date.now(), synced: 0 as const };
    await db.entries.put(updated);
    await fetchEntriesFromDexie();

    if (user && localStorage.getItem('lumis_cloud_sync') !== 'false') {
      const { error } = await supabase.from('entries').upsert({
        id: updated.id,
        user_id: user.id,
        date: updated.date,
        mood: updated.mood,
        energy: updated.energy,
        stress: updated.stress,
        emoji: updated.emoji,
        free_text: updated.freeText,
        tags: updated.tags,
        prompt_responses: updated.promptResponses,
        personal_statement: updated.personalStatement,
        created_at: updated.createdAt,
        updated_at: updated.updatedAt,
        deleted: 0
      });
      if (!error) {
        await db.entries.update(id, { synced: 1 });
      }
    }
  };

  const deleteEntry = async (id: string) => {
    await db.entries.update(id, { deleted: 1, synced: 0 });
    await fetchEntriesFromDexie();

    if (user) {
      const { error } = await supabase.from('entries').update({ deleted: 1 }).eq('id', id);
      if (!error) {
        await db.entries.update(id, { synced: 1 });
      }
    }
  };

  const syncEntries = async () => {
    if (!user || localStorage.getItem('lumis_cloud_sync') === 'false') return;
    const unsynced = await db.entries.where('synced').equals(0).toArray();
    for (const entry of unsynced) {
      const { error } = await supabase.from('entries').upsert({
        id: entry.id,
        user_id: user.id,
        date: entry.date,
        mood: entry.mood,
        energy: entry.energy,
        stress: entry.stress,
        emoji: entry.emoji,
        free_text: entry.freeText,
        tags: entry.tags,
        prompt_responses: entry.promptResponses,
        personal_statement: entry.personalStatement,
        created_at: entry.createdAt,
        updated_at: entry.updatedAt,
        deleted: entry.deleted
      });
      if (!error) {
        await db.entries.update(entry.id, { synced: 1 });
      }
    }
    await fetchEntriesFromDexie();
  };

  return (
    <JournalContext.Provider value={{ entries, todayEntry, loading, addEntry, updateEntry, deleteEntry, syncEntries }}>
      {children}
    </JournalContext.Provider>
  );
};

export const useJournal = () => {
  const context = useContext(JournalContext);
  if (context === undefined) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
};
