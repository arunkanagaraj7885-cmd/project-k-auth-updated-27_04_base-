'use client';
import { useParams } from 'next/navigation';
import ScoreRing from '@/components/shared/ScoreRing';
import SkillBar from '@/components/shared/SkillBar';
import Logo from '@/components/shared/Logo';
import { useScoreCard } from '@/hooks/useReport';
import { formatDate } from '@/lib/utils';
import { CheckCircle2, ExternalLink } from 'lucide-react';

export default function ScoreCardPage() {
  const { id } = useParams();
  const { data: card, isLoading } = useScoreCard(id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="spinner spinner-brand" style={{ width: 40, height: 40, borderWidth: 3 }} />
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-center">
        <div>
          <p className="text-slate-500 mb-3">Score card not found or has been removed.</p>
          <a href="/auth/login" className="text-blue-600 hover:underline text-sm">Try Project K →</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl text-center">
          <div className="flex justify-center mb-6">
            <Logo size="sm" />
          </div>

          <p className="text-sm text-slate-500 mb-1">Interview Score Card</p>
          <h2 className="text-xl font-bold text-slate-800 mb-1">{card.candidate_name}</h2>
          <p className="text-sm text-blue-600 font-medium mb-6">{card.role}</p>

          {/* Score ring */}
          <div className="flex justify-center mb-6">
            <ScoreRing score={card.score ?? 0} size={120} strokeWidth={9} />
          </div>

          {/* Skills */}
          {card.categories?.length > 0 && (
            <div className="text-left space-y-3 mb-6">
              {card.categories.map((cat) => (
                <SkillBar key={cat.label} label={cat.label} value={cat.score} />
              ))}
            </div>
          )}

          {/* Meta */}
          <div className="bg-slate-50 rounded-2xl p-4 mb-6 text-sm text-slate-500">
            <div className="flex items-center justify-between">
              <span>Mode</span>
              <span className="font-medium text-slate-700 capitalize">{card.mode || 'Full'}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span>Date</span>
              <span className="font-medium text-slate-700">{formatDate(card.completed_at)}</span>
            </div>
          </div>

          {/* Verified badge */}
          <div className="flex items-center justify-center gap-2 text-xs text-green-600 font-medium mb-5">
            <CheckCircle2 size={14} />
            Verified by Project K AI
          </div>

          <a
            href="/"
            className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            <ExternalLink size={14} />
            Practice on Project K
          </a>
        </div>

        <p className="text-center text-slate-500 text-xs mt-4">
          projectk.io · AI Interview Coaching
        </p>
      </div>
    </div>
  );
}
