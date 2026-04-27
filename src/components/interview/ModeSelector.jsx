'use client';
import { Zap, BookOpen } from 'lucide-react';

const MODES = [
  {
    id: 'mock',
    icon: Zap,
    label: 'Mock Interview',
    description: 'Short 5-min sessions with 4–5 quick questions. Great for daily practice.',
    color: '#2563eb',
  },
  {
    id: 'full',
    icon: BookOpen,
    label: 'Full Interview',
    description: 'Up to 15-minute sessions simulating a real interview round.',
    color: '#7c3aed',
  },
];

export default function ModeSelector({ selected, onChange }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        Interview Mode <span className="text-red-500">*</span>
      </label>
      <div className="grid grid-cols-2 gap-3">
        {MODES.map(({ id, icon: Icon, label, description, color }) => (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              selected === id
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-200 bg-white hover:border-blue-200'
            }`}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
              style={{ backgroundColor: `${color}18` }}
            >
              <Icon size={16} style={{ color }} />
            </div>
            <p className="font-semibold text-slate-800 text-sm">{label}</p>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
