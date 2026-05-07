'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { getScoreColor } from '@/lib/utils';
import { Lock, Zap, Download } from 'lucide-react';
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
  {
    question: 'How do you ensure accessibility in your web applications?',
    answer: 'I use semantic HTML, ARIA labels, and keyboard navigation. I also test with screen readers occasionally.',
    feedback: 'Good awareness of accessibility fundamentals. Mention specific WCAG guidelines and tools like Axe or Lighthouse for auditing.',
    ideal_answer: 'Describe WCAG 2.1 compliance, semantic HTML structure, focus management, color contrast, and how you integrate accessibility testing in your CI pipeline.',
    score: 73,
  },
  {
    question: 'Explain how you would optimize a slow-loading React page.',
    answer: 'I would use lazy loading, code splitting, and reduce unnecessary re-renders using React.memo. I would also optimize images and use CDN.',
    feedback: 'Strong answer covering multiple optimization layers. Add mention of bundle analysis tools like Webpack Bundle Analyzer or web vitals measurement.',
    ideal_answer: 'Combine code splitting, lazy loading, memoization, image optimization, virtualization for large lists (react-window), and Core Web Vitals tracking as a systematic approach.',
    score: 88,
  },
  {
    question: 'What is your approach to writing reusable components?',
    answer: 'I focus on single responsibility, accept props for flexibility, and avoid hardcoded values. I document them with comments.',
    feedback: 'Good principles mentioned. Elaborate on composability patterns, prop drilling solutions, and design system alignment.',
    ideal_answer: 'Describe atomic design, composability, clear prop APIs, controlled vs uncontrolled patterns, and how you version and document component libraries.',
    score: 79,
  },
  {
    question: 'How do you handle errors gracefully in a React application?',
    answer: 'I use try-catch in async functions and Error Boundaries for component-level errors.',
    feedback: 'Correct and complete answer. Consider also mentioning logging services like Sentry for production error tracking.',
    ideal_answer: 'Cover Error Boundaries, global error handlers, async error patterns, user-facing fallback UIs, and integration with monitoring services like Sentry or Datadog.',
    score: 82,
  },
  {
    question: 'Describe a challenging project you worked on and how you resolved the key issue.',
    answer: 'I worked on a dashboard with real-time data updates. The challenge was performance with large datasets. I solved it using pagination and memoization.',
    feedback: 'Good concrete example. Strengthen by quantifying the impact — how much did performance improve? What metrics changed?',
    ideal_answer: 'Use the STAR method: describe the Situation, Task, specific Actions taken (technologies, decisions), and measurable Results such as load time reduction or user satisfaction improvement.',
    score: 77,
  },
  {
    question: 'How do you stay updated with the latest frontend technologies?',
    answer: 'I follow blogs like CSS-Tricks and Dev.to, and I watch YouTube tutorials. I also experiment with new tools in side projects.',
    feedback: 'Shows initiative. Mention specific newsletters, open-source contributions, or community involvement to strengthen the answer.',
    ideal_answer: 'Reference specific sources — official changelogs, RFC discussions, Twitter/X engineering accounts, newsletters like bytes.dev or React Status, and personal projects as a learning playground.',
    score: 74,
  },
  {
    question: 'How would you explain a complex technical issue to a non-technical stakeholder?',
    answer: 'I would avoid technical jargon and explain the issue using a simple comparison. I would describe the impact and next steps in plain language.',
    feedback: 'Good communication intent. Strengthen with a concrete example of a time you did this successfully in a real situation.',
    ideal_answer: 'Add one example involving a manager or customer, and explain how your simplified explanation improved understanding or decision-making.',
    score: 77,
  },
];

const FEATURES = [
  { emoji: '📄', title: 'Full Report',         desc: 'Comprehensive analysis of your answers' },
  { emoji: '📊', title: 'Key Insights',        desc: 'AI-powered strengths & improvement areas' },
  { emoji: '📋', title: 'Action Plan',          desc: 'Personalized steps to improve faster' },
  { emoji: '📥', title: 'Download Score Card', desc: 'Shareable PDF with your performance' },
];

const PAGE_SIZE = 3;

function downloadExcel(questions) {
  const headers = ['#', 'Question', 'Your Answer', 'AI Feedback', 'Ideal Improvement', 'Score'];
  const rows = questions.map((q, i) => [
    i + 1,
    q.question,
    q.answer || '',
    q.feedback || '',
    q.ideal_answer || '',
    `${q.score ?? 0}/100`,
  ]);

  const tableHtml = [
    '<table>',
    '<thead><tr>' + headers.map((h) => `<th style="background:#f1f5f9;font-weight:bold;padding:8px">${h}</th>`).join('') + '</tr></thead>',
    '<tbody>',
    ...rows.map((row) => '<tr>' + row.map((cell) => `<td style="padding:8px;border:1px solid #e2e8f0">${cell}</td>`).join('') + '</tr>'),
    '</tbody></table>',
  ].join('');

  const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'interview-feedback.xls';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function QuestionFeedbackTable({ questions = [], plan = 'free' }) {
  const allQuestions      = questions.length > 0 ? questions : FALLBACK_QUESTIONS;
  const isPremium         = plan === 'premium';
  const isStandardOrAbove = plan === 'standard' || plan === 'premium';
  const sourceQuestions   = isStandardOrAbove ? allQuestions : [allQuestions[0]];

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading]           = useState(false);
  const sentinelRef                     = useRef(null);
  const scrollRef                       = useRef(null);

  const displayQuestions = sourceQuestions.slice(0, visibleCount);
  const hasMore          = visibleCount < sourceQuestions.length;

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    setLoading(true);
    // Simulate async load from API
    setTimeout(() => {
      setVisibleCount((c) => Math.min(c + PAGE_SIZE, sourceQuestions.length));
      setLoading(false);
    }, 400);
  }, [loading, hasMore, sourceQuestions.length]);

  // IntersectionObserver watching the sentinel inside the scrollable card
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !isStandardOrAbove) return;

    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore(); },
      { root: scrollRef.current, threshold: 0.1 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore, isStandardOrAbove]);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">

      {/* ── Section header ── */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-800">Question-by-Question Feedback</h3>
          {isStandardOrAbove && (
            <p className="text-[11px] text-slate-400 mt-0.5">
              Showing {displayQuestions.length} of {sourceQuestions.length} questions
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {!isStandardOrAbove && (
            <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">
              Preview available in standard plan
            </span>
          )}
          {isPremium && (
            <button
              onClick={() => downloadExcel(allQuestions)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all"
            >
              <Download size={13} />
              Download Excel
            </button>
          )}
        </div>
      </div>

      {/* ── Scrollable table area ── */}
      <div
        ref={scrollRef}
        className={isStandardOrAbove ? 'overflow-y-auto max-h-[560px]' : ''}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="bg-slate-50/95 border-b border-slate-100 backdrop-blur-sm">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider w-1/4">Question</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider w-[22%]">Your Answer</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider w-[22%]">AI Feedback</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider w-[22%]">
                  <span className="flex items-center gap-1">
                    Ideal Improvement
                    {!isPremium && <Lock size={10} className="text-slate-300" />}
                  </span>
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center w-[10%]">Score</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
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
                  <td className="px-6 py-6 align-top">
                    {isPremium ? (
                      <p className="text-[11px] text-slate-600 leading-relaxed">{q.ideal_answer || '—'}</p>
                    ) : (
                      <div className="relative">
                        <p className="text-[11px] text-slate-600 leading-relaxed blur-[3px] select-none">
                          {q.ideal_answer || 'Focus on clarity, concrete examples, and a structured answer format that demonstrates depth of knowledge.'}
                        </p>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="flex items-center gap-1 bg-white/90 border border-slate-200 rounded-full px-2 py-0.5 text-[10px] text-slate-500 font-medium shadow-sm">
                            <Lock size={9} /> Premium
                          </span>
                        </div>
                      </div>
                    )}
                  </td>

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

              {/* ── Blurred teaser rows for free plan ── */}
              {!isStandardOrAbove && (
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

        {/* ── Infinite scroll sentinel + loader ── */}
        {isStandardOrAbove && (
          <div ref={sentinelRef} className="py-4 flex items-center justify-center">
            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="w-4 h-4 border-2 border-slate-200 border-t-slate-400 rounded-full animate-spin" />
                Loading more questions…
              </div>
            )}
            {!loading && !hasMore && sourceQuestions.length > PAGE_SIZE && (
              <p className="text-[11px] text-slate-300 font-medium">All {sourceQuestions.length} questions loaded</p>
            )}
          </div>
        )}
      </div>
      {/* ── END scrollable area ── */}

      {/* ── Upgrade banner ── */}
      {!isStandardOrAbove && (
        <div className="px-6 pb-6">
          <div className="h-16 bg-gradient-to-t from-white to-transparent -mt-16 mb-0 pointer-events-none relative z-10" />

          <div className="bg-[#4338ca] rounded-3xl p-8 text-white flex flex-col lg:flex-row items-stretch gap-8 border border-white/10 relative overflow-hidden">
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

            <div className="hidden lg:block w-px bg-white/10 self-stretch" />

            <div className="lg:w-72 flex items-center">
              <div className="w-full bg-white rounded-2xl p-7 flex flex-col items-center text-center shadow-xl">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-indigo-500 text-xs font-bold">✦</span>
                  <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-tight">Upgrade to Premium</span>
                </div>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed">to unlock all insights and reports</p>
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
