'use client';
import SkillBar from '@/components/shared/SkillBar';

export default function ScoreBreakdown({ categories = [] }) {
  return (
    <div className="card p-5 mb-5">
      <h3 className="font-semibold text-slate-800 mb-4">Score Breakdown</h3>
      {categories.length === 0 ? (
        <p className="text-sm text-slate-400">No category data available.</p>
      ) : (
        <div className="space-y-4">
          {categories.map((cat) => (
            <SkillBar key={cat.label} label={cat.label} value={cat.score} />
          ))}
        </div>
      )}
    </div>
  );
}
