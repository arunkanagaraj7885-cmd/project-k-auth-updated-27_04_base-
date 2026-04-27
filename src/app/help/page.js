import { HelpCircle } from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
        <HelpCircle size={28} className="text-slate-400" />
      </div>
      <h2 className="text-xl font-semibold text-slate-800 mb-2">Help &amp; Support</h2>
      <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
        This page is under construction. Design and functionality are yet to be finalized.
      </p>
      <span className="mt-5 inline-block px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-600 text-xs font-medium">
        Coming soon
      </span>
    </div>
  );
}
