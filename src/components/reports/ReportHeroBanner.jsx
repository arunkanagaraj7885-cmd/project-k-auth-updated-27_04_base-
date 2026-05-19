'use client';
import ScoreRing from '@/components/shared/ScoreRing';
import { RefreshCw, Zap } from 'lucide-react';
import Link from 'next/link';

export default function ReportHeroBanner({ score, summaryTitle, summary, scoreSummary, plan, userName = 'there' }) {
  return (
    <div className="rounded-3xl bg-[#064e3b] p-8 md:p-10 text-white mb-8 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-1">{summaryTitle ?? 'Good work'}, {userName}</h2>
          {scoreSummary && (
            <p className="text-emerald-300 text-xs font-semibold mb-3">{scoreSummary}</p>
          )}
          <p className="text-emerald-100/80 text-sm md:text-base max-w-2xl leading-relaxed mb-8">
            {summary ?? 'Review your performance below to identify strengths and areas for improvement.'}
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link
              href="/main/start-interview"
              className="px-6 py-2.5 bg-white text-[#064e3b] rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-emerald-50 transition-all active:scale-[0.98]"
            >
              <RefreshCw size={16} />
              Retake Interview
            </Link>
            {plan !== 'premium' && (
              <Link
                href="/pricing"
                className="px-6 py-2.5 bg-emerald-800 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-emerald-700 transition-all active:scale-[0.98] border border-emerald-700"
              >
                <Zap size={16} className="text-emerald-400 fill-emerald-400" />
                Upgrade to Premium
              </Link>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="relative mb-3">
            <ScoreRing score={score ?? 0} size={140} strokeWidth={10} color="#34d399" />
          </div>
          <h4 className="text-sm font-bold text-emerald-100 mb-1">Interview Score</h4>
          <p className="text-[11px] text-emerald-100/60 max-w-[180px] leading-relaxed">
            You performed better than your last attempt. Keep practicing to improve answer confidence and clarity.
          </p>
        </div>
      </div>
    </div>
  );
}
