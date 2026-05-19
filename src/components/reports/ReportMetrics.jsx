'use client';
import { TrendingUp, Award, AlertCircle, ArrowRight } from 'lucide-react';

export default function ReportMetrics({
  readiness = 0,
  readinessChange = null,
  bestArea = '—',
  bestAreaScore = null,
  needsAttention = '—',
  needsAttentionScore = null,
  recommendedNext = null,
}) {
  const readinessSubtext = readinessChange != null
    ? `${readinessChange > 0 ? '↑' : '↓'} ${Math.abs(readinessChange)}% from previous attempt`
    : 'First attempt — keep practising!';

  const metrics = [
    {
      label: 'Interview Readiness',
      value: `${readiness}%`,
      subtext: readinessSubtext,
      subtextColor: readinessChange > 0 ? 'text-emerald-500' : 'text-slate-400',
      icon: TrendingUp,
      iconColor: 'text-emerald-500',
      bgColor: 'bg-emerald-50',
    },
    {
      label: 'Best Area',
      value: bestArea,
      subtext: bestAreaScore != null ? `${bestAreaScore}/100 score` : '—',
      subtextColor: 'text-blue-500',
      icon: Award,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Needs Attention',
      value: needsAttention,
      subtext: needsAttentionScore != null ? `${needsAttentionScore}/100 score` : '—',
      subtextColor: 'text-orange-500',
      icon: AlertCircle,
      iconColor: 'text-orange-500',
      bgColor: 'bg-orange-50',
    },
    {
      label: 'Recommended Next',
      value: recommendedNext ?? 'Practice More',
      subtext: 'Based on your performance',
      subtextColor: 'text-indigo-500',
      icon: ArrowRight,
      iconColor: 'text-indigo-500',
      bgColor: 'bg-indigo-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {metrics.map((m) => (
        <div key={m.label} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{m.label}</span>
            <div className={`w-8 h-8 rounded-lg ${m.bgColor} flex items-center justify-center`}>
              <m.icon size={16} className={m.iconColor} />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-800 mb-1">{m.value}</p>
          <p className={`text-[11px] font-bold ${m.subtextColor}`}>{m.subtext}</p>
        </div>
      ))}
    </div>
  );
}
