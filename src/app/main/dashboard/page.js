'use client';
import dynamic from 'next/dynamic';
import { BarChart2, Play, FileText, Target } from 'lucide-react';
import WelcomeBanner from '@/components/dashboard/WelcomeBanner';
import StatsRow from '@/components/dashboard/StatsRow';
import SkillBreakdown from '@/components/dashboard/SkillBreakdown';
import RecentInterviews from '@/components/dashboard/RecentInterviews';
import UsefulInsights from '@/components/dashboard/UsefulInsights';
import UpgradeBanner from '@/components/shared/UpgradeBanner';
import {
  useDashboardSummary,
  useDashboardTrend,
  useDashboardSkills,
  useDashboardInsights,
  useRecentInterviews,
} from '@/hooks/useDashboard';
import { useAppSelector } from '@/store/hooks';
import { selectUser, selectPlan } from '@/store/slices/authSlice';

// Dynamic import for recharts (large bundle)
const PerformanceTrend = dynamic(
  () => import('@/components/dashboard/PerformanceTrend'),
  { ssr: false, loading: () => <div className="card p-5 h-52 skeleton" /> }
);

export default function DashboardPage() {
  const user = useAppSelector(selectUser);
  const plan = useAppSelector(selectPlan);

  const { data: summary, isLoading: summaryLoading } = useDashboardSummary();
  const { data: trend } = useDashboardTrend();
  const { data: skills } = useDashboardSkills();
  const { data: insights } = useDashboardInsights();
  const { data: recent } = useRecentInterviews();

  const stats = [
    {
      label: 'Interviews Done',
      value: summary?.total_interviews ?? '—',
      icon: Play,
      color: '#2563eb',
      subtitle: 'All time',
    },
    {
      label: 'Avg Score',
      value: summary?.avg_score ? `${summary.avg_score}/100` : '—',
      icon: BarChart2,
      color: '#22c55e',
      subtitle: 'Last 5 sessions',
    },
    {
      label: 'Reports',
      value: summary?.total_reports ?? '—',
      icon: FileText,
      color: '#f59e0b',
      subtitle: 'Generated',
    },
    {
      label: 'Readiness',
      value: summary?.readiness ? `${summary.readiness}%` : '—',
      icon: Target,
      color: '#8b5cf6',
      subtitle: 'Interview ready',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <WelcomeBanner
        user={user}
        readiness={summary?.readiness ?? 0}
        welcomeText={summary?.welcome_text}
      />

      {/* Stats */}
      <StatsRow stats={stats} />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <PerformanceTrend data={trend?.scores ?? []} />
        </div>
        <SkillBreakdown skills={skills?.categories ?? []} />
      </div>

      {/* Recent interviews */}
      <RecentInterviews interviews={recent?.interviews ?? []} />

      {/* Insights */}
      <UsefulInsights insights={insights ?? {}} />

      {/* Upgrade banner for non-premium */}
      {plan !== 'premium' && (
        <UpgradeBanner
          feature="detailed feedback, job assistance & unlimited interviews"
          targetPlan="premium"
        />
      )}
    </div>
  );
}
