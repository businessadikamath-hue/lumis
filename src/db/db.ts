// src/db/db.ts
import Dexie from 'dexie';
import type { Table } from 'dexie';
import type { JournalEntry } from '../types/entry'

export class LumisDB extends Dexie {
  entries!: Table<JournalEntry>
  reflections!: Table<StoredReflection>

  constructor() {
    super('LumisDB')
    this.version(2).stores({
      entries:     'id, date, userId, synced, deleted, createdAt',
      reflections: 'id, type, periodStart, periodEnd, generatedAt'
      // type = 'weekly' | 'monthly'
      // Each reflection is stored separately so they can be browsed in history
    })
  }
}

export interface StoredReflection {
  id: string             // uuid
  type: 'weekly' | 'monthly'
  periodStart: string
  periodEnd: string
  generatedAt: number
  reflection: any
}

export const db = new LumisDB()

// Helper: get today's entry (or undefined)
export const getTodayEntry = () => {
  const today = new Date().toISOString().split('T')[0]
  return db.entries.where('date').equals(today).first()
}