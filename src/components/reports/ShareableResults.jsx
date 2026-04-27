'use client';
import { Share2, Download, Linkedin } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ShareableResults({ reportId, score }) {
  const scoreCardUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/score-card/${reportId}`
    : '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(scoreCardUrl);
    toast.success('Link copied to clipboard!');
  };

  const handleLinkedIn = () => {
    const url = encodeURIComponent(scoreCardUrl);
    const text = encodeURIComponent(`I scored ${score}/100 on my AI-powered mock interview on Project K! 🎯`);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`, '_blank');
  };

  return (
    <div className="card p-5 mb-5">
      <h3 className="font-semibold text-slate-800 mb-2">Share Your Results</h3>
      <p className="text-sm text-slate-500 mb-4">
        Share your score card publicly or add it to your LinkedIn profile.
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <Share2 size={15} />
          Copy Link
        </button>
        <button
          onClick={handleLinkedIn}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0077b5] text-white text-sm font-medium hover:bg-[#006399] transition-colors"
        >
          <Linkedin size={15} />
          Share on LinkedIn
        </button>
      </div>
    </div>
  );
}
