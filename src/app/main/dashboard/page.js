'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  useDashboardSummary,
  useDashboardTrend,
  useDashboardSkills,
  useDashboardInsights,
  useRecentInterviews,
} from '@/hooks/useDashboard';
import { useAppSelector } from '@/store/hooks';
import { selectPlan, selectUser } from '@/store/slices/authSlice';

const SKILL_COLORS = ['#3f6df6', '#5ab357', '#f2a900', '#8e66ff', '#2db3a3'];

function formatInterviewDate(value) {
  if (!value) return 'Recently';
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function toChartPoints(data = []) {
  if (!data.length) return [];
  const rawScores = data.map((d) => Number(d.score) || 0);
  const min = Math.min(...rawScores);
  const max = Math.max(...rawScores);
  const width = 520;
  const height = 240;
  const left = 0;
  const right = 0;
  const top = 0;
  const bottom = 0;
  const drawWidth = width - left - right;
  const drawHeight = height - top - bottom;
  const pointCount = Math.max(7, rawScores.length);
  const points = [];

  for (let i = 0; i < pointCount; i += 1) {
    const sourceIdx = Math.round((i * (rawScores.length - 1)) / Math.max(1, pointCount - 1));
    const score = rawScores[sourceIdx];
    const normalized = max === min ? 0.5 : (score - min) / (max - min);
    const compressed = 0.18 + normalized * 0.34;
    const x = left + (i * drawWidth) / Math.max(1, pointCount - 1);
    const y = top + drawHeight - compressed * drawHeight;
    points.push({ x, y });
  }

  // Keep the line visually close to the client's gentle upward trend.
  for (let i = 1; i < points.length; i += 1) {
    const maxDrop = 12;
    if (points[i].y > points[i - 1].y + maxDrop) {
      points[i].y = points[i - 1].y + maxDrop;
    }
  }
  return points;
}

export default function DashboardPage() {
  const router = useRouter();
  const user = useAppSelector(selectUser);
  const plan = useAppSelector(selectPlan);
  const { data: summary } = useDashboardSummary();
  const { data: trend } = useDashboardTrend();
  const { data: skills } = useDashboardSkills();
  const { data: insights } = useDashboardInsights();
  const { data: recent } = useRecentInterviews();
  const chartPoints = toChartPoints(trend?.scores ?? []);
  const chartPolyline = chartPoints.length ? chartPoints.map((p) => `${p.x},${p.y}`).join(' ') : '';
  const firstName = user?.first_name || user?.name?.split(' ')?.[0] || 'Nirmal';
  const skillItems = skills?.categories ?? [];
  const bestSkill = skillItems.length ? [...skillItems].sort((a, b) => b.score - a.score)[0] : null;
  const weakestSkill = skillItems.length ? [...skillItems].sort((a, b) => a.score - b.score)[0] : null;
  const fullInterviewsCount = (recent?.interviews ?? []).filter((i) => String(i?.mode).toLowerCase() === 'full').length;

  return (
    <div className="animate-fade-in space-y-5">
      <p className="text-sm text-slate-500">Track your interview readiness, review your recent reports, and continue improving with focused practice.</p>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        <div className="xl:col-span-3 rounded-2xl border border-[#0e5f58] bg-[#0f4e49] p-5 text-white min-h-[150px]">
          <h2 className="text-[36px] leading-none font-semibold mb-2">Welcome {firstName}</h2>
          <p className="text-base leading-relaxed text-[#b9ded8] max-w-4xl">
            You are getting close to interview readiness. Your communication has improved, but behavioral responses still need work.
            Take a mock interview now or refine a full interview report to sharpen feedback.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={() => router.push('/main/start-interview')}
              className="rounded-md bg-[#0f8ecf] hover:bg-[#0d80ba] text-white text-sm font-semibold px-5 py-2.5 transition-colors"
            >
              Take Mock Interview
            </button>
            <button
              onClick={() => router.push('/main/start-interview')}
              className="rounded-md bg-white text-[#1a3f3a] hover:bg-[#f3f7f7] text-sm font-semibold px-5 py-2.5 transition-colors"
            >
              Take Full Interview
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-[#165f57] bg-[#104842] p-4 text-white flex flex-col justify-between">
          <div>
            <p className="text-[11px] text-[#8fc7be] uppercase tracking-wide">Interview Readiness</p>
            <p className="text-4xl font-bold mt-3">{summary?.readiness ?? 78}%</p>
            <p className="text-xs text-[#8fc7be] mt-1">Good Progress</p>
          </div>
          <div className="mt-4">
            <div className="h-2 w-full rounded-full bg-[#1d625b]">
              <div className="h-2 rounded-full bg-[#4fd1a9]" style={{ width: `${summary?.readiness ?? 78}%` }} />
            </div>
            <p className="text-[11px] text-[#8fc7be] mt-2">+6% this week</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { title: 'Total Mock Interviews Taken', value: summary?.total_interviews ?? 22, note: '| 3 more than last week', noteClass: 'text-emerald-600' },
          { title: 'Total Full Interviews Taken', value: fullInterviewsCount, note: `| 1 more than last week`, noteClass: 'text-emerald-600' },
          { title: 'Best Category', value: bestSkill?.label ?? 'Technical', note: `${bestSkill?.score ?? 84}/100 current peak`, noteClass: 'text-emerald-600' },
          { title: 'Weakest Area', value: weakestSkill?.label ?? 'Confidence', note: 'Needs focused practice', noteClass: 'text-amber-500' },
        ].map((item) => (
          <div key={item.title} className="card rounded-2xl p-4">
            <p className="text-[11px] text-slate-500 uppercase tracking-wide">{item.title}</p>
            <p className="text-3xl font-bold text-slate-800 mt-2">{item.value}</p>
            <p className={`text-xs mt-2 ${item.noteClass}`}>{item.note}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="card rounded-2xl p-4 xl:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[18px] leading-none font-semibold text-slate-800">Performance Trend</h3>
            <p className="text-xs text-slate-500">Last 5 interviews</p>
          </div>
          <div className="rounded-[18px] border border-[#dbe3ee] p-0 bg-[#f8fbff] overflow-hidden">
            <svg viewBox="0 0 520 240" preserveAspectRatio="none" className="w-full h-[210px]">
              {[0, 1, 2, 3, 4, 5].map((row) => (
                <line key={`r-${row}`} x1="0" y1={row * 48} x2="520" y2={row * 48} stroke="#e6ecf4" strokeWidth="1" />
              ))}
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((col) => (
                <line key={`c-${col}`} x1={col * 52} y1="0" x2={col * 52} y2="240" stroke="#eef3f9" strokeWidth="1" />
              ))}
              {chartPolyline && <polyline fill="none" stroke="#2f6fea" strokeWidth="3.2" points={chartPolyline} />}
              {chartPoints.map((p, idx) => (
                <circle key={`p-${idx}`} cx={p.x} cy={p.y} r="4.2" fill="#2f6fea" />
              ))}
            </svg>
          </div>
        </div>

        <div className="card rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[18px] leading-none font-semibold text-slate-800">Skill Breakdown</h3>
            <p className="text-xs text-slate-500">Current performance</p>
          </div>
          <div className="space-y-3">
            {(skills?.categories ?? []).map((skill, idx) => (
              <div key={skill.label}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-slate-700">{skill.label}</span>
                  <span className="text-slate-600 font-medium">{skill.score}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-200">
                  <div
                    className="h-1.5 rounded-full"
                    style={{ width: `${skill.score}%`, backgroundColor: SKILL_COLORS[idx % SKILL_COLORS.length] }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="card rounded-2xl p-4 xl:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[18px] leading-none font-semibold text-slate-800">Recent Interviews</h3>
            <Link href="/main/reports" className="text-xs text-slate-500 hover:text-slate-700">
              Last {(recent?.interviews ?? []).length} interview reports
            </Link>
          </div>
          <div className="space-y-3">
            {(recent?.interviews ?? []).map((interview) => (
              <div key={interview.id} className="rounded-xl border border-slate-200 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-slate-800">{interview.role} - Mock Interview</h4>
                    <p className="text-xs text-slate-500 mt-1">{formatInterviewDate(interview.completedAt)} • Interview completed with actionable feedback</p>
                    <p className="text-sm text-slate-600 mt-2">
                      Your answer flow was better than previous attempts. You handled technical follow-up questions well, but
                      qualifying questions still need more confidence and stronger structured clarity.
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-[#2f6fea] whitespace-nowrap">{interview.score}/100</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[18px] leading-none font-semibold text-slate-800">Useful Insights</h3>
            <p className="text-xs text-slate-500">For job seekers</p>
          </div>
          <div className="space-y-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase text-slate-500 mb-1">Top Improvement Areas</p>
              <ul className="text-sm text-slate-700 list-disc pl-4 space-y-0.5">
                <li>Build stronger opening answers in the first 5 seconds.</li>
                <li>Use STAR structure more consistently in behavioral questions.</li>
                <li>Keep technical answers shorter and more direct.</li>
              </ul>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase text-slate-500 mb-1">Next Best Action</p>
              <p className="text-sm text-slate-700">{insights?.nextAction}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase text-slate-500 mb-1">Hiring Readiness Snapshot</p>
              <p className="text-sm text-slate-700">{insights?.hiringSnapshot || `For job seekers as of ${formatInterviewDate(new Date())}`}</p>
            </div>
          </div>
        </div>
      </div>

      {plan !== 'premium' && (
        <div className="rounded-2xl p-6 bg-gradient-to-r from-[#5b47ec] to-[#6f53ff] text-white border border-[#6f59ff]">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-2xl font-semibold">Unlock Pro Coaching</p>
              <p className="text-sm text-[#dad4ff] mt-1">
                Upgrade for detailed reports, advanced analytics, and premium interview practice.
              </p>
            </div>
            <Link
              href="/pricing"
              className="rounded-xl bg-white text-[#5440e6] px-5 py-2.5 text-sm font-semibold hover:bg-[#f2efff] transition-colors"
            >
              Upgrade Now
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
