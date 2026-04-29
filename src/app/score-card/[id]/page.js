'use client';
import { useParams } from 'next/navigation';
import { useScoreCard } from '@/hooks/useReport';
import { formatDate } from '@/lib/utils';

/* ── Inline amber score ring (matches Figma orange ring) ── */
function ScoreRing({ score }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(score, 100) / 100) * circ;
  return (
    <svg width="110" height="110" viewBox="0 0 110 110" className="flex-shrink-0">
      <circle cx="55" cy="55" r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="9" />
      <circle
        cx="55" cy="55" r={r} fill="none"
        stroke="#f59e0b" strokeWidth="9"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 55 55)"
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
      <text x="55" y="51" textAnchor="middle" fill="white" fontSize="22" fontWeight="700" fontFamily="sans-serif">
        {score}
      </text>
      <text x="55" y="66" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="7" fontFamily="sans-serif" letterSpacing="1">
        OVERALL SCORE
      </text>
    </svg>
  );
}

/* ── Horizontal bar for core scores ── */
function ScoreBar({ label, value }) {
  const pct = Math.min((value / 10) * 100, 100);
  return (
    <div className="flex items-center gap-3">
      <span className="w-40 text-sm text-slate-600 flex-shrink-0">{label}</span>
      <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
        <div className="h-full rounded-full bg-teal-800 transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-8 text-right text-sm font-bold text-slate-700">{value}</span>
    </div>
  );
}

/* ── Simple QR-style placeholder grid ── */
function QRCode() {
  const cells = [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1];
  return (
    <div className="w-12 h-12 bg-teal-900 rounded-md p-1 grid grid-cols-5 gap-px flex-shrink-0">
      {cells.map((on, i) => (
        <div key={i} className={`rounded-sm ${on ? 'bg-white' : 'bg-teal-700'}`} />
      ))}
    </div>
  );
}

export default function ScoreCardPage() {
  const { id } = useParams();
  const { data: card, isLoading } = useScoreCard(id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="spinner spinner-brand" style={{ width: 40, height: 40, borderWidth: 3 }} />
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 text-center">
        <div>
          <p className="text-slate-500 mb-3">Score card not found or has been removed.</p>
          <a href="/auth/login" className="text-blue-600 hover:underline text-sm">Try Project K →</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-200 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* ── Header ── */}
        <div className="bg-teal-900 px-7 py-5 flex items-center gap-6">

          {/* Brand + title */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 rounded-lg bg-teal-700 flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">Project K Interview Score Card</p>
              <p className="text-teal-400 text-xs mt-0.5">Quick recruiter-friendly summary</p>
            </div>
          </div>

          {/* Score ring */}
          <ScoreRing score={card.score} />

          {/* Readiness label */}
          <div className="flex-1 min-w-0">
            <h2 className="text-white text-lg font-bold leading-snug">{card.readiness_label}</h2>
            <p className="text-teal-200 text-xs mt-1 leading-relaxed">{card.readiness_desc}</p>
          </div>

          {/* Candidate info */}
          <div className="text-right flex-shrink-0">
            <p className="text-white font-bold text-base">{card.candidate_name}</p>
            <p className="text-teal-300 text-xs mt-1">Role: {card.role}</p>
            <p className="text-teal-300 text-xs">Date: {formatDate(card.completed_at)}</p>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="grid grid-cols-5 divide-x divide-slate-200">

          {/* Left column */}
          <div className="col-span-3 p-6 space-y-5">

            {/* Snapshot */}
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-800 text-sm">Snapshot</h3>
                <span className="text-xs text-slate-400">What matters most</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-xl p-3 border border-slate-100">
                  <p className="text-xs text-slate-400 uppercase tracking-wide mb-1.5">Communication</p>
                  <p className="text-xl font-bold text-slate-800">{card.snapshot.communication}<span className="text-sm font-normal text-slate-500">/10</span></p>
                  <p className="text-xs text-slate-500 mt-1">{card.snapshot.communication_label}</p>
                </div>
                <div className="bg-white rounded-xl p-3 border border-slate-100">
                  <p className="text-xs text-slate-400 uppercase tracking-wide mb-1.5">Confidence</p>
                  <p className="text-xl font-bold text-slate-800">{card.snapshot.confidence}<span className="text-sm font-normal text-slate-500">/10</span></p>
                  <p className="text-xs text-slate-500 mt-1">{card.snapshot.confidence_label}</p>
                </div>
                <div className="bg-white rounded-xl p-3 border border-slate-100">
                  <p className="text-xs text-slate-400 uppercase tracking-wide mb-1.5">Recommendation</p>
                  <p className="text-xl font-bold text-teal-700">{card.snapshot.recommendation}</p>
                  <p className="text-xs text-slate-500 mt-1">{card.snapshot.recommendation_label}</p>
                </div>
              </div>
            </div>

            {/* Core Scores */}
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 text-sm">Core Scores</h3>
                <span className="text-xs text-slate-400">Simple score view</span>
              </div>
              <div className="space-y-3.5">
                {card.core_scores.map((s) => (
                  <ScoreBar key={s.label} label={s.label} value={s.value} />
                ))}
              </div>
            </div>

            {/* Download */}
            <button
              onClick={() => window.print()}
              className="px-7 py-3 bg-teal-900 hover:bg-teal-800 text-white rounded-xl font-semibold text-sm transition-colors"
            >
              Download
            </button>
          </div>

          {/* Right column */}
          <div className="col-span-2 p-6 space-y-4">

            {/* Candidate Profile */}
            <div className="bg-slate-50 rounded-xl p-4">
              <h3 className="font-bold text-slate-800 text-sm mb-3">Candidate Profile</h3>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-slate-600 font-bold text-sm">{card.initials}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  This score card highlights only the recruiter-relevant points, so the profile can be reviewed in less than a minute.
                </p>
              </div>
            </div>

            {/* Key Summary */}
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-800 text-sm">Key Summary</h3>
                <span className="text-xs text-slate-400">Easy to scan</span>
              </div>
              <div className="space-y-2">
                {card.key_summary.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 bg-white rounded-lg p-2.5 border border-slate-100">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${item.type === 'positive' ? 'bg-green-500' : 'bg-amber-400'}`} />
                    <p className="text-xs text-slate-600 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified + QR */}
            <div className="flex items-end justify-between pt-1">
              <div>
                <p className="text-xs text-slate-500 font-medium leading-snug">Verified by Project K AI Interview Assessment</p>
                <p className="text-xs text-slate-400 mt-0.5">Recruiter view generated for quick screening</p>
              </div>
              <div className="relative group cursor-pointer">
                <QRCode />
                <div className="absolute bottom-full right-0 mb-2 w-44 bg-slate-800 text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none leading-relaxed">
                  QR code to view the same digitally. This will protect from Duplicate
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="text-slate-500 text-xs mt-4">projectk.io · AI Interview Coaching</p>
    </div>
  );
}
