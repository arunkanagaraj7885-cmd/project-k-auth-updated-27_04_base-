'use client';
import { ArrowRight } from 'lucide-react';

export default function ActionPlan({ actions = [] }) {
  const defaultActions = [
    'Practice answering STAR-method questions for behavioural rounds.',
    'Work on concise communication — aim for 60–90 second answers.',
    'Research the company and role before your next interview session.',
  ];

  const items = actions.length ? actions : defaultActions;

  return (
    <div className="card p-5 mb-5">
      <h3 className="font-semibold text-slate-800 mb-4">3-Step Action Plan</h3>
      <div className="space-y-3">
        {items.slice(0, 3).map((action, i) => (
          <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
              {i + 1}
            </div>
            <p className="text-sm text-slate-700 leading-relaxed flex-1">{action}</p>
            <ArrowRight size={14} className="text-blue-400 flex-shrink-0 mt-0.5" />
          </div>
        ))}
      </div>
    </div>
  );
}
