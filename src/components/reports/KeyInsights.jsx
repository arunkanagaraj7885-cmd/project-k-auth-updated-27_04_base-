'use client';

const FALLBACK_INSIGHTS = [
  { type: 'strength', title: 'Strong technical relevance', desc: 'Your examples matched the role well, especially when discussing frontend dashboards and optimization.' },
  { type: 'strength', title: 'Good practical exposure', desc: 'You answered best when referring to real project situations instead of generic descriptions.' },
  { type: 'improve',  title: 'Improve opening confidence', desc: 'A stronger and more direct introduction would improve first impression.' },
];

export default function KeyInsights({ insights = {} }) {
  const { strengths = [], improvements = [] } = insights;

  const items = (strengths.length || improvements.length)
    ? [
        ...strengths.map((s) => ({ type: 'strength', title: s.title || s, desc: s.desc || '' })),
        ...improvements.map((s) => ({ type: 'improve', title: s.title || s, desc: s.desc || '' })),
      ]
    : FALLBACK_INSIGHTS;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-slate-800">Key Insights</h3>
        <span className="text-[11px] text-slate-400 font-medium">What went well and what to improve</span>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div
            key={i}
            className={`rounded-2xl p-4 border ${
              item.type === 'strength'
                ? 'bg-green-50 border-green-100'
                : 'bg-orange-50 border-orange-100'
            }`}
          >
            <p className={`text-sm font-bold mb-1 ${item.type === 'strength' ? 'text-green-800' : 'text-orange-800'}`}>
              {item.title}
            </p>
            {item.desc && (
              <p className={`text-xs leading-relaxed ${item.type === 'strength' ? 'text-green-700' : 'text-orange-700'}`}>
                {item.desc}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
