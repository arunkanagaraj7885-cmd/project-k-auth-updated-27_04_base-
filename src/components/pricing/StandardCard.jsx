'use client';
import { Check, Lock } from 'lucide-react';

const FEATURES = [
  '10 mock interviews with AI avatar',
  'Each mock under 5 minutes or 4 to 5 questions',
  '4 full interviews up to 15 minutes',
  'Basic report after each session',
  'Email support',
];

const LOCKED_PREVIEW = 'Unlock detailed report sections, deeper feedback, and job assistance with Premium.';

export default function StandardCard({ isSelected, onSelect }) {
  return (
    <div
      onClick={onSelect}
      className={`rounded-2xl border-2 p-6 cursor-pointer transition-all flex flex-col ${
        isSelected
          ? 'border-blue-500 bg-blue-50 shadow-md'
          : 'border-slate-200 bg-white hover:border-blue-300'
      }`}
    >
      <h3 className="font-bold text-slate-800 text-lg mb-1">Standard</h3>
      <p className="text-xs text-slate-500 mb-4 leading-relaxed">
        Perfect to get started with guided mock practice at a student-friendly price.
      </p>

      <div className="mb-5">
        <span className="text-3xl font-bold text-slate-900">₹499</span>
        <span className="text-sm text-slate-500 ml-1">/ month</span>
      </div>

      <ul className="space-y-2.5 flex-1 mb-4">
        {FEATURES.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
            <Check size={15} className="text-green-500 flex-shrink-0 mt-0.5" />
            {f}
          </li>
        ))}
      </ul>

      {/* Locked preview section */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 mb-5 relative overflow-hidden">
        <div className="blur-sm select-none text-xs text-slate-500 leading-relaxed">
          {LOCKED_PREVIEW}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-slate-200 shadow-sm">
            <Lock size={12} className="text-slate-500" />
            <span className="text-xs font-medium text-slate-600">Premium report preview locked</span>
          </div>
        </div>
      </div>

      <button
        className={`w-full py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors ${
          isSelected
            ? 'bg-blue-600 text-white border-blue-600'
            : 'text-blue-600 border-blue-500 hover:bg-blue-50'
        }`}
      >
        Choose Standard
      </button>
    </div>
  );
}
