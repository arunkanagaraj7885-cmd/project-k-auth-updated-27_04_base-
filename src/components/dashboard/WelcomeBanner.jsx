'use client';
import { useRouter } from 'next/navigation';
import ScoreRing from '@/components/shared/ScoreRing';
import { Play, TrendingUp } from 'lucide-react';

export default function WelcomeBanner({ user, readiness = 0, welcomeText }) {
  const router = useRouter();
  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 p-6 md:p-8 text-white mb-6">
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        {/* Text section */}
        <div className="flex-1">
          <p className="text-blue-300 text-sm font-medium mb-1">Good day 👋</p>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Welcome back, {firstName}!
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed max-w-md">
            {welcomeText || 'Your interview readiness has improved. Keep practising to get closer to your goal!'}
          </p>

          <div className="flex flex-wrap gap-3 mt-5">
            <button
              onClick={() => router.push('/main/start-interview')}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-semibold transition-colors"
            >
              <Play size={15} />
              Start Interview
            </button>
            <button
              onClick={() => router.push('/main/reports')}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-medium transition-colors"
            >
              <TrendingUp size={15} />
              View Reports
            </button>
          </div>
        </div>

        {/* Readiness ring */}
        <div className="flex flex-col items-center gap-2">
          <ScoreRing score={readiness} size={110} strokeWidth={8} />
          <p className="text-slate-300 text-xs font-medium">Interview Readiness</p>
        </div>
      </div>
    </div>
  );
}
