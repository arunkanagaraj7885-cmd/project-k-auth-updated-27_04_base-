'use client';

const LEVELS = [
  { id: 'beginner',     label: 'Beginner',     emoji: '🌱', color: '#22c55e' },
  { id: 'intermediate', label: 'Intermediate', emoji: '⚡', color: '#f59e0b' },
  { id: 'advanced',     label: 'Advanced',     emoji: '🔥', color: '#ef4444' },
  { id: 'expert',       label: 'Expert',       emoji: '🚀', color: '#7c3aed' },
];

export default function DifficultySelector({ selected, onChange }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        Difficulty Level <span className="text-red-500">*</span>
      </label>
      <div className="grid grid-cols-4 gap-2">
        {LEVELS.map(({ id, label, emoji, color }) => (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`p-3 rounded-xl border-2 text-center transition-all ${
              selected === id
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="text-xl mb-1">{emoji}</div>
            <p className="text-xs font-medium text-slate-700">{label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
