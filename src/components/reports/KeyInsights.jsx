'use client';

const FALLBACK_INSIGHTS = [
  { type: 'positive', title: 'Strong technical relevance', description: 'Your examples matched the role well, especially when discussing frontend dashboards and optimization.' },
  { type: 'positive', title: 'Good practical exposure',   description: 'You answered best when referring to real project situations instead of generic descriptions.' },
  { type: 'negative', title: 'Improve opening confidence', description: 'A stronger and more direct introduction would improve first impression.' },
];

export default function KeyInsights({ insights = [] }) {
  const items = insights.length > 0 ? insights : FALLBACK_INSIGHTS;

  const isPositive = (type) => type === 'positive';

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
              isPositive(item.type) ? 'bg-green-50 border-green-100' : 'bg-orange-50 border-orange-100'
            }`}
          >
            <p className={`text-sm font-bold mb-1 ${isPositive(item.type) ? 'text-green-800' : 'text-orange-800'}`}>
              {item.title}
            </p>
            {item.description && (
              <p className={`text-xs leading-relaxed ${isPositive(item.type) ? 'text-green-700' : 'text-orange-700'}`}>
                {item.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
