'use client';
import { Check } from 'lucide-react';

const FEATURES = [
  '1 full interview included',
  'Detailed report included',
  'Completely free to try',
];

export default function TryYourselfCard({ isSelected, onSelect }) {
  return (
    <div
      onClick={onSelect}
      className={`rounded-2xl border-2 p-6 cursor-pointer transition-all flex flex-col ${
        isSelected
          ? 'border-blue-500 bg-blue-50 shadow-md'
          : 'border-slate-200 bg-white hover:border-blue-300'
      }`}
    >
      <h3 className="font-bold text-slate-800 text-lg mb-1">Try Yourself</h3>
      <p className="text-xs text-slate-500 mb-4 leading-relaxed">
        A completely free way to experience Project K before choosing a paid plan.
      </p>

      <div className="mb-5">
        <span className="text-3xl font-bold text-slate-900">₹0</span>
        <span className="text-sm text-slate-500 ml-1">/ one time</span>
      </div>

      <ul className="space-y-2.5 flex-1 mb-6">
        {FEATURES.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
            <Check size={15} className="text-green-500 flex-shrink-0 mt-0.5" />
            {f}
          </li>
        ))}
      </ul>

      <button
        className={`w-full py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors ${
          isSelected
            ? 'bg-blue-600 text-white border-blue-600'
            : 'text-blue-600 border-blue-500 hover:bg-blue-50'
        }`}
      >
        Try for Free
      </button>
    </div>
  );
}
