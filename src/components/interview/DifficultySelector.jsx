'use client';

const LEVELS = [
  { 
    id: 'beginner', 
    label: 'Beginner', 
    desc: 'Basic and foundational questions designed for early-stage learners and freshers.',
    tag: 'Easy to moderate'
  },
  { 
    id: 'intermediate', 
    label: 'Intermediate', 
    desc: 'Balanced questions with role-based depth, ideal for candidates preparing seriously.',
    tag: 'Recommended for most users'
  },
  { 
    id: 'advanced', 
    label: 'Advanced', 
    desc: 'Challenging follow-ups, scenario-based questions, and higher interviewer expectations.',
    tag: 'High difficulty'
  },
  { 
    id: 'adaptive', 
    label: 'Adaptive', 
    desc: 'The AI adjusts question complexity based on your answers during the interview.',
    tag: 'Dynamic difficulty'
  },
];

export default function DifficultySelector({ selected, onChange }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {LEVELS.map((level) => {
        const isSelected = selected === level.id;
        return (
          <button
            key={level.id}
            type="button"
            onClick={() => onChange(level.id)}
            className={`text-left p-6 rounded-3xl border-2 transition-all h-full flex flex-col ${
              isSelected
                ? 'bg-blue-50 border-blue-500 ring-4 ring-blue-500/10'
                : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-base font-bold ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                {level.label}
              </h3>
              {isSelected && <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>}
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed mb-4 flex-grow">
              {level.desc}
            </p>
            <p className={`text-[10px] font-bold ${isSelected ? 'text-blue-600' : 'text-slate-400'}`}>
              {level.tag}
            </p>
          </button>
        );
      })}
    </div>
  );
}
