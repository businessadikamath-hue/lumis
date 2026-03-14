// src/types/entry.ts

export interface JournalEntry {
  id: string            // uuid v4, generated client-side with crypto.randomUUID()
  userId: string | null // null if not logged in (local-only user)
  date: string          // ISO date string: "2025-09-14" (no time, one per day)
  createdAt: number     // Unix timestamp (Date.now()) for sync ordering
  updatedAt: number

  // ── Scores (all 1–10 integers) ──────────
  mood: number          // How are you feeling overall? (1=terrible, 10=great)
  energy: number        // Physical energy level
  stress: number        // Stress level (higher = more stressed)
  
  // ── Journal content ────────────────────
  freeText: string      // Free-form text entry, max 5000 chars
  promptResponses: PromptResponse[] // Answers to structured prompts (see below)
  tags: string[]        // e.g. ["exam-week", "bad-sleep", "social"]
  emoji: string         // Single emoji the user picks as their "mood icon"

  // ── Personal Statement (strategic daily questions) ─
  personalStatement: PersonalStatementResponse[]
  // Each question is answered once per check-in.
  // The questions are dynamically selected from DAILY_QUESTIONS (see below).
  // These are the primary text fed to the AI reflection engine.

  // ── AI Reflection cache ────────────────
  aiWeeklyReflection?: AIReflection   // Stored after weekly AI call
  aiMonthlyReflection?: AIReflection  // Stored after monthly AI call

  // ── Metadata ───────────────────────────
  synced: 0 | 1         // 0 = not yet sent to Supabase
  deleted: 0 | 1        // Soft delete flag (for sync reconciliation)
}

export interface PromptResponse {
  promptId: string      // References a static prompt from the prompt library
  response: string      // The user's written answer
}

export interface PersonalStatementResponse {
  questionId: string    // References DAILY_QUESTIONS array
  question: string      // The full question text (stored so it's readable in history)
  response: string      // The user's written answer, max 800 chars
}

export interface AIReflection {
  generatedAt: number   // Unix timestamp of when Claude generated this
  periodStart: string   // ISO date string of period start
  periodEnd: string     // ISO date string of period end
  summary: string       // 2–3 sentence summary paragraph from Claude
  patterns: string[]    // Bullet-point patterns Claude identified (3–5 items)
  recommendations: string[] // Actionable suggestions Claude made (2–3 items)
  emotionalTone: string // One-word label: "anxious", "improving", "stable", etc.
}