'use client';
import ScoreRing from '@/components/shared/ScoreRing';
import PlanBadge from '@/components/shared/PlanBadge';
import { formatDate } from '@/lib/utils';
import { Calendar, Clock } from 'lucide-react';

export default function ReportHeroBanner({ score, summary, plan, completedAt, duration }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 md:p-8 text-white mb-6">
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <PlanBadge plan={plan} />
            <span className="text-slate-400 text-xs">Report</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">{summary?.role || 'Interview Report'}</h2>
          <p className="text-slate-300 text-sm max-w-md leading-relaxed mb-4">
            {summary?.overview || 'Your interview has been scored by our AI system. See your detailed feedback below.'}
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-slate-400">
            {completedAt && (
              <span className="flex items-center gap-1.5">
                <Calendar size={13} />
                {formatDate(completedAt)}
              </span>
            )}
            {duration && (
              <span className="flex items-center gap-1.5">
                <Clock size={13} />
                {Math.round(duration / 60)} min
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <ScoreRing score={score ?? 0} size={110} strokeWidth={8} />
          <p className="text-slate-400 text-xs">Overall Score</p>
        </div>
      </div>
    </div>
  );
}
