'use client';

const LABELS = {
  mode: { mock: 'Mock Interview', full: 'Full Interview' },
  difficulty: { 
    beginner: 'Beginner', 
    intermediate: 'Intermediate', 
    advanced: 'Advanced', 
    adaptive: 'Adaptive' 
  },
};

export default function InterviewSummary({ config, onStart, loading, disabled, showTips }) {
  const { role, mode, difficulty, language, hasJD, resumeConfirmed } = config;

  const details = [
    { label: 'Role', value: role || 'Frontend Developer' },
    { label: 'Mode', value: LABELS.mode[mode] || 'Mock Interview' },
    { label: 'Difficulty', value: LABELS.difficulty[difficulty] || 'Intermediate' },
    { label: 'Language', value: language || 'English' },
    { label: 'Focus', value: 'Technical' },
    { label: 'Resume Status', value: resumeConfirmed ? 'Confirmed' : 'Pending' },
  ];

  return (
    <div className="space-y-3 sticky top-24">
      {/* Main Summary Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-800">Interview Summary</h3>
          <span className="text-[10px] text-slate-400">Live preview</span>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-50/50 rounded-2xl p-3 border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Time</span>
            <p className="text-sm font-bold text-slate-800">{mode === 'full' ? '15 min' : '5 min'}</p>
          </div>
          <div className="bg-slate-50/50 rounded-2xl p-3 border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Questions</span>
            <p className="text-sm font-bold text-slate-800">{mode === 'full' ? '10-12' : '3'}</p>
          </div>
        </div>

        {/* Details List */}
        <div className="mb-4">
          {details.map(({ label, value }, idx) => (
            <div key={label} className={`flex items-center justify-between py-2 ${idx !== details.length - 1 ? 'border-b border-slate-50' : ''}`}>
              <span className="text-xs text-slate-500 font-medium">{label}</span>
              <span className="text-xs text-slate-800 font-bold">{value}</span>
            </div>
          ))}
        </div>

        {/* CTA Card */}
        <div className="bg-[#064e3b] rounded-2xl p-4 text-white text-center">
          <h4 className="text-sm font-bold mb-1.5">Ready to begin?</h4>
          <p className="text-[10px] text-emerald-100/80 leading-relaxed mb-3">
            Your AI interviewer is prepared with role-based questions and instant feedback.
          </p>
          {disabled && (
            <p className="text-[10px] text-amber-300 mb-3 flex items-center justify-center gap-1">
              <span>🔒</span> Complete all 3 steps to start
            </p>
          )}
          <button
            onClick={onStart}
            disabled={loading || disabled}
            className="w-full bg-white text-[#064e3b] py-3 rounded-xl font-bold text-xs transition-all hover:bg-emerald-50 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-[#064e3b]/30 border-t-[#064e3b] rounded-full animate-spin inline-block" />
            ) : (
              'Start Interview'
            )}
          </button>
        </div>
      </div>

      {/* Quick Tips - Conditional */}
      {showTips && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Quick Tips</h3>
          </div>
          <div className="space-y-3">
            <div className="bg-slate-50/50 rounded-2xl p-3 border border-slate-100">
              <p className="text-xs font-bold text-slate-800 mb-1">Use a quiet place</p>
              <p className="text-[10px] text-slate-500 leading-relaxed">Better audio quality improves answer capture.</p>
            </div>
            <div className="bg-slate-50/50 rounded-2xl p-3 border border-slate-100">
              <p className="text-xs font-bold text-slate-800 mb-1">Keep answers structured</p>
              <p className="text-[10px] text-slate-500 leading-relaxed">Try short responses with examples where possible.</p>
            </div>
            <div className="bg-slate-50/50 rounded-2xl p-3 border border-slate-100">
              <p className="text-xs font-bold text-slate-800 mb-1">Update resume for realism</p>
              <p className="text-[10px] text-slate-500 leading-relaxed">Closer to actual job interviews when your profile is current.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
