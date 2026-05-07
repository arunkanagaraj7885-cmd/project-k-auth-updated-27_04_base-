'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import RoleSelector from '@/components/interview/RoleSelector';
import ModeSelector from '@/components/interview/ModeSelector';
import DifficultySelector from '@/components/interview/DifficultySelector';
import InterviewSummary from '@/components/interview/InterviewSummary';
import { interviewApi } from '@/lib/api/interview';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setConfig, setSessionId } from '@/store/slices/interviewSlice';
import { selectPlan } from '@/store/slices/authSlice';

const LANGUAGES = ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam'];
const EXPERIENCE_LEVELS = ['0 - 2 Years', '2 - 5 Years', '5 - 10 Years', '10+ Years'];

export default function StartInterviewPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const plan = useAppSelector(selectPlan);

  const [step, setStep] = useState(1);
  const [role, setRole] = useState('Frontend Developer'); // Default as per Figma
  const [mode, setMode] = useState('mock');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [language, setLanguage] = useState('English');
  const [exp, setExp] = useState('0 - 2 Years');
  const [jobDesc, setJobDesc] = useState('React, JavaScript, API integration, problem solving, project discussion'); // Default as per Figma
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
    if (!resumeDisclaimer) {
      toast.error('Please confirm your resume is updated.');
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

  const nextStep = () => {
    if (step === 1 && !role.trim()) {
      toast.error('Please enter a target role.');
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  return (
    <div className="animate-fade-in max-w-7xl mx-auto pb-12">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Start a New Interview</h1>
        <p className="text-sm text-slate-500 mt-1">
          Set up your interview in seconds and begin practicing with focused AI-led interview sessions.
        </p>
      </div>

      {/* Hero Banner */}
      <div className="bg-[#064e3b] rounded-3xl p-6 mb-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-2">Practice smarter, not longer</h2>
          <p className="text-sm text-emerald-100/80 max-w-2xl">
            Choose your target role, select the interview type, and start instantly. Resume-based interviews give more realistic questions and stronger feedback.
          </p>
        </div>
        {/* Decorative elements could go here */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Step Header */}
            <div className="px-8 py-5 border-b border-slate-50">
              {/* Step progress indicator */}
              <div className="flex items-center gap-2 mb-3">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                      s < step ? 'bg-emerald-500 text-white' :
                      s === step ? 'bg-[#064e3b] text-white' :
                      'bg-slate-100 text-slate-400'
                    }`}>
                      {s < step ? '✓' : s}
                    </div>
                    {s < 3 && <div className={`h-0.5 w-8 rounded-full transition-all ${s < step ? 'bg-emerald-400' : 'bg-slate-100'}`} />}
                  </div>
                ))}
                <span className="text-xs text-slate-400 ml-1">Step {step} of 3</span>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800">
                  {step === 1 && 'Interview Setup'}
                  {step === 2 && 'Choose Interview Mode'}
                  {step === 3 && 'Difficulty Level'}
                </h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {step === 1 && 'Complete the essentials to begin'}
                  {step === 2 && 'Select the format that matches your time and depth'}
                  {step === 3 && 'Match the complexity to your readiness'}
                </span>
              </div>
            </div>

            {/* Step Content */}
            <div className="p-8">
              {step === 1 && (
                <div className="space-y-8">
                  <RoleSelector value={role} onChange={setRole} />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Experience Level</label>
                      <select 
                        value={exp}
                        onChange={(e) => setExp(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all appearance-none"
                      >
                        {EXPERIENCE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Interview Language</label>
                      <select 
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all appearance-none"
                      >
                        {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-bold text-slate-700">Job Description or Notes (Optional)</label>
                    </div>
                    <textarea
                      value={jobDesc}
                      onChange={(e) => setJobDesc(e.target.value)}
                      placeholder="e.g. React, JavaScript, API integration..."
                      rows={4}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all resize-none"
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <ModeSelector selected={mode} onChange={setMode} />
                  {mode === 'full' && !canFullInterview && (
                    <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-2xl text-xs text-amber-700">
                      <AlertCircle size={16} className="flex-shrink-0" />
                      <p>Full interviews require a Standard or Premium plan. <a href="/pricing" className="underline font-bold">Upgrade →</a></p>
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8">
                  <DifficultySelector selected={difficulty} onChange={setDifficulty} />
                  
                  <div className="pt-8 border-t border-slate-50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-bold text-slate-800">Resume Disclaimer</h3>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Required before you continue</span>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                      <p className="text-sm font-bold text-slate-800 mb-2">Please confirm your profile resume is updated</p>
                      <p className="text-xs text-slate-500 leading-relaxed mb-6">
                        The resume uploaded in your profile page should be your latest version. If it is not updated, please update it from the profile page and return here before continuing.
                      </p>
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center mt-0.5">
                          <input
                            type="checkbox"
                            checked={resumeDisclaimer}
                            onChange={(e) => setResumeDisclaimer(e.target.checked)}
                            className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-300 transition-all checked:border-blue-600 checked:bg-blue-600 hover:border-blue-400"
                          />
                          <span className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                          </span>
                        </div>
                        <span className="text-xs text-slate-600 font-medium group-hover:text-slate-800 transition-colors">
                          I confirm that the resume uploaded in my profile page is up to date, or I want to continue without updating it now.
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Footer */}
            <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
              <button
                onClick={prevStep}
                disabled={step === 1}
                className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors disabled:opacity-0"
              >
                <ChevronLeft size={18} />
                Back
              </button>
              
              {step < 3 && (
                <button
                  onClick={nextStep}
                  className="bg-white border border-slate-200 px-8 py-2.5 rounded-full text-sm font-bold text-slate-800 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm flex items-center gap-2"
                >
                  Next
                  <ChevronRight size={18} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-1">
          <InterviewSummary 
            config={{ 
              role, 
              mode, 
              difficulty, 
              language, 
              hasJD: !!jobDesc,
              resumeConfirmed: resumeDisclaimer 
            }} 
            onStart={handleStart}
            loading={loading}
            disabled={step !== 3 || !resumeDisclaimer}
            showTips={step === 3}
          />
        </div>
      </div>
    </div>
  );
}
