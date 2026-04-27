'use client';
import { Briefcase, Zap, BarChart2, Globe, FileText } from 'lucide-react';

const LABELS = {
  mode: { mock: 'Mock Interview', full: 'Full Interview' },
  difficulty: { beginner: 'Beginner 🌱', intermediate: 'Intermediate ⚡', advanced: 'Advanced 🔥', expert: 'Expert 🚀' },
};

export default function InterviewSummary({ config }) {
  const { role, mode, difficulty, language, hasJD } = config;

  const rows = [
    { icon: Briefcase, label: 'Role', value: role || '—' },
    { icon: Zap, label: 'Mode', value: LABELS.mode[mode] || mode || '—' },
    { icon: BarChart2, label: 'Difficulty', value: LABELS.difficulty[difficulty] || difficulty || '—' },
    { icon: Globe, label: 'Language', value: language || 'English' },
    { icon: FileText, label: 'Job Description', value: hasJD ? 'Provided ✓' : 'Not provided' },
  ];

  return (
    <div className="card p-5 sticky top-24">
      <h3 className="font-semibold text-slate-800 mb-4 text-sm">Interview Summary</h3>
      <div className="space-y-3">
        {rows.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon size={13} className="text-slate-500" />
            </div>
            <div>
              <p className="text-xs text-slate-400">{label}</p>
              <p className="text-sm font-medium text-slate-700 truncate max-w-[150px]">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="rounded-xl bg-blue-50 border border-blue-100 p-3 text-xs text-blue-700 leading-relaxed">
          AI avatar will ask questions based on your role and difficulty. Speak clearly for best results.
        </div>
      </div>
    </div>
  );
}
