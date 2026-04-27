'use client';
import { useParams } from 'next/navigation';
import ReportHeroBanner from '@/components/reports/ReportHeroBanner';
import ScoreBreakdown from '@/components/reports/ScoreBreakdown';
import QuestionFeedbackTable from '@/components/reports/QuestionFeedbackTable';
import KeyInsights from '@/components/reports/KeyInsights';
import ActionPlan from '@/components/reports/ActionPlan';
import ShareableResults from '@/components/reports/ShareableResults';
import BlurredSection from '@/components/shared/BlurredSection';
import { useAppSelector } from '@/store/hooks';
import { selectPlan } from '@/store/slices/authSlice';
import { useReport } from '@/hooks/useReport';
import { Lock } from 'lucide-react';
import Link from 'next/link';

function UnlockPremiumCard({ features = [] }) {
  return (
    <div className="card p-6 mb-5 text-center border-dashed border-2 border-blue-200 bg-blue-50">
      <Lock size={24} className="text-blue-500 mx-auto mb-3" />
      <h4 className="font-semibold text-slate-800 mb-2">Unlock Full Feedback</h4>
      <p className="text-sm text-slate-600 mb-4">
        Upgrade to Premium to access: {features.join(', ')}.
      </p>
      <Link
        href="/pricing"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
      >
        Upgrade to Premium
      </Link>
    </div>
  );
}

export default function ReportDetailPage() {
  const { reportId } = useParams();
  const plan = useAppSelector(selectPlan);
  const { data: report, isLoading, error } = useReport(reportId);

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-52 skeleton rounded-2xl" />
        <div className="h-40 skeleton rounded-2xl" />
        <div className="h-60 skeleton rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-slate-500 mb-4">Failed to load report. It may still be processing.</p>
        <Link href="/main/reports" className="text-blue-600 hover:underline text-sm font-medium">
          ← Back to Reports
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <Link href="/main/reports" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-5 font-medium">
        ← Back to Reports
      </Link>

      <ReportHeroBanner
        score={report?.score}
        summary={report?.summary}
        plan={plan}
        completedAt={report?.completed_at}
        duration={report?.duration}
      />

      <ScoreBreakdown categories={report?.categories ?? []} />

      {/* Q-by-Q feedback: blurred for non-premium */}
      <BlurredSection unlockPlan="premium">
        <QuestionFeedbackTable questions={report?.questions ?? []} />
      </BlurredSection>

      {/* Premium-only sections */}
      {plan === 'premium' ? (
        <>
          <KeyInsights insights={report?.insights ?? {}} />
          <ActionPlan actions={report?.action_plan ?? []} />
          <ShareableResults reportId={reportId} score={report?.score} />
        </>
      ) : (
        <UnlockPremiumCard features={['Full Q&A feedback', 'Key Insights', 'Action Plan', 'LinkedIn sharing']} />
      )}
    </div>
  );
}
