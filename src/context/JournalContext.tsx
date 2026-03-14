import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../db/db';
import { JournalEntry } from '../types/entry';
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

  const fetchEntries = async () => {
    const allEntries = await db.entries.where('deleted').equals(0).toArray();
    setEntries(allEntries.sort((a, b) => b.createdAt - a.createdAt));
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
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

    await db.entries.add(entry);
    await fetchEntries();

    if (user) {
      const { error } = await supabase.from('entries').upsert({
        ...entry,
        user_id: user.id,
        created_at: entry.createdAt,
        updated_at: entry.updatedAt
      });
      if (!error) {
        await db.entries.update(entry.id, { synced: 1 });
      }
    }
  };

  const updateEntry = async (id: string, updates: Partial<JournalEntry>) => {
    const updated = { ...updates, updatedAt: Date.now(), synced: 0 };
    await db.entries.update(id, updated);
    await fetchEntries();

    if (user) {
      const { error } = await supabase.from('entries').upsert({
        ...updated,
        id,
        user_id: user.id,
        updated_at: updated.updatedAt
      });
      if (!error) {
        await db.entries.update(id, { synced: 1 });
      }
    }
  };

  const deleteEntry = async (id: string) => {
    await db.entries.update(id, { deleted: 1, synced: 0 });
    await fetchEntries();

    if (user) {
      const { error } = await supabase.from('entries').update({ deleted: 1 }).eq('id', id);
      if (!error) {
        await db.entries.update(id, { synced: 1 });
      }
    }
  };

  const syncEntries = async () => {
    if (!user) return;
    const unsynced = await db.entries.where('synced').equals(0).toArray();
    for (const entry of unsynced) {
      const { error } = await supabase.from('entries').upsert({
        ...entry,
        user_id: user.id
      });
      if (!error) {
        await db.entries.update(entry.id, { synced: 1 });
      }
    }
    await fetchEntries();
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
