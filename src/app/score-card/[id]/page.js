'use client';
import { Suspense, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MessageCircle, User, Star, ShieldCheck, Globe, Calendar, Briefcase, Video } from 'lucide-react';
import { useScoreCard } from '@/hooks/useReport';

/* ── Amber score ring ── */
function ScoreRing({ score }) {
  const pct = Math.min(score, 100);
  const deg = (pct / 100) * 360;
  return (
    <div style={{ width: 148, height: 148, position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: `conic-gradient(from -90deg, #f59e0b 0deg, #f59e0b ${deg}deg, rgba(255,255,255,0.10) ${deg}deg 360deg)`,
          padding: 11,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: '#0d3d35',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 44, lineHeight: 1 }}>{score}</span>
          <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 9, fontWeight: 700, letterSpacing: 2, marginTop: 4 }}>SCORE</span>
        </div>
      </div>
    </div>
  );
}

/* ── Solid dark bar ── */
function ScoreBar({ label, value }) {
  const pct = Math.min((value / 10) * 100, 100);
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-slate-700" style={{ width: 176, flexShrink: 0 }}>{label}</span>
      <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full bg-[#0d3d35]" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm font-bold text-slate-800" style={{ width: 36, textAlign: 'right' }}>{value}</span>
    </div>
  );
}

/* ── Corner dot pattern ── */
function CornerDots({ corner = 'tl' }) {
  const posClass = corner === 'tl' ? 'top-0 left-0' : 'top-0 right-0';
  return (
    <div className={`absolute ${posClass} w-40 h-40 opacity-[0.18] pointer-events-none`}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={`dots-${corner}`} x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.8" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#dots-${corner})`} />
      </svg>
    </div>
  );
}

function ScoreCardInner() {
  const { id } = useParams();
  const { data: card, isLoading } = useScoreCard(id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="w-10 h-10 border-[3px] border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 text-center">
        <div>
          <p className="text-slate-500 mb-3">Score card not found or has been removed.</p>
          <a href="/auth/login" className="text-teal-700 hover:underline text-sm">Try Project K →</a>
        </div>
      </div>
    );
  }

  const [date, setDate] = useState('');
  useEffect(() => {
    setDate(new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }));
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex items-start justify-center py-10 px-4">
      {/* A4 portrait card */}
      <div className="bg-white shadow-2xl flex flex-col" style={{ width: 794, minHeight: 1123 }}>

        {/* ══ HEADER ══ */}
        <div className="relative bg-[#0d3d35] flex flex-col items-center px-12 pt-10 pb-10 overflow-hidden">
          <CornerDots corner="tl" />
          <CornerDots corner="tr" />

          {/* K Logo */}
          <div className="relative z-10 w-14 h-14 rounded-2xl bg-teal-600 flex items-center justify-center mb-5 shadow-lg">
            <span className="text-white font-extrabold text-2xl tracking-tight">K</span>
          </div>

          <h1 className="relative z-10 text-white font-extrabold text-3xl mb-2 tracking-tight text-center">
            Project K Interview Score Card
          </h1>
          <p className="relative z-10 text-teal-400 text-sm mb-8">Quick recruiter-friendly summary</p>

          {/* Score ring */}
          <div className="relative z-10 mb-6">
            <ScoreRing score={card.score} />
          </div>

          <h2 className="relative z-10 text-white font-bold text-2xl mb-2 text-center">{card.readiness_label}</h2>
          <p className="relative z-10 text-slate-300 text-sm text-center leading-relaxed" style={{ maxWidth: 480 }}>
            {card.readiness_desc}
          </p>
        </div>

        {/* ══ BODY ══ */}
        <div className="flex flex-col flex-1 px-10 py-8 gap-6">

          {/* Candidate chip */}
          <div className="bg-[#0d3d35] rounded-2xl px-6 py-5 flex items-center gap-5">
            <div className="w-14 h-14 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0">
              <User size={26} className="text-white" />
            </div>
            <p className="text-white font-bold text-xl leading-none">{card.candidate_name}</p>
            <div className="self-stretch w-px bg-white/20 mx-2" />
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-sm text-teal-200">
                <Briefcase size={13} className="text-teal-400 flex-shrink-0" />
                <span><span className="text-teal-400 font-semibold">Role:</span> {card.role}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-teal-200">
                <Video size={13} className="text-teal-400 flex-shrink-0" />
                <span><span className="text-teal-400 font-semibold">Mode:</span> {card.mode === 'full' ? 'Full Interview' : 'Mock Interview'}</span>
              </div>
            </div>
          </div>

          {/* Snapshot */}
          <div className="border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-slate-800 text-base">Snapshot</h3>
              <span className="text-xs text-slate-400">What matters most</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {/* Communication */}
              <div className="border border-slate-100 rounded-xl p-5 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center mb-3">
                  <MessageCircle size={22} className="text-teal-600" />
                </div>
                <p className="text-[10px] font-bold text-teal-600 uppercase tracking-wider mb-2">Communication</p>
                <p className="text-2xl font-bold text-slate-800 leading-none mb-1.5">
                  {card.snapshot.communication}<span className="text-sm font-normal text-slate-400">/10</span>
                </p>
                <p className="text-xs text-slate-500">{card.snapshot.communication_label}</p>
              </div>
              {/* Confidence */}
              <div className="border border-slate-100 rounded-xl p-5 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-3">
                  <User size={22} className="text-blue-500" />
                </div>
                <p className="text-[10px] font-bold text-teal-600 uppercase tracking-wider mb-2">Confidence</p>
                <p className="text-2xl font-bold text-slate-800 leading-none mb-1.5">
                  {card.snapshot.confidence}<span className="text-sm font-normal text-slate-400">/10</span>
                </p>
                <p className="text-xs text-slate-500">{card.snapshot.confidence_label}</p>
              </div>
              {/* Recommendation */}
              <div className="border border-slate-100 rounded-xl p-5 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-3">
                  <Star size={22} className="text-green-500 fill-green-500" />
                </div>
                <p className="text-[10px] font-bold text-teal-600 uppercase tracking-wider mb-2">Recommendation</p>
                <p className="text-2xl font-bold text-teal-700 leading-none mb-1.5">{card.snapshot.recommendation}</p>
                <p className="text-xs text-slate-500">{card.snapshot.recommendation_label}</p>
              </div>
            </div>
          </div>

          {/* Core Scores */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-slate-800 text-base">Core Scores</h3>
              <span className="text-xs text-slate-400">Simple score view</span>
            </div>
            <div className="flex flex-col gap-4">
              {card.core_scores.map((s) => (
                <ScoreBar key={s.label} label={s.label} value={s.value} />
              ))}
            </div>
          </div>

          {/* Key Summary */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 text-base">Key Summary</h3>
              <span className="text-xs text-slate-400">Easy to scan</span>
            </div>
            <div className="flex flex-col gap-3.5">
              {card.key_summary.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className={`rounded-full flex-shrink-0 mt-1.5 ${item.type === 'positive' ? 'bg-green-500' : 'bg-amber-400'}`}
                    style={{ width: 10, height: 10 }}
                  />
                  <p className="text-sm text-slate-600 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Verified badge */}
          <div className="border border-slate-200 rounded-2xl p-5 flex items-center gap-4 bg-slate-50/60 mt-auto">
            <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={24} className="text-teal-600" />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm">Verified by Project K AI Interview Assessment</p>
              <p className="text-xs text-slate-500 mt-0.5">Recruiter view generated for quick screening</p>
            </div>
          </div>

        </div>

        {/* ══ FOOTER ══ */}
        <div className="px-10 py-4 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe size={15} className="text-slate-500" />
            <span className="font-bold text-slate-800 text-sm">projectk.io</span>
            <span className="text-slate-300 text-base mx-1">|</span>
            <span className="text-slate-500 text-sm">AI Interview Coaching</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Calendar size={14} />
            <span>Generated on {date}</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function ScoreCardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ScoreCardInner />
    </Suspense>
  );
}
