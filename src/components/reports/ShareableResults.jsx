'use client';
import { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { useScoreCard } from '@/hooks/useReport';
import ScoreCardPDF from './ScoreCardPDF';

export default function ShareableResults({ reportId, score }) {
  const { data: card } = useScoreCard(reportId);
  const [downloading, setDownloading] = useState(false);

  const scoreCardUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/score-card/${reportId}`
    : '';

  const handleDownload = async () => {
    if (!card) return;
    setDownloading(true);
    try {
      const blob = await pdf(<ScoreCardPDF card={card} />).toBlob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `score-card-${card.role?.replace(/\s+/g, '-').toLowerCase() ?? reportId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
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
          disabled={!card || downloading}
          className="w-full py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {downloading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
              Generating PDF…
            </>
          ) : (
            'Download Score Card'
          )}
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
