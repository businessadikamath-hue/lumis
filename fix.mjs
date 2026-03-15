import fs from 'fs';

const fixFile = (path, replacements) => {
  let content = fs.readFileSync(path, 'utf8');
  for (const [from, to] of replacements) {
    content = content.replaceAll(from, to);
  }
  fs.writeFileSync(path, content);
};

// 1. types/entry imports
fixFile('src/utils/streakCalc.ts', [['import { JournalEntry }', 'import type { JournalEntry }']]);
fixFile('src/utils/buildReflectionPayload.ts', [['import { JournalEntry }', 'import type { JournalEntry }']]);
fixFile('src/utils/pdfExport.ts', [['import { JournalEntry } from \'../types/entry\';\n', '']]); // Not used

// 2. other typings
fixFile('src/animations/variants.ts', [['import { Variants }', 'import type { Variants }']]);
fixFile('src/components/ErrorBoundary.tsx', [['import React, { Component, ErrorInfo, ReactNode }', 'import React, { Component, ErrorInfo } from \'react\';\nimport type { ReactNode } from \'react\'']]);
fixFile('src/context/AuthContext.tsx', [['import { Session, User }', 'import type { Session, User }']]);
fixFile('src/context/JournalContext.tsx', [
  ['import { JournalEntry }', 'import type { JournalEntry }'],
  ['{ synced: 1 }', '{ synced: 1 as const }'],
  ['{ synced: 0 }', '{ synced: 0 as const }'],
]);

fixFile('src/db/db.ts', [
  ['import Dexie, { Table }', 'import Dexie from \'dexie\';\nimport type { Table } from \'dexie\';'],
  ['reflection: AIReflection', 'reflection: any']
]);

fixFile('src/db/sync.ts', [
  ['import { JournalEntry, StoredReflection }', 'import type { JournalEntry }']
]);

// 3. Unused imports/vars
fixFile('src/screens/Home.tsx', [['const { user } = useAuth();', 'useAuth(); // used for side effects']]); // assuming user is from useAuth
fixFile('src/screens/Insights.tsx', [['pageVariants, staggerContainer, cardEntrance', 'pageVariants']]);
fixFile('src/screens/Settings.tsx', [['ChevronLeft, LogOut, Bell, Cloud, Trash2, Github', 'ChevronLeft, LogOut, Bell, Cloud, Trash2']]);
fixFile('src/screens/Verify.tsx', [['const { data, error }', 'const { error }']]);
fixFile('src/screens/Welcome.tsx', [
  ['import { motion, AnimatePresence }', 'import { motion }'],
  ['const { data, error }', 'const { error }']
]);

// 4. Component type fix CheckIn Component 
fixFile('src/screens/CheckIn.tsx', [
  ['const handleSubmit = async () => {\n    await addEntry({', 'const handleSubmit = async () => {\n    await addEntry({\n      id: crypto.randomUUID(),']
]);

// 5. Reflection scheduler
fixFile('src/utils/reflectionScheduler.ts', [
  ['> oneWeek', '> (oneWeek as number)'],
  ['lastReflection.createdAt', 'lastReflection.generatedAt'],
  ['const reflection = {', 'const reflection: any = {']
]);

console.log('Fixed');
