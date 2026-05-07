'use client';
import { TrendingUp, Award, AlertCircle, ArrowRight } from 'lucide-react';

export default function ReportMetrics({ readiness = 78, bestArea = 'Technical', needsAttention = 'Confidence', recommendedNext = 'HR Round' }) {
  const metrics = [
    {
      label: 'Interview Readiness',
      value: `${readiness}%`,
      subtext: '↑ 6% from previous attempt',
      subtextColor: 'text-emerald-500',
      icon: TrendingUp,
      iconColor: 'text-emerald-500',
      bgColor: 'bg-emerald-50',
    },
    {
      label: 'Best Area',
      value: bestArea,
      subtext: '84/100 score',
      subtextColor: 'text-blue-500',
      icon: Award,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Needs Attention',
      value: needsAttention,
      subtext: '61/100 score',
      subtextColor: 'text-orange-500',
      icon: AlertCircle,
      iconColor: 'text-orange-500',
      bgColor: 'bg-orange-50',
    },
    {
      label: 'Recommended Next',
      value: recommendedNext,
      subtext: 'Build clarity and self-presentation',
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
