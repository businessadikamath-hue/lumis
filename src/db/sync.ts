// src/db/sync.ts
import { db } from './db'
import { supabase } from '../lib/supabase'
import type { JournalEntry, StoredReflection } from '../types/entry'

// ── Field name mappers ────────────────────────────────────────────────────
// Supabase stores columns in snake_case. TypeScript types use camelCase.
// These two functions translate between them. Call remoteToLocal() whenever
// you receive a row from Supabase. Call localToRemote() before upsert.

export const remoteToLocal = (row: Record<string, any>): JournalEntry => ({
  id:                 row.id,
  userId:             row.user_id,
  date:               row.date,
  createdAt:          row.created_at,
  updatedAt:          row.updated_at,
  mood:               row.mood,
  energy:             row.energy,
  stress:             row.stress,
  freeText:           row.free_text ?? '',
  promptResponses:    row.prompt_responses ?? [],
  personalStatement:  row.personal_statement ?? [],
  tags:               row.tags ?? [],
  emoji:              row.emoji ?? '',
  synced:             1,   // it came from the server — it's synced by definition
  deleted:            row.deleted ?? 0,
})

export const localToRemote = (e: JournalEntry, userId: string) => ({
  id:                  e.id,
  user_id:             userId,
  date:                e.date,
  created_at:          e.createdAt,
  updated_at:          e.updatedAt,
  mood:                e.mood,
  energy:              e.energy,
  stress:              e.stress,
  free_text:           e.freeText,
  prompt_responses:    e.promptResponses,
  personal_statement:  e.personalStatement,
  tags:                e.tags,
  emoji:               e.emoji,
  deleted:             e.deleted,
})

export const remoteReflectionToLocal = (row: Record<string, any>): StoredReflection => ({
  id:           row.id,
  type:         row.type,
  periodStart:  row.period_start,
  periodEnd:    row.period_end,
  generatedAt:  row.generated_at,
  reflection: {
    generatedAt:     row.generated_at,
    periodStart:     row.period_start,
    periodEnd:       row.period_end,
    summary:         row.summary,
    patterns:        row.patterns ?? [],
    recommendations: row.recommendations ?? [],
    emotionalTone:   row.emotional_tone,
  }
})

export const syncPendingEntries = async (userId: string) => {
  const pending = await db.entries
    .where('synced').equals(0)
    .toArray()

  if (!pending.length) return

  const rows = pending.map(e => ({
    id: e.id,
    user_id: userId,
    date: e.date,
    // ... map all fields to snake_case for Supabase
  }))

  const { error } = await supabase.from('entries').upsert(rows)
  
  if (!error) {
    // Mark all as synced in Dexie
    await Promise.all(
      pending.map(e => db.entries.update(e.id, { synced: 1 }))
    )
  }
}