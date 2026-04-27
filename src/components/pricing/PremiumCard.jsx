'use client';
import { Check, Zap } from 'lucide-react';

const FEATURES = [
  '20 mock interviews with AI avatar',
  'Each mock under 5 minutes or 4 to 5 questions',
  '8 full interviews up to 15 minutes',
  'Detailed report with stronger insights',
  'Job assistance included',
  'Email and WhatsApp support',
];

export default function PremiumCard({ isSelected, onSelect }) {
  return (
    <div
      onClick={onSelect}
      className={`rounded-2xl border-2 p-6 cursor-pointer transition-all flex flex-col relative ${
        isSelected
          ? 'border-blue-600 bg-blue-50 shadow-lg shadow-blue-100'
          : 'border-blue-500 bg-white shadow-md shadow-blue-50 hover:shadow-lg'
      }`}
    >
      {/* Most Popular badge */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
        <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full shadow">
          <Zap size={11} />
          Most Popular
        </span>
      </div>

      <h3 className="font-bold text-slate-800 text-lg mb-1 mt-2">Premium</h3>
      <p className="text-xs text-slate-500 mb-4 leading-relaxed">
        Best value for serious preparation with more attempts, deeper analysis, and job support.
      </p>

      <div className="mb-5">
        <span className="text-3xl font-bold text-slate-900">₹899</span>
        <span className="text-sm text-slate-500 ml-1">/ month</span>
      </div>

      <ul className="space-y-2.5 flex-1 mb-6">
        {FEATURES.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
            <Check size={15} className="text-blue-600 flex-shrink-0 mt-0.5" />
            {f}
          </li>
        ))}
      </ul>

      <button
        className={`w-full py-2.5 rounded-xl text-sm font-bold transition-colors ${
          isSelected
            ? 'bg-blue-700 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        } shadow-md shadow-blue-200`}
      >
        Get Hired Faster
      </button>
    </div>
  );
}
