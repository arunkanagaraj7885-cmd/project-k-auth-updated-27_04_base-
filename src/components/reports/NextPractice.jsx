'use client';
import { ArrowRight } from 'lucide-react';

const FALLBACK = [
  { title: 'HR Round Practice',              description: 'Improve self-introduction, confidence, and concise storytelling.' },
  { title: 'Behavioral Round',               description: 'Practice structured answers using real workplace situations.' },
  { title: 'Frontend Developer - Full Interview', description: 'Take a longer round to improve follow-up handling and answer depth.' },
];

export default function NextPractice({ practices = [] }) {
  const items = practices.length > 0 ? practices : FALLBACK;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-800">Recommended Next Practice</h3>
        <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Suggested by your performance</span>
      </div>
      
      <div className="space-y-4">
        {items.map((p, i) => (
          <div 
            key={i} 
            className="group p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between"
          >
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">{p.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{p.description}</p>
            </div>
            <ArrowRight size={16} className="text-slate-300 group-hover:text-slate-600 transition-colors" />
          </div>
        ))}
      </div>
    </div>
  );
}
