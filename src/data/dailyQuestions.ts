// src/data/dailyQuestions.ts

export type QuestionCategory =
  | 'emotional-state'
  | 'academic-pressure'
  | 'social-dynamics'
  | 'self-reflection'
  | 'gratitude'
  | 'forward-looking'
  | 'physical-wellbeing'

export interface DailyQuestion {
  id: string
  category: QuestionCategory
  text: string
  followUp?: string  // Optional: shown if user writes more than 100 chars
}

export const DAILY_QUESTIONS: DailyQuestion[] = [

  // ── EMOTIONAL STATE (Question 1 — always used) ─────────────────────────────
  { id: 'es-01', category: 'emotional-state',
    text: 'Describe your emotional state today in your own words. What feeling is sitting heaviest on you right now?',
    followUp: 'When did that feeling start — was there a specific moment?' },

  { id: 'es-02', category: 'emotional-state',
    text: 'If you had to pick one word that sums up your inner weather today, what would it be, and why does it fit?' },

  { id: 'es-03', category: 'emotional-state',
    text: 'What emotion are you most aware of right now that you haven\'t said out loud to anyone today?' },

  { id: 'es-04', category: 'emotional-state',
    text: 'Rate your emotional capacity today — how much bandwidth do you feel like you have left for other people and challenges?',
    followUp: 'What do you think is draining it most?' },

  { id: 'es-05', category: 'emotional-state',
    text: 'Is there something you\'re carrying today that isn\'t yours to carry? Whose problem is it really?' },

  { id: 'es-06', category: 'emotional-state',
    text: 'Compared to this time last week, how does today feel emotionally — and what do you think changed?' },

  // ── ACADEMIC PRESSURE (used when exam-week, homework, test tag is present) ──
  { id: 'ap-01', category: 'academic-pressure',
    text: 'What\'s the single academic thing weighing on you most right now, and what specifically feels hard about it — the workload, the fear of failing, or something else?' },

  { id: 'ap-02', category: 'academic-pressure',
    text: 'On a scale of 1–10, how prepared do you feel for what\'s coming this week academically? What would it take to move that number up by one point?' },

  { id: 'ap-03', category: 'academic-pressure',
    text: 'Is the pressure you\'re feeling right now coming from something external (a test, a deadline, a teacher) or internal (your own standards, fear of disappointing someone)?' },

  { id: 'ap-04', category: 'academic-pressure',
    text: 'When you think about the work ahead, what\'s the first emotion that hits — anxiety, numbness, motivation, dread? Describe what that feels like physically.' },

  { id: 'ap-05', category: 'academic-pressure',
    text: 'Is there something academic you\'ve been avoiding? What story are you telling yourself about why you haven\'t started?' },

  { id: 'ap-06', category: 'academic-pressure',
    text: 'If this exam or assignment didn\'t matter for your grade, would you still feel stressed about it? What does your answer tell you about where the pressure is really coming from?' },

  // ── SOCIAL DYNAMICS (used when social/friendship/relationship tags present) ──
  { id: 'sd-01', category: 'social-dynamics',
    text: 'Did any interaction today leave you feeling drained, uncomfortable, or like you had to perform a version of yourself? Describe what happened.' },

  { id: 'sd-02', category: 'social-dynamics',
    text: 'Is there anyone in your life right now who you feel tension with but haven\'t addressed directly? What\'s stopping you?' },

  { id: 'sd-03', category: 'social-dynamics',
    text: 'Think about the person you spent the most time with today. How did being around them affect your energy and mood?' },

  { id: 'sd-04', category: 'social-dynamics',
    text: 'Is there a friendship or relationship that\'s been taking more from you than it\'s been giving lately? How are you feeling about that?' },

  { id: 'sd-05', category: 'social-dynamics',
    text: 'Did you feel seen and understood by someone today? If yes, who and how — if no, what do you wish someone understood about what you\'re going through?' },

  { id: 'sd-06', category: 'social-dynamics',
    text: 'Is there something you want to say to someone but haven\'t yet? What would saying it risk, and is that risk worth it?' },

  // ── SELF REFLECTION (used on rotation when no specific tags match) ──────────
  { id: 'sr-01', category: 'self-reflection',
    text: 'What\'s one thing you did today that you\'re actually proud of — even if no one else noticed it?' },

  { id: 'sr-02', category: 'self-reflection',
    text: 'If you could replay today and change one decision or moment, what would it be and what would you do differently?' },

  { id: 'sr-03', category: 'self-reflection',
    text: 'What version of yourself showed up today — the one you want to be, or a version you\'re not proud of? What brought that version out?' },

  { id: 'sr-04', category: 'self-reflection',
    text: 'What are you currently tolerating in your life that you know, deep down, you shouldn\'t be?' },

  { id: 'sr-05', category: 'self-reflection',
    text: 'How much of today did you spend doing things that actually align with who you want to become? What got in the way?' },

  { id: 'sr-06', category: 'self-reflection',
    text: 'What\'s a belief about yourself that today either confirmed or challenged?' },

  // ── GRATITUDE (rotated in on low-stress days) ───────────────────────────────
  { id: 'gr-01', category: 'gratitude',
    text: 'Name one thing that happened today — however small — that made life feel a little lighter. Why did it matter to you?' },

  { id: 'gr-02', category: 'gratitude',
    text: 'Who is someone that made today easier or better, and what specifically did they do?' },

  { id: 'gr-03', category: 'gratitude',
    text: 'What\'s something about your current situation — even in its difficulties — that you wouldn\'t trade away?' },

  { id: 'gr-04', category: 'gratitude',
    text: 'What\'s a small physical comfort you experienced today that you usually take for granted?' },

  { id: 'gr-05', category: 'gratitude',
    text: 'Think about something in your life right now that, a year ago, you would have really wanted to have. How do you feel about it now that you have it?' },

  { id: 'gr-06', category: 'gratitude',
    text: 'What\'s one thing today reminded you that you have going for you that you sometimes forget?' },

  // ── FORWARD-LOOKING (Question 3 — always used) ─────────────────────────────
  { id: 'fl-01', category: 'forward-looking',
    text: 'What\'s one thing in the next 48 hours that you\'re either dreading or genuinely looking forward to?' },

  { id: 'fl-02', category: 'forward-looking',
    text: 'If tomorrow goes really well, what does that look like? What has to happen for that to be the case?' },

  { id: 'fl-03', category: 'forward-looking',
    text: 'What\'s something coming up this week that you keep pushing to the back of your mind? What are you avoiding thinking about?' },

  { id: 'fl-04', category: 'forward-looking',
    text: 'Is there anything you want to do or say tomorrow that you didn\'t get to today?' },

  { id: 'fl-05', category: 'forward-looking',
    text: 'What would tomorrow look like if you woke up and decided to protect your energy instead of giving it all away?' },

  { id: 'fl-06', category: 'forward-looking',
    text: 'What\'s one small intention you can set for tomorrow — not a goal, just a direction?' },

  // ── PHYSICAL WELLBEING (used when bad-sleep, physical-pain tags present) ────
  { id: 'pw-01', category: 'physical-wellbeing',
    text: 'How did your body feel today? Where are you holding tension, and when did you first notice it?' },

  { id: 'pw-02', category: 'physical-wellbeing',
    text: 'How did your sleep last night affect your mood and focus today? Be specific — what was different?' },

  { id: 'pw-03', category: 'physical-wellbeing',
    text: 'Did you eat, move, and rest enough today? Which of those three feels most out of balance right now?' },

  { id: 'pw-04', category: 'physical-wellbeing',
    text: 'Is there a physical sensation today — tiredness, a headache, restlessness — that might actually be an emotion in disguise?' },

  { id: 'pw-05', category: 'physical-wellbeing',
    text: 'When was the last time you did something purely for your body\'s comfort — a walk, a stretch, a proper meal? How long ago was that?' },

  { id: 'pw-06', category: 'physical-wellbeing',
    text: 'How is the physical tiredness you\'re feeling today different from emotional tiredness? Which one is heavier right now?' }
]

// ── Question Selection Logic ────────────────────────────────────────────────
export const selectDailyQuestions = (
  tags: string[],
  dayOfYear: number
): [DailyQuestion, DailyQuestion, DailyQuestion] => {
  const pick = (cat: QuestionCategory, offset = 0) => {
    const pool = DAILY_QUESTIONS.filter(q => q.category === cat)
    return pool[(dayOfYear + offset) % pool.length]
  }

  // Q1: always emotional-state
  const q1 = pick('emotional-state')

  // Q2: context-sensitive
  let q2: DailyQuestion
  if (tags.some(t => ['exam week', 'overwhelmed', 'unmotivated'].includes(t)))
    q2 = pick('academic-pressure', 1)
  else if (tags.some(t => ['social anxiety', 'friendship', 'relationship'].includes(t)))
    q2 = pick('social-dynamics', 1)
  else if (tags.some(t => ['bad sleep', 'physical pain'].includes(t)))
    q2 = pick('physical-wellbeing', 1)
  else if (dayOfYear % 2 === 0)
    q2 = pick('self-reflection', 1)
  else
    q2 = pick('gratitude', 1)

  // Q3: always forward-looking
  const q3 = pick('forward-looking', 2)

  return [q1, q2, q3]
}