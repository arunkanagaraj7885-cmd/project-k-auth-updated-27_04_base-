'use client';
import { Zap, Target } from 'lucide-react';

export default function ModeSelector({ selected, onChange }) {
  const modes = [
    {
      id: 'mock',
      title: 'Mock Interview',
      desc: 'Best for daily use. Get 3 focused questions with instant feedback. Mock interview scores are not calculated. This is only for your training purpose.',
      duration: '3 to 5 minutes',
      icon: Zap,
    },
    {
      id: 'full',
      title: 'Full Interview',
      desc: 'Includes more questions, follow-ups, deeper evaluation, and detailed post-interview analysis.',
      duration: '10 to 15 minutes',
      icon: Target,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {modes.map((m) => {
        const Icon = m.icon;
        const isSelected = selected === m.id;
        return (
          <button
            key={m.id}
            onClick={() => onChange(m.id)}
            className={`text-left p-6 rounded-3xl border-2 transition-all h-full flex flex-col ${
              isSelected
                ? 'bg-blue-50 border-blue-500 ring-4 ring-blue-500/10'
                : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                <Icon size={20} />
              </div>
              {isSelected && <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>}
            </div>
            <h3 className={`text-lg font-bold mb-2 ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>{m.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6 flex-grow">{m.desc}</p>
            <p className={`text-xs font-bold ${isSelected ? 'text-blue-600' : 'text-slate-400'}`}>
              Estimated duration: {m.duration}
            </p>
          </button>
        );
      })}
    </div>
  );
}
