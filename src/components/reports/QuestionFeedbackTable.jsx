'use client';
import { getScoreColor } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

function QuestionRow({ q, index }) {
  const [expanded, setExpanded] = useState(false);
  const color = getScoreColor(q.score ?? 0);

  return (
    <div className="border border-slate-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-start gap-4 p-4 text-left hover:bg-slate-50 transition-colors"
      >
        <span
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
          style={{ backgroundColor: color }}
        >
          {q.score ?? '—'}
        </span>
        <p className="flex-1 text-sm font-medium text-slate-700 leading-snug">
          Q{index + 1}: {q.question}
        </p>
        {expanded ? (
          <ChevronUp size={16} className="text-slate-400 flex-shrink-0 mt-0.5" />
        ) : (
          <ChevronDown size={16} className="text-slate-400 flex-shrink-0 mt-0.5" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-slate-100 bg-slate-50">
          <div className="pt-3 space-y-3">
            {q.answer && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Your Answer</p>
                <p className="text-sm text-slate-700 leading-relaxed">{q.answer}</p>
              </div>
            )}
            {q.feedback && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">AI Feedback</p>
                <p className="text-sm text-slate-600 leading-relaxed">{q.feedback}</p>
              </div>
            )}
            {q.ideal_answer && (
              <div>
                <p className="text-xs font-semibold text-green-600 uppercase mb-1">Suggested Answer</p>
                <p className="text-sm text-slate-600 leading-relaxed">{q.ideal_answer}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function QuestionFeedbackTable({ questions = [] }) {
  if (!questions.length) return (
    <div className="card p-5 mb-5 text-center text-sm text-slate-400 py-10">
      No question data available.
    </div>
  );

  return (
    <div className="card p-5 mb-5">
      <h3 className="font-semibold text-slate-800 mb-4">
        Question-by-Question Feedback
        <span className="ml-2 text-sm font-normal text-slate-400">({questions.length} questions)</span>
      </h3>
      <div className="space-y-2">
        {questions.map((q, i) => (
          <QuestionRow key={q.id ?? i} q={q} index={i} />
        ))}
      </div>
    </div>
  );
}
