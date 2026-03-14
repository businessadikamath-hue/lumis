import { getMoodLabel } from '../utils/moodColor';

interface MoodSliderProps {
  label: string;
  value: number;
  setValue: (val: number) => void;
  color: string;
}

export const MoodSlider: React.FC<MoodSliderProps> = ({ label, value, setValue, color }) => {
  return (
    <div className="glass-card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span className="t-heading" style={{ fontSize: '14px' }}>{label}</span>
        <span className="t-mono" style={{ color }}>{value}/10</span>
      </div>
      <input 
        type="range" min="1" max="10" step="1"
        value={value} onChange={e => setValue(Number(e.target.value))}
        style={{ 
          width: '100%', height: '5px', borderRadius: '5px', outline: 'none',
          appearance: 'none', 
          background: `linear-gradient(to right, ${color} 0%, ${color} ${((value-1)/9)*100}%, rgba(255,255,255,0.1) ${((value-1)/9)*100}%, rgba(255,255,255,0.1) 100%)`
        }}
      />
      <p className="t-caption" style={{ marginTop: '12px', textAlign: 'right', color: 'var(--text-secondary)' }}>
        {label === 'Overall Mood' ? getMoodLabel(value) : (value > 5 ? 'High' : (value < 5 ? 'Low' : 'Moderate'))}
      </p>
    </div>
  );
};
