// src/components/Calendar.tsx
import React from 'react';
import type { JournalEntry } from '../types/entry';
import { Check, X } from 'lucide-react';

interface CalendarProps {
  entries: JournalEntry[];
}

export const Calendar: React.FC<CalendarProps> = ({ entries }) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const entryDates = new Set(entries.map(e => e.date));
  const monthStr = today.toLocaleString('default', { month: 'long' });

  return (
    <div className="glass-card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 className="t-heading" style={{ fontSize: '16px' }}>{monthStr} {year}</h3>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-violet)' }} />
            <span className="t-caption" style={{ fontSize: '10px' }}>Entry</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
            <span className="t-caption" style={{ fontSize: '10px' }}>Missed</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center' }}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
          <span key={d} className="t-mono" style={{ fontSize: '11px', opacity: 0.4, paddingBottom: '8px' }}>{d}</span>
        ))}
        {blanks.map(b => <div key={`b-${b}`} />)}
        {days.map(day => {
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isToday = day === today.getDate();
          const hasEntry = entryDates.has(dateStr);
          const isPast = day < today.getDate();

          return (
            <div 
              key={day} 
              style={{ 
                position: 'relative',
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '10px',
                background: hasEntry ? 'rgba(124, 107, 255, 0.1)' : isToday ? 'rgba(255,255,255,0.05)' : 'transparent',
                border: isToday ? '1px solid var(--accent-violet-20)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              <span className="t-mono" style={{ fontSize: '13px', color: hasEntry ? 'white' : isToday ? 'var(--accent-violet)' : 'rgba(255,255,255,0.4)' }}>
                {day}
              </span>
              {hasEntry && (
                <Check size={8} color="var(--accent-violet)" style={{ position: 'absolute', top: '2px', right: '2px' }} />
              )}
              {isPast && !hasEntry && (
                <X size={8} color="rgba(255,255,255,0.1)" style={{ position: 'absolute', top: '2px', right: '2px' }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
