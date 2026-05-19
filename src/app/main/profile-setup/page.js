'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { User, Upload, CheckCircle2, AlertTriangle, Lock, FileText, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectUser,
  selectOnboardingComplete,
  setOnboardingComplete,
  setUser,
} from '@/store/slices/authSlice';
import { profileApi } from '@/lib/api/profile';

function clearOnbCookie() {
  document.cookie = 'pk_onb=done; path=/; max-age=86400; SameSite=Lax';
}

const COMPLETION_HINTS = [
  'Profile photo is mandatory to continue',
  'Interview language is set to English by default',
  'You can add address, LinkedIn, and more details later',
  'Resume upload improves interview personalization',
];

function CompletionPanel({ pct }) {
  return (
    <div className="card p-5 sticky top-24">
      <h3 className="font-semibold text-slate-800 mb-4">Profile completion</h3>
      <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
        <span>Current progress</span>
        <span className="font-semibold text-slate-700">{pct}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-5">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <ul className="space-y-3">
        {COMPLETION_HINTS.map((hint) => (
          <li key={hint} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0" />
            {hint}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ProfileSetupPage() {
  const router             = useRouter();
  const dispatch           = useAppDispatch();
  const user               = useAppSelector(selectUser);
  const onboardingComplete = useAppSelector(selectOnboardingComplete);

  const [isLocked, setIsLocked] = useState(true);
  useEffect(() => {
    const onbCookie = document.cookie.split('; ').find((c) => c.startsWith('pk_onb='))?.split('=')[1];
    setIsLocked(onbCookie !== 'profile' && onboardingComplete);
  }, [onboardingComplete]);

  const [loading,        setLoading]        = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [avatarFile,     setAvatarFile]     = useState(null);
  const [avatarPreview,  setAvatarPreview]  = useState(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [currentResume,  setCurrentResume]  = useState(null);
  const [experience,     setExperience]     = useState('fresher');

  const { register, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      firstName: '', lastName: '', targetRole: '', mainSkill: '',
      yearsOfExperience: '', country: '', state: '', whatsappNumber: '', college: '', company: '',
    },
  });

  const w = watch();

  // ── Load profile on mount ────────────────────────────────────────────────
  useEffect(() => {
    profileApi.get()
      .then(({ data }) => {
        const { user: u, profile: p } = data;
        const expLevel = p.experience_level || 'fresher';
        setExperience(expLevel);
        if (p.profile_photo_url) setAvatarPreview(p.profile_photo_url);
        const current = p.resumes?.find((r) => r.is_current) ?? p.resumes?.[0] ?? null;
        if (current) setCurrentResume(current);

        reset({
          firstName:         u.first_name  || '',
          lastName:          u.last_name   || '',
          targetRole:        p.target_role || '',
          mainSkill:         Array.isArray(p.main_skills) ? p.main_skills.join(', ') : (p.main_skills || ''),
          yearsOfExperience: p.years_of_experience != null ? String(p.years_of_experience) : '',
          country:           '',
          state:             '',
          whatsappNumber:    u.phone_number || '',
          college:  expLevel === 'fresher'     ? (p.college_or_company || '') : '',
          company:  expLevel !== 'fresher'     ? (p.college_or_company || '') : '',
        });

        dispatch(setUser({ first_name: u.first_name, last_name: u.last_name, name: `${u.first_name} ${u.last_name}`.trim() }));
      })
      .catch(() => { /* form stays with defaults */ })
      .finally(() => setProfileLoading(false));
  }, []);

  // ── Photo upload (immediate on file select) ──────────────────────────────
  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);

    setPhotoUploading(true);
    try {
      await profileApi.uploadPhoto(file);
      toast.success('Profile photo uploaded!');
    } catch {
      toast.error('Photo upload failed. Please try again.');
      setAvatarFile(null);
      setAvatarPreview(null);
    } finally {
      setPhotoUploading(false);
    }
  };

  // ── Resume upload (immediate on file select) ─────────────────────────────
  const handleResumeChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResumeUploading(true);
    try {
      const { data } = await profileApi.uploadResume(file);
      setCurrentResume({ filename: data.filename ?? file.name, url: data.resume_url, is_current: true });
      toast.success('Resume uploaded successfully!');
    } catch {
      toast.error('Resume upload failed. Please try again.');
    } finally {
      setResumeUploading(false);
    }
  };

  // ── Submit: PATCH /profile/ ──────────────────────────────────────────────
  const onSubmit = async (data) => {
    if (!isLocked) {
      if (!data.firstName?.trim() || !data.lastName?.trim()) {
        toast.error('Enter your first and last name.'); return;
      }
      if (!avatarFile && !avatarPreview) {
        toast.error('Please upload a profile photo to continue.'); return;
      }
    }
    if (!data.targetRole?.trim()) { toast.error('Target role is required.'); return; }
    if (!data.mainSkill?.trim())  { toast.error('Main skill is required.');  return; }
    if (experience === 'fresher' && !data.college?.trim()) {
      toast.error('College name is required.'); return;
    }

    setLoading(true);
    try {
      const payload = {
        experience_level:    experience,
        target_role:         data.targetRole.trim(),
        main_skills:         data.mainSkill.split(',').map((s) => s.trim()).filter(Boolean),
        college_or_company:  experience === 'fresher' ? data.college?.trim() : data.company?.trim(),
      };
      if (experience !== 'fresher' && data.yearsOfExperience) {
        payload.years_of_experience = parseInt(data.yearsOfExperience, 10) || 0;
      }
      if (!isLocked) {
        payload.first_name = data.firstName.trim();
        payload.last_name  = data.lastName.trim();
      }

      await profileApi.update(payload);

      const firstName = isLocked ? (user?.first_name || '') : data.firstName.trim();
      const lastName  = isLocked ? (user?.last_name  || '') : data.lastName.trim();
      dispatch(setUser({ first_name: firstName, last_name: lastName, name: `${firstName} ${lastName}`.trim() }));
      dispatch(setOnboardingComplete(true));
      clearOnbCookie();

      toast.success('Profile saved! Taking you to your dashboard…');
      setTimeout(() => { window.location.href = '/main/dashboard'; }, 800);
    } catch {
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Derived display values ───────────────────────────────────────────────
  const lockedFirstName = user?.first_name || '';
  const lockedLastName  = user?.last_name  || '';
  const displayName     = isLocked
    ? [lockedFirstName, lockedLastName].filter(Boolean).join(' ') || 'Your Name'
    : [w.firstName, w.lastName].filter(Boolean).join(' ') || 'Your Name';

  // Progress
  const tracked = [
    !!avatarPreview,
    !!w.targetRole?.trim(),
    !!w.mainSkill?.trim(),
    !!w.country?.trim(),
    !!w.state?.trim(),
    !!w.whatsappNumber?.trim(),
    experience === 'fresher' ? !!w.college?.trim() : !!w.company?.trim(),
    !!currentResume,
  ];
  const pct = Math.round((tracked.filter(Boolean).length / tracked.length) * 100);

  if (profileLoading) {
    return (
      <div className="animate-pulse space-y-4 p-8">
        <div className="h-8 bg-slate-100 rounded w-64" />
        <div className="h-64 bg-slate-100 rounded-xl" />
        <div className="h-64 bg-slate-100 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Complete your quick profile setup</h1>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            We kept this short so you can start faster. You can complete the rest of your profile later inside the application.
          </p>
        </div>
        <p className="text-sm text-slate-500 flex-shrink-0 ml-6 mt-1">
          Welcome, <span className="font-semibold text-slate-700">{lockedFirstName || user?.first_name || 'User'}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* ── Form card ── */}
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2">
          <div className="card p-6">

            <div className="flex items-start justify-between mb-1">
              <h2 className="text-lg font-bold text-slate-800">Let's personalize your interview experience</h2>
            </div>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              Your name details are already filled. Add only the essential information needed to generate more
              relevant interview questions and reports.
            </p>

            {/* ── Profile photo ── */}
            <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-200 border-2 border-slate-300 flex items-center justify-center flex-shrink-0">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={26} className="text-slate-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800">{displayName}</p>
                {isLocked ? (
                  <p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-400 bg-slate-100 border border-slate-200 rounded-full px-2 py-0.5">
                    <Lock size={10} className="flex-shrink-0" /> Locked · Contact support to update
                  </p>
                ) : (
                  <>
                    <p className="text-xs text-slate-500 mt-0.5">Profile picture is mandatory.</p>
                    {avatarPreview ? (
                      <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                        <CheckCircle2 size={12} /> Photo uploaded
                      </p>
                    ) : (
                      <p className="mt-1 inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                        <AlertTriangle size={10} className="flex-shrink-0" /> Cannot be changed after submission
                      </p>
                    )}
                  </>
                )}
              </div>
              {!isLocked && (
                <label className="cursor-pointer flex-shrink-0">
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                  <span className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, width: 'auto', padding: '8px 18px', fontSize: 13 }}>
                    {photoUploading ? <span className="w-3 h-3 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" /> : <Upload size={13} />}
                    {photoUploading ? 'Uploading…' : 'Upload'}
                  </span>
                </label>
              )}
            </div>

            {/* ── Form fields ── */}
            <div className="space-y-4">

              {/* Row 1: First Name | Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    First Name {!isLocked && <span className="text-red-500">*</span>}
                  </label>
                  {isLocked ? (
                    <div className="input-base bg-slate-50 text-slate-600 flex items-center gap-2 cursor-not-allowed select-none">
                      <Lock size={12} className="text-slate-400 flex-shrink-0" />{lockedFirstName}
                    </div>
                  ) : (
                    <input {...register('firstName')} type="text" placeholder="e.g. Arjun" className="input-base" autoComplete="given-name" />
                  )}
                  <p className={`mt-1.5 inline-flex items-center gap-1 text-xs rounded-full px-2 py-0.5 ${isLocked ? 'text-slate-400 bg-slate-100 border border-slate-200' : 'text-amber-600 bg-amber-50 border border-amber-200'}`}>
                    {isLocked ? <><Lock size={10} className="flex-shrink-0" /> Locked · Contact support to update</> : <><AlertTriangle size={10} className="flex-shrink-0" /> Cannot be changed after submission</>}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Last Name / Initial {!isLocked && <span className="text-red-500">*</span>}
                  </label>
                  {isLocked ? (
                    <div className="input-base bg-slate-50 text-slate-600 flex items-center gap-2 cursor-not-allowed select-none">
                      <Lock size={12} className="text-slate-400 flex-shrink-0" />{lockedLastName}
                    </div>
                  ) : (
                    <input {...register('lastName')} type="text" placeholder="e.g. Kumar" className="input-base" autoComplete="family-name" />
                  )}
                  <p className={`mt-1.5 inline-flex items-center gap-1 text-xs rounded-full px-2 py-0.5 ${isLocked ? 'text-slate-400 bg-slate-100 border border-slate-200' : 'text-amber-600 bg-amber-50 border border-amber-200'}`}>
                    {isLocked ? <><Lock size={10} className="flex-shrink-0" /> Locked · Contact support to update</> : <><AlertTriangle size={10} className="flex-shrink-0" /> Cannot be changed after submission</>}
                  </p>
                </div>
              </div>

              {/* Row 2: Experience Level | Years of Experience */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Experience Level <span className="text-red-500">*</span>
                  </label>
                  <select value={experience} onChange={(e) => setExperience(e.target.value)} className="input-base">
                    <option value="fresher">Fresher</option>
                    <option value="experienced">Experienced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Years of Experience</label>
                  <input
                    {...register('yearsOfExperience')}
                    type="number"
                    min="0"
                    placeholder={experience === 'fresher' ? 'Visible only if Experienced' : 'e.g. 3'}
                    disabled={experience === 'fresher'}
                    className={`input-base ${experience === 'fresher' ? 'bg-slate-50 text-slate-400 cursor-default' : ''}`}
                  />
                </div>
              </div>

              {/* Row 3: Target Role | Main Skill */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Target Role <span className="text-red-500">*</span>
                  </label>
                  <input {...register('targetRole')} type="text" placeholder="Example: Software Developer" className="input-base" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Main Skill <span className="text-red-500">*</span>
                  </label>
                  <input {...register('mainSkill')} type="text" placeholder="Example: Java, Sales, Excel" className="input-base" />
                </div>
              </div>

              {/* Row 4: Country | State */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Country</label>
                  <input {...register('country')} type="text" placeholder="e.g. India" className="input-base" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">State</label>
                  <input {...register('state')} type="text" placeholder="e.g. Tamil Nadu" className="input-base" />
                </div>
              </div>

              {/* Row 5: WhatsApp Number */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">WhatsApp Number</label>
                <input {...register('whatsappNumber')} type="tel" placeholder="+91 98765 43210" className="input-base" />
              </div>

              {/* Row 6: College / Company */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  {experience === 'fresher' ? <><>College Name</> <span className="text-red-500">*</span></> : 'Current Company'}
                </label>
                {experience === 'fresher' ? (
                  <input {...register('college')} type="text" placeholder="Enter your college name or university" className="input-base" />
                ) : (
                  <input {...register('company')} type="text" placeholder="Enter your current company" className="input-base" />
                )}
              </div>

              {/* Row 7: Resume upload */}
              <div className="rounded-xl border border-dashed border-slate-200 p-5">
                <h4 className="font-semibold text-slate-700 text-sm mb-1">Upload your latest resume</h4>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  You can upload it now or update it anytime later. Adding your resume helps Project K create
                  better interview questions and stronger reports.
                </p>

                {/* Current resume chip */}
                {currentResume && (
                  <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-green-50 border border-green-100 rounded-lg">
                    <FileText size={14} className="text-green-600 flex-shrink-0" />
                    <span className="text-xs text-green-700 font-medium truncate flex-1">{currentResume.filename}</span>
                    <span className="text-[10px] text-green-500 bg-green-100 px-1.5 py-0.5 rounded font-semibold shrink-0">Current</span>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <label className="cursor-pointer">
                    <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeChange} disabled={resumeUploading} />
                    <span className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, width: 'auto', padding: '8px 18px', fontSize: 13 }}>
                      {resumeUploading ? <span className="w-3 h-3 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" /> : <Upload size={13} />}
                      {resumeUploading ? 'Uploading…' : currentResume ? 'Replace Resume' : 'Upload Resume'}
                    </span>
                  </label>
                  {!resumeUploading && !currentResume && (
                    <span className="text-xs text-slate-400">PDF or DOC format</span>
                  )}
                </div>
              </div>
            </div>

            {/* ── Submit ── */}
            <div className="flex justify-end mt-6">
              <button type="submit" disabled={loading || photoUploading || resumeUploading} className="btn-primary px-10">
                {loading ? <><span className="spinner" /> Saving…</> : 'Submit'}
              </button>
            </div>
          </div>
        </form>

        {/* ── Completion panel ── */}
        <CompletionPanel pct={pct} />
      </div>
    </div>
  );
}
