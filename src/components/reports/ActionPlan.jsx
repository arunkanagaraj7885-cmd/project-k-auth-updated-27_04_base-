'use client';

const DEFAULT_ACTIONS = [
  { title: 'Strengthen your opening', desc: 'Prepare a 30-second self-introduction with your strongest experience highlight.' },
  { title: 'Use a structure for examples', desc: 'Practice context, action, and result for technical and behavioral questions.' },
  { title: 'Add measurable outcomes', desc: 'Whenever possible, mention impact such as performance, usability, or efficiency improvement.' },
];

export default function ActionPlan({ actions = [] }) {
  const items = actions.length
    ? actions.map((a) => (typeof a === 'string' ? { title: a, desc: '' } : a))
    : DEFAULT_ACTIONS;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-slate-800">Action Plan</h3>
        <span className="text-[11px] text-slate-400 font-medium">Simple steps before your next interview</span>
      </div>
      <div className="space-y-3">
        {items.slice(0, 3).map((action, i) => (
          <div key={i} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
            <p className="text-sm font-bold text-slate-800 mb-1">{action.title}</p>
            {action.desc && <p className="text-xs text-slate-500 leading-relaxed">{action.desc}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
