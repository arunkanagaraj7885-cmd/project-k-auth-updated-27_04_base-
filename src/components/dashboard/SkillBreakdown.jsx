'use client';
import SkillBar from '@/components/shared/SkillBar';

export default function SkillBreakdown({ skills = [] }) {
  return (
    <div className="card p-5">
      <h3 className="font-semibold text-slate-800 mb-4">Skill Breakdown</h3>
      {skills.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-6">No skill data yet.</p>
      ) : (
        <div className="space-y-4">
          {skills.map((skill) => (
            <SkillBar key={skill.label} label={skill.label} value={skill.score} />
          ))}
        </div>
      )}
    </div>
  );
}
