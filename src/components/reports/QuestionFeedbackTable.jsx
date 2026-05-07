'use client';
import { getScoreColor } from '@/lib/utils';
import { Lock, Zap } from 'lucide-react';
import Link from 'next/link';

const FALLBACK_QUESTIONS = [
  {
    question: 'Introduce yourself and your frontend experience',
    answer: 'Hi, I am a frontend developer with experience in building responsive web applications using React, JavaScript, HTML, and CSS. I have worked on dashboard interfaces, API integrations, and reusable component development for business applications.',
    feedback: 'Good role alignment and relevant skill mention. The answer was clear and job-focused. To improve further, make it more memorable by adding one line about your strongest achievement or specialization.',
    ideal_answer: 'Start with your years of experience, mention your strongest stack, and close with one project outcome or strength, such as improving usability or building scalable interfaces.',
    score: 81,
  },
  {
    question: 'How do you handle state management in large React applications?',
    answer: 'I use Redux Toolkit for complex global state and Context API for simpler needs. For server state, I prefer TanStack Query.',
    feedback: 'Correct technical approach. Good mention of multiple tools for different use cases.',
    ideal_answer: 'Explain the trade-offs between different state management solutions and give a specific example of a complex state logic you handled.',
    score: 85,
  },
  {
    question: 'What is the difference between useMemo and useCallback?',
    answer: 'useMemo memoizes a value, while useCallback memoizes a function.',
    feedback: 'Concise and correct definition. Could benefit from practical examples of when to use which.',
    ideal_answer: 'Deep dive into referential equality and performance optimizations in React components.',
    score: 76,
  },
];

const FEATURES = [
  { emoji: '📄', title: 'Full Report',          desc: 'Comprehensive analysis of your answers' },
  { emoji: '📊', title: 'Key Insights',         desc: 'AI-powered strengths & improvement areas' },
  { emoji: '📋', title: 'Action Plan',           desc: 'Personalized steps to improve faster' },
  { emoji: '📥', title: 'Download Score Card',  desc: 'Shareable PDF with your performance' },
];

export default function QuestionFeedbackTable({ questions = [], plan = 'free' }) {
  const allQuestions     = questions.length > 0 ? questions : FALLBACK_QUESTIONS;
  const isPremium        = plan === 'premium';
  const displayQuestions = isPremium ? allQuestions : [allQuestions[0]];

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">

      {/* ── Section header ── */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-bold text-slate-800">Question-by-Question Feedback</h3>
        {!isPremium && (
          <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">
            Preview available in standard plan
          </span>
        )}
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider w-1/4">Question</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider w-[26%]">Your Answer</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider w-[26%]">AI Feedback</th>
              {/* <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider w-[16%]">
                <span className="flex items-center gap-1">
                  Ideal Improvement
                  {!isPremium && <Lock size={10} className="text-slate-300" />}
                </span>
              </th> */}
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center w-[8%]">Score</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {/* ── Visible question rows ── */}
            {displayQuestions.map((q, i) => (
              <tr key={q.id || i} className="group hover:bg-slate-50/30 transition-colors">
                <td className="px-6 py-6 align-top">
                  <span className="text-xs font-bold text-slate-800 block mb-1">Question {i + 1}</span>
                  <p className="text-[11px] font-bold text-slate-700 leading-relaxed mb-1">{q.question}</p>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Evaluates self-presentation, relevance, and confidence.
                  </p>
                </td>
                <td className="px-6 py-6 align-top text-[11px] text-slate-600 leading-relaxed">
                  {q.answer || '—'}
                </td>
                <td className="px-6 py-6 align-top text-[11px] text-slate-600 leading-relaxed font-medium">
                  {q.feedback || '—'}
                </td>

                {/* Ideal Improvement — blurred for non-premium */}
                {/* <td className="px-6 py-6 align-top">
                  {isPremium ? (
                    <p className="text-[11px] text-slate-600 leading-relaxed">{q.ideal_answer || '—'}</p>
                  ) : (
                    <div className="relative">
                      <p className="text-[11px] text-slate-600 leading-relaxed blur-[3px] select-none">
                        {q.ideal_answer}
                      </p>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="flex items-center gap-1 bg-white/90 border border-slate-200 rounded-full px-2 py-0.5 text-[10px] text-slate-500 font-medium shadow-sm">
                          <Lock size={9} /> Premium
                        </span>
                      </div>
                    </div>
                  )}
                </td> */}

                <td className="px-6 py-6 align-top text-center">
                  <span
                    className="inline-flex items-center justify-center w-12 py-1.5 rounded-full text-[10px] font-bold"
                    style={{
                      backgroundColor: `${getScoreColor(q.score ?? 0)}20`,
                      color: getScoreColor(q.score ?? 0),
                    }}
                  >
                    {q.score ?? 0}/100
                  </span>
                </td>
              </tr>
            ))}

            {/* ── Blurred teaser rows ── */}
            {!isPremium && (
              <>
                <tr className="blur-[4px] select-none pointer-events-none border-b border-slate-50">
                  <td className="px-6 py-8"><div className="h-4 w-24 bg-slate-200 rounded mb-2" /><div className="h-3 w-32 bg-slate-100 rounded" /></td>
                  <td className="px-6 py-8"><div className="h-12 w-full bg-slate-50 rounded" /></td>
                  <td className="px-6 py-8"><div className="h-12 w-full bg-slate-50 rounded" /></td>
                  <td className="px-6 py-8"><div className="h-12 w-full bg-slate-50 rounded" /></td>
                  <td className="px-6 py-8 text-center"><div className="h-6 w-12 bg-slate-100 rounded-full mx-auto" /></td>
                </tr>
                <tr className="blur-[6px] select-none pointer-events-none">
                  <td className="px-6 py-8"><div className="h-4 w-24 bg-slate-200 rounded mb-2" /><div className="h-3 w-32 bg-slate-100 rounded" /></td>
                  <td className="px-6 py-8"><div className="h-12 w-full bg-slate-50 rounded" /></td>
                  <td className="px-6 py-8"><div className="h-12 w-full bg-slate-50 rounded" /></td>
                  <td className="px-6 py-8"><div className="h-12 w-full bg-slate-50 rounded" /></td>
                  <td className="px-6 py-8 text-center"><div className="h-6 w-12 bg-slate-100 rounded-full mx-auto" /></td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
      {/* ── END table wrapper ── */}

      {/* ── Upgrade banner — natural flow, BELOW the table ── */}
      {!isPremium && (
        <div className="px-6 pb-6">
          {/* Gradient fade over the last blurred row */}
          <div className="h-16 bg-gradient-to-t from-white to-transparent -mt-16 mb-0 pointer-events-none relative z-10" />

          <div className="bg-[#4338ca] rounded-3xl p-8 text-white flex flex-col lg:flex-row items-stretch gap-8 border border-white/10 relative overflow-hidden">
            {/* Left — heading + features */}
            <div className="flex-1 flex flex-col gap-6 justify-center">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border border-white/10">
                  <Zap size={22} className="text-white fill-white" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold mb-1 tracking-tight">Unlock Premium</h4>
                  <p className="text-[13px] text-indigo-200 leading-relaxed max-w-sm">
                    Get deeper interview guidance and a complete performance report after every session.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {FEATURES.map((f) => (
                  <div key={f.title} className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center shrink-0 border border-white/10">
                      <span className="text-sm">{f.emoji}</span>
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-white mb-0.5">{f.title}</p>
                      <p className="text-[11px] text-indigo-200/70 leading-tight">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px bg-white/10 self-stretch" />

            {/* Right — CTA card */}
            <div className="lg:w-72 flex items-center">
              <div className="w-full bg-white rounded-2xl p-7 flex flex-col items-center text-center shadow-xl">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-indigo-500 text-xs font-bold">✦</span>
                  <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-tight">Upgrade to Premium</span>
                </div>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                  to unlock all insights and reports
                </p>
                <Link
                  href="/pricing"
                  className="w-full py-3.5 bg-[#4338ca] text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all active:scale-[0.98] shadow-md flex items-center justify-center gap-2 mb-4"
                >
                  Upgrade to Premium →
                </Link>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold tracking-wide">
                  <Lock size={10} className="shrink-0" />
                  <span>Secure · Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
