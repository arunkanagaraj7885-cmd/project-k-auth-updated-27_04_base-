'use client';
import toast from 'react-hot-toast';

export default function ShareableResults({ reportId, score }) {
  const scoreCardUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/score-card/${reportId}`
    : '';

  const handleDownload = () => {
    toast.success('Score card download starting…');
  };

  const handleLinkedIn = () => {
    const url  = encodeURIComponent(scoreCardUrl);
    const text = encodeURIComponent(`I scored ${score}/100 on my AI-powered mock interview on Project K! 🎯`);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`, '_blank');
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`I scored ${score}/100 on my AI mock interview! Check it out: ${scoreCardUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-800">Shareable Results</h3>
        <span className="text-[11px] text-slate-400 font-medium">Use this for motivation or social proof</span>
      </div>

      <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 mb-4">
        <p className="text-sm font-bold text-slate-800 mb-1">Score Card Ready</p>
        <p className="text-xs text-slate-500 leading-relaxed">Share your interview score, role, and readiness badge as an image.</p>
      </div>

      <div className="space-y-2">
        <button
          onClick={handleDownload}
          className="w-full py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all"
        >
          Download Score Card
        </button>
        <button
          onClick={handleLinkedIn}
          className="w-full py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all"
        >
          Share to LinkedIn
        </button>
        <button
          onClick={handleWhatsApp}
          className="w-full py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all"
        >
          Share to WhatsApp
        </button>
      </div>
    </div>
  );
}
