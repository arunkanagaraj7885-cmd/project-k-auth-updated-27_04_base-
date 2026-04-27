'use client';
import { ThumbsUp, TrendingUp } from 'lucide-react';

export default function KeyInsights({ insights = {} }) {
  const { strengths = [], improvements = [] } = insights;

  return (
    <div className="card p-5 mb-5">
      <h3 className="font-semibold text-slate-800 mb-4">Key Insights</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl bg-green-50 border border-green-100 p-4">
          <div className="flex items-center gap-2 mb-3">
            <ThumbsUp size={15} className="text-green-600" />
            <span className="text-sm font-semibold text-green-700">What went well</span>
          </div>
          {strengths.length ? (
            <ul className="space-y-2">
              {strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-green-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0 mt-2" />
                  {s}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-green-700 opacity-60">Complete more practice to unlock.</p>
          )}
        </div>

        <div className="rounded-xl bg-amber-50 border border-amber-100 p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={15} className="text-amber-600" />
            <span className="text-sm font-semibold text-amber-700">Areas to improve</span>
          </div>
          {improvements.length ? (
            <ul className="space-y-2">
              {improvements.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-2" />
                  {s}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-amber-700 opacity-60">No data yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
