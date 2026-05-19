'use client';

const DEFAULT_ACTIONS = [
  { step: 'Strengthen your opening',    description: 'Prepare a 30-second self-introduction with your strongest experience highlight.' },
  { step: 'Use a structure for examples', description: 'Practice context, action, and result for technical and behavioral questions.' },
  { step: 'Add measurable outcomes',    description: 'Whenever possible, mention impact such as performance, usability, or efficiency improvement.' },
];

export default function ActionPlan({ actions = [] }) {
  const items = actions.length > 0 ? actions : DEFAULT_ACTIONS;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-slate-800">Action Plan</h3>
        <span className="text-[11px] text-slate-400 font-medium">Simple steps before your next interview</span>
      </div>
      <div className="space-y-3">
        {items.slice(0, 3).map((action, i) => (
          <div key={i} className="flex gap-3 p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              {i + 1}
            </span>
            <div>
              <p className="text-sm font-bold text-slate-800 mb-1">{action.step}</p>
              {action.description && <p className="text-xs text-slate-500 leading-relaxed">{action.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
