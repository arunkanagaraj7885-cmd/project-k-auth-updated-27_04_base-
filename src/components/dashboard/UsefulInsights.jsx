'use client';
import { TrendingUp, Target, Briefcase } from 'lucide-react';

const SECTIONS = [
  { key: 'improvements', icon: TrendingUp, label: 'Top Improvements', color: '#22c55e' },
  { key: 'nextAction', icon: Target, label: 'Next Best Action', color: '#3b82f6' },
  { key: 'hiringSnapshot', icon: Briefcase, label: 'Hiring Snapshot', color: '#f59e0b' },
];

export default function UsefulInsights({ insights = {} }) {
  return (
    <div className="card p-5">
      <h3 className="font-semibold text-slate-800 mb-4">Useful Insights</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SECTIONS.map(({ key, icon: Icon, label, color }) => (
          <div key={key} className="rounded-xl bg-slate-50 border border-slate-100 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${color}20` }}
              >
                <Icon size={14} style={{ color }} />
              </div>
              <span className="text-xs font-semibold text-slate-700">{label}</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {insights[key] || 'Complete more interviews to unlock insights.'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
