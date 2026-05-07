'use client';
import { useParams, useRouter } from 'next/navigation';
import ReportHeroBanner from '@/components/reports/ReportHeroBanner';
import ScoreBreakdown from '@/components/reports/ScoreBreakdown';
import QuestionFeedbackTable from '@/components/reports/QuestionFeedbackTable';
import ReportMetrics from '@/components/reports/ReportMetrics';
import NextPractice from '@/components/reports/NextPractice';
import KeyInsights from '@/components/reports/KeyInsights';
import ActionPlan from '@/components/reports/ActionPlan';
import ShareableResults from '@/components/reports/ShareableResults';
import BlurredSection from '@/components/shared/BlurredSection';
import { useAppSelector } from '@/store/hooks';
import { selectPlan, selectUser } from '@/store/slices/authSlice';
import { useReport } from '@/hooks/useReport';
import { Lock, X } from 'lucide-react';
import Link from 'next/link';

function UnlockPremiumOverlay({ features = [] }) {
  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-50 animate-bounce-subtle">
      <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-2xl flex flex-col md:flex-row items-center gap-6 border border-white/20">
        <div className="flex-1">
          <h4 className="text-xl font-bold mb-2">Unlock Premium</h4>
          <p className="text-sm text-indigo-100 mb-4">
            Get deeper interview guidance and a complete performance report after every session.
          </p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] font-bold text-indigo-200 uppercase tracking-wider mb-6 md:mb-0">
            <li>• Full report</li>
            <li>• Key Insights</li>
            <li>• Action Plan</li>
            <li>• Download Score Card</li>
          </ul>
        </div>
        <Link
          href="/pricing"
          className="px-8 py-3 bg-white text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-all active:scale-[0.98] flex-shrink-0"
        >
          Upgrade to Premium
        </Link>
      </div>
    </div>
  );
}

export default function ReportDetailPage() {
  const { reportId } = useParams();
  const router = useRouter();
  const plan = useAppSelector(selectPlan);
  const user = useAppSelector(selectUser);
  const { data: report, isLoading, error } = useReport(reportId);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse p-8">
        <div className="h-64 bg-slate-100 rounded-3xl" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-100 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 h-96 bg-slate-100 rounded-3xl" />
          <div className="h-96 bg-slate-100 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-slate-500 mb-4">Failed to load report. It may still be processing.</p>
        <button onClick={() => router.back()} className="text-blue-600 hover:underline text-sm font-medium">
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-32 relative">
      {/* Close Button Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-slate-800">My Reports</h1>
        <button 
          onClick={() => router.push('/main/reports')}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all"
        >
          <X size={16} />
          Close Report
        </button>
      </div>

      {/* Hero Section */}
      <ReportHeroBanner
        score={report?.score}
        summary={report?.summary}
        plan={plan}
        userName={user?.name?.split(' ')[0]}
      />

      {/* Metrics Row */}
      <ReportMetrics 
        readiness={report?.readiness}
        bestArea={report?.best_area}
        needsAttention={report?.needs_attention}
        recommendedNext={report?.recommended_next}
      />

      {/* Grid: Breakdown & Next Practice */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <ScoreBreakdown categories={report?.categories ?? []} />
        </div>
        <div className="lg:col-span-1">
          <NextPractice />
        </div>
      </div>

      {/* Question Feedback: Table View */}
      <div className="mb-8">
        <QuestionFeedbackTable 
          questions={report?.questions ?? []} 
          plan={plan}
        />
      </div>

      {/* Premium-only sections (Full Feedback) */}
      {plan === 'premium' && (
        <div className="space-y-8">
          <KeyInsights insights={report?.insights ?? {}} />
          <ActionPlan actions={report?.action_plan ?? []} />
          <ShareableResults reportId={reportId} score={report?.score} />
        </div>
      )}
    </div>
  );
}
