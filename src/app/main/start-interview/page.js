'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { AlertCircle } from 'lucide-react';
import RoleSelector from '@/components/interview/RoleSelector';
import ModeSelector from '@/components/interview/ModeSelector';
import DifficultySelector from '@/components/interview/DifficultySelector';
import LanguageDropdown from '@/components/interview/LanguageDropdown';
import InterviewSummary from '@/components/interview/InterviewSummary';
import { interviewApi } from '@/lib/api/interview';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setConfig, setSessionId } from '@/store/slices/interviewSlice';
import { selectPlan } from '@/store/slices/authSlice';
import { useInterviewDefaults } from '@/hooks/useInterview';

export default function StartInterviewPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const plan = useAppSelector(selectPlan);

  const [role, setRole] = useState('');
  const [mode, setMode] = useState('mock');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [language, setLanguage] = useState('English');
  const [jobDesc, setJobDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [resumeDisclaimer, setResumeDisclaimer] = useState(false);

  // Full interviews require standard+ plan
  const canFullInterview = plan !== 'free';

  const handleStart = async () => {
    if (!role.trim()) {
      toast.error('Please enter your target role.');
      return;
    }
    if (mode === 'full' && !canFullInterview) {
      toast.error('Full interviews require a Standard or Premium plan.');
      return;
    }

    setLoading(true);
    try {
      const config = { role, mode, difficulty, language, job_description: jobDesc || undefined };
      dispatch(setConfig(config));

      const res = await interviewApi.createSession(config);
      const { session_id } = res.data;
      dispatch(setSessionId(session_id));

      router.push(`/main/interview/${session_id}`);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to create session. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">Configure your interview</h2>
        <p className="text-sm text-slate-500 mt-1">
          Set up your preferences and start practising with our AI avatar interviewer.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Role */}
          <div className="card p-5">
            <RoleSelector value={role} onChange={setRole} />
          </div>

          {/* Mode */}
          <div className="card p-5">
            <ModeSelector selected={mode} onChange={setMode} />
            {mode === 'full' && !canFullInterview && (
              <div className="mt-3 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <p>Full interviews require a Standard or Premium plan. <a href="/pricing" className="underline font-medium">Upgrade →</a></p>
              </div>
            )}
          </div>

          {/* Difficulty */}
          <div className="card p-5">
            <DifficultySelector selected={difficulty} onChange={setDifficulty} />
          </div>

          {/* Language + JD row */}
          <div className="card p-5 space-y-5">
            <LanguageDropdown value={language} onChange={setLanguage} />

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Job Description{' '}
                <span className="text-xs font-normal text-slate-400">(optional — improves question relevance)</span>
              </label>
              <textarea
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                placeholder="Paste the job description here…"
                rows={4}
                className="input-base resize-none"
              />
            </div>
          </div>

          {/* Resume disclaimer */}
          <div className="card p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={resumeDisclaimer}
                onChange={(e) => setResumeDisclaimer(e.target.checked)}
                className="mt-0.5 accent-blue-600"
              />
              <p className="text-sm text-slate-600 leading-relaxed">
                I understand the AI interviewer will ask questions based on my profile and selected role.
                My responses will be recorded for scoring purposes only.
              </p>
            </label>
          </div>

          {/* Start button */}
          <button
            onClick={handleStart}
            disabled={loading || !resumeDisclaimer}
            className="btn-primary text-base py-3.5"
          >
            {loading ? (
              <><span className="spinner" /> Setting up your interview…</>
            ) : (
              '🎯 Start Interview'
            )}
          </button>
        </div>

        {/* Summary sidebar */}
        <div>
          <InterviewSummary config={{ role, mode, difficulty, language, hasJD: !!jobDesc }} />
        </div>
      </div>
    </div>
  );
}
