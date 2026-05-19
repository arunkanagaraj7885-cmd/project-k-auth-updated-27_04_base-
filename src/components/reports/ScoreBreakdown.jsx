'use client';

const COLOR_MAP = {
  technical_knowledge:  'bg-blue-500',
  communication:        'bg-emerald-500',
  confidence:           'bg-orange-400',
  answer_structure:     'bg-purple-500',
  problem_solving:      'bg-blue-400',
  behavioral_readiness: 'bg-emerald-400',
};

function toLabel(key) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ScoreBreakdown({ scoreBreakdown = null }) {
  const items = scoreBreakdown
    ? Object.entries(scoreBreakdown).map(([key, value]) => ({
        label: toLabel(key),
        score: value,
        color: COLOR_MAP[key] ?? 'bg-slate-400',
      }))
    : [
        { label: 'Technical Knowledge', score: 84, color: 'bg-blue-500' },
        { label: 'Communication',       score: 73, color: 'bg-emerald-500' },
        { label: 'Confidence',          score: 61, color: 'bg-orange-400' },
        { label: 'Answer Structure',    score: 69, color: 'bg-purple-500' },
        { label: 'Problem Solving',     score: 71, color: 'bg-blue-400' },
        { label: 'Behavioral Readiness', score: 66, color: 'bg-emerald-400' },
      ];

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-800">Score Breakdown</h3>
        <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Category-wise performance analysis</span>
      </div>

      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700">{item.label}</span>
              <span className="text-xs font-bold text-slate-800">{item.score}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full ${item.color || 'bg-[#064e3b]'} rounded-full transition-all duration-1000`} 
                style={{ width: `${item.score}%` }} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
