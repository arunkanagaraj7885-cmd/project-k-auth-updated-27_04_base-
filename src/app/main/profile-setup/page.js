'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  User, Briefcase, BookOpen, Upload, CheckCircle2, X,
  AlertTriangle, Lock,
} from 'lucide-react';
import { userApi } from '@/lib/api/user';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectUser, selectOnboardingComplete, setOnboardingComplete, setUser } from '@/store/slices/authSlice';

// Cookie helper
function clearOnbCookie() {
  document.cookie = 'pk_onb=done; path=/; max-age=86400; SameSite=Lax';
}

/* ── Completion side panel ──────────────────────────────────────────────── */
function CompletionPanel({ completedCount, totalCount }) {
  const pct = Math.round((completedCount / totalCount) * 100);
  return (
    <div className="card p-5 sticky top-24">
      <h3 className="font-semibold text-slate-800 mb-1 text-sm">Profile Completion</h3>
      <p className="text-xs text-slate-500 mb-3">
        {pct}% complete — {totalCount - completedCount} {totalCount - completedCount === 1 ? 'field' : 'fields'} left
      </p>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-slate-400 mt-3 leading-relaxed">
        A complete profile helps the AI generate more relevant interview questions.
      </p>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────────────── */
export default function ProfileSetupPage() {
  const router             = useRouter();
  const dispatch           = useAppDispatch();
  const user               = useAppSelector(selectUser);
  const onboardingComplete = useAppSelector(selectOnboardingComplete);

  // name + photo are permanently locked once profile has been saved
  const isLocked = onboardingComplete;

  // Restore saved name / avatar from sessionStorage (survives hard reload)
  const [savedUser,   setSavedUser]   = useState(null);
  const [savedAvatar, setSavedAvatar] = useState(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('demo_user');
    if (raw) setSavedUser(JSON.parse(raw));
    const av = sessionStorage.getItem('demo_avatar');
    if (av) setSavedAvatar(av);
  }, []);

  const lockedFirstName = savedUser?.first_name || user?.first_name || '';
  const lockedLastName  = savedUser?.last_name  || user?.last_name  || '';
  const lockedAvatar    = savedAvatar || null;

  const [loading, setLoading]           = useState(false);
  const [skills, setSkills]             = useState([]);
  const [skillInput, setSkillInput]     = useState('');
  const [experience, setExperience]     = useState('fresher');
  const [avatarFile, setAvatarFile]       = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [resumeFile, setResumeFile]       = useState(null);
  const [nameConfirmed, setNameConfirmed]   = useState(false);
  const [photoConfirmed, setPhotoConfirmed] = useState(false);

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      firstName:  user?.first_name || '',
      lastName:   user?.last_name  || '',
      targetRole: '',
      college:    '',
      company:    '',
    },
  });

  const firstName  = watch('firstName');
  const lastName   = watch('lastName');
  const targetRole = watch('targetRole');
  const college    = watch('college');

  const checks = [
    !!(firstName?.trim()) && !!(lastName?.trim()),
    !!targetRole,
    skills.length > 0 || skillInput.trim().length > 0,
    experience === 'fresher' ? !!college : !!watch('company'),
    !!avatarFile,
  ];
  const completedCount = checks.filter(Boolean).length;

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) setSkills((prev) => [...prev, s]);
    setSkillInput('');
  };

  const onSubmit = async (data) => {
    if (!isLocked) {
      if (!data.firstName?.trim() || !data.lastName?.trim()) { toast.error('Enter your first and last name.'); return; }
      if (!nameConfirmed) { toast.error('Please confirm your name is correct before continuing.'); return; }
      if (!avatarFile)    { toast.error('Please upload a profile photo. It cannot be added later.'); return; }
      if (!photoConfirmed) { toast.error('Please confirm your photo is correct before continuing.'); return; }
    }
    if (!skills.length && !skillInput.trim()) { toast.error('Add at least one skill.'); return; }
    // Auto-add any skill still typed in the input
    const finalSkills = skillInput.trim() && !skills.includes(skillInput.trim())
      ? [...skills, skillInput.trim()]
      : skills;
    if (!finalSkills.length) { toast.error('Add at least one skill.'); return; }

    setLoading(true);
    try {
      // DEMO: bypass real API calls — validations above still fully enforced
      await new Promise((r) => setTimeout(r, 800));
      const firstName = isLocked ? lockedFirstName : data.firstName.trim();
      const lastName  = isLocked ? lockedLastName  : data.lastName.trim();
      const fullName  = `${firstName} ${lastName}`;
      dispatch(setUser({ first_name: firstName, last_name: lastName, name: fullName }));
      dispatch(setOnboardingComplete(true));
      clearOnbCookie(); // sets pk_onb=done — unlocks full dashboard access
      // Persist name + avatar across the hard reload caused by window.location.href
      sessionStorage.setItem('demo_user', JSON.stringify({ first_name: firstName, last_name: lastName, name: fullName }));
      if (avatarPreview) sessionStorage.setItem('demo_avatar', avatarPreview);
      toast.success('Profile saved! Taking you to your dashboard…');
      // Full navigation so the middleware sees the updated pk_onb=done cookie
      setTimeout(() => { window.location.href = '/main/dashboard'; }, 800);
    } catch {
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Derive display name
  const displayName = user?.name || [user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'Your Name';

  return (
    <div className="animate-fade-in">
      {/* ── Step indicator ── */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <span className="flex items-center gap-1.5 text-slate-400">
          <span className="w-5 h-5 rounded-full bg-green-500 text-white text-xs font-bold flex items-center justify-center">✓</span>
          Account
        </span>
        <span className="text-slate-300">›</span>
        <span className="flex items-center gap-1.5 text-slate-400">
          <span className="w-5 h-5 rounded-full bg-green-500 text-white text-xs font-bold flex items-center justify-center">✓</span>
          Plan
        </span>
        <span className="text-slate-300">›</span>
        <span className="flex items-center gap-1.5 font-semibold text-slate-800">
          <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">3</span>
          Create Profile
        </span>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-800">Step 3 — Set up your profile</h2>
        <p className="text-sm text-slate-500 mt-1">
          Help the AI personalise your interview experience.
        </p>
      </div>

      {/* ── ⚠️ Permanent-info warning banner ── */}
      <div className="mb-6 rounded-xl border-2 border-amber-300 bg-amber-50 p-4 flex gap-3">
        <AlertTriangle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-800">
            Your name and profile photo are permanent
          </p>
          <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
            Once you save your profile, <strong>your first name, last name, and profile photo cannot be changed</strong>.
            Please make sure they are correct before continuing. These details appear on your interview reports.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Form ── */}
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 space-y-5">

          {/* ── Full Name ── */}
          <div className="card p-5">
            <h3 className="font-semibold text-slate-700 text-sm mb-1 flex items-center gap-2">
              <Lock size={14} className="text-slate-400" />
              Your Full Name
              {isLocked ? (
                <span className="ml-auto text-xs font-normal text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Lock size={10} /> Locked
                </span>
              ) : (
                <span className="ml-auto text-xs font-normal text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                  Cannot be changed later
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              {isLocked
                ? 'Your name is permanently set and cannot be edited.'
                : 'Enter your real name exactly as you want it to appear on your reports.'}
            </p>

            {isLocked ? (
              /* Locked display */
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1.5">First Name</p>
                  <div className="input-base bg-slate-50 text-slate-700 flex items-center gap-2 cursor-not-allowed select-none">
                    <Lock size={12} className="text-slate-400 flex-shrink-0" />
                    {lockedFirstName}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1.5">Last Name</p>
                  <div className="input-base bg-slate-50 text-slate-700 flex items-center gap-2 cursor-not-allowed select-none">
                    <Lock size={12} className="text-slate-400 flex-shrink-0" />
                    {lockedLastName}
                  </div>
                </div>
              </div>
            ) : (
              /* Editable inputs */
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('firstName', { required: true })}
                      type="text"
                      placeholder="e.g. Arjun"
                      className="input-base"
                      autoComplete="given-name"
                      onChange={() => setNameConfirmed(false)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('lastName', { required: true })}
                      type="text"
                      placeholder="e.g. Kumar"
                      className="input-base"
                      autoComplete="family-name"
                      onChange={() => setNameConfirmed(false)}
                    />
                  </div>
                </div>

                {/* Name confirm checkbox — shown only when both fields are filled */}
                {firstName?.trim() && lastName?.trim() && (
                  <label className={`flex items-start gap-2.5 mt-4 cursor-pointer p-3 rounded-lg border transition-colors ${
                    nameConfirmed ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'
                  }`}>
                    <input
                      type="checkbox"
                      checked={nameConfirmed}
                      onChange={(e) => setNameConfirmed(e.target.checked)}
                      className="mt-0.5 accent-blue-600 flex-shrink-0"
                    />
                    <span className="text-xs text-slate-700 leading-relaxed">
                      I confirm that <strong>{firstName.trim()} {lastName.trim()}</strong> is my correct full name
                      and I understand it <strong>cannot be changed</strong> after saving.
                    </span>
                  </label>
                )}
              </>
            )}
          </div>

          {/* ── Profile Photo ── */}
          <div className="card p-5">
            <h3 className="font-semibold text-slate-700 text-sm mb-1 flex items-center gap-2">
              <User size={15} />
              Profile Photo
              {isLocked ? (
                <span className="ml-auto text-xs font-normal text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Lock size={10} /> Locked
                </span>
              ) : (
                <span className="ml-auto text-xs font-normal text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                  Cannot be changed later
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {isLocked
                ? 'Your profile photo is permanently set and cannot be changed.'
                : 'Use a clear, real photo. This will appear on all your reports.'}
            </p>
            <div className="flex items-center gap-5">
              {/* Avatar circle */}
              <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-200 flex items-center justify-center flex-shrink-0 relative">
                {(isLocked ? lockedAvatar : avatarPreview) ? (
                  <img src={isLocked ? lockedAvatar : avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : isLocked ? (
                  /* Locked but no saved preview — show initials */
                  <span className="text-xl font-bold text-slate-400">
                    {(lockedFirstName[0] || '') + (lockedLastName[0] || '')}
                  </span>
                ) : (
                  <User size={28} className="text-slate-300" />
                )}
              </div>

              {isLocked ? (
                /* Locked state — no upload button */
                <div className="flex items-center gap-2 text-slate-500">
                  <Lock size={14} className="text-slate-400" />
                  <span className="text-sm">Photo is locked and cannot be changed.</span>
                </div>
              ) : (
                /* Editable upload */
                <div className="space-y-2">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files[0];
                        if (f) {
                          setAvatarFile(f);
                          const reader = new FileReader();
                          reader.onload = (ev) => setAvatarPreview(ev.target.result);
                          reader.readAsDataURL(f);
                          setPhotoConfirmed(false);
                        }
                      }}
                    />
                    <span
                      className="btn-secondary"
                      style={{ display: 'inline-flex', width: 'auto', padding: '8px 16px', fontSize: 13 }}
                    >
                      <Upload size={14} className="mr-1.5" />
                      {avatarFile ? 'Change Photo' : 'Upload Photo'}
                    </span>
                  </label>
                  {avatarFile && (
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <CheckCircle2 size={12} /> Photo selected
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Photo confirm checkbox — only shown when not locked */}
            {!isLocked && avatarFile && (
              <label className={`flex items-start gap-2.5 mt-4 cursor-pointer p-3 rounded-lg border transition-colors ${
                photoConfirmed ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'
              }`}>
                <input
                  type="checkbox"
                  checked={photoConfirmed}
                  onChange={(e) => setPhotoConfirmed(e.target.checked)}
                  className="mt-0.5 accent-blue-600 flex-shrink-0"
                />
                <span className="text-xs text-slate-700 leading-relaxed">
                  I confirm the uploaded photo is a clear, real photo of me and I understand it
                  <strong> cannot be changed</strong> after saving.
                </span>
              </label>
            )}
          </div>

          {/* ── Experience Level ── */}
          <div className="card p-5">
            <h3 className="font-semibold text-slate-700 text-sm mb-4 flex items-center gap-2">
              <Briefcase size={15} /> Experience Level
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {['fresher', 'experienced'].map((exp) => (
                <button
                  key={exp}
                  type="button"
                  onClick={() => setExperience(exp)}
                  className={`py-3 rounded-xl border-2 text-sm font-medium capitalize transition-all ${
                    experience === exp
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-600 hover:border-blue-200'
                  }`}
                >
                  {exp === 'fresher' ? '🎓 Fresher' : '💼 Experienced'}
                </button>
              ))}
            </div>
          </div>

          {/* ── Background ── */}
          <div className="card p-5 space-y-4">
            <h3 className="font-semibold text-slate-700 text-sm flex items-center gap-2">
              <BookOpen size={15} /> Background
            </h3>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Target Role <span className="text-red-500">*</span>
              </label>
              <input
                {...register('targetRole', { required: true })}
                placeholder="e.g. Software Engineer"
                className="input-base"
              />
            </div>
            {experience === 'fresher' ? (
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  College / University <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('college')}
                  placeholder="e.g. IIT Madras, VIT Vellore"
                  className="input-base"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Current Company
                </label>
                <input
                  {...register('company')}
                  placeholder="e.g. Infosys, TCS"
                  className="input-base"
                />
              </div>
            )}
          </div>

          {/* ── Skills ── */}
          <div className="card p-5">
            <h3 className="font-semibold text-slate-700 text-sm mb-4">
              Key Skills <span className="text-red-500">*</span>
            </h3>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                placeholder="Add a skill (e.g. Python, React)"
                className="input-base flex-1"
              />
              <button
                type="button"
                onClick={addSkill}
                className="btn-secondary"
                style={{ width: 'auto', padding: '10px 16px', fontSize: 13 }}
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span
                  key={s}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-xs font-medium"
                >
                  {s}
                  <button type="button" onClick={() => setSkills((prev) => prev.filter((x) => x !== s))}>
                    <X size={12} />
                  </button>
                </span>
              ))}
              {skills.length === 0 && <p className="text-xs text-slate-400">No skills added yet.</p>}
            </div>
          </div>

          {/* ── Resume ── */}
          <div className="card p-5">
            <h3 className="font-semibold text-slate-700 text-sm mb-4 flex items-center gap-2">
              <Upload size={15} /> Resume
              <span className="ml-auto text-xs font-normal text-slate-400">(optional but recommended)</span>
            </h3>
            <label className="cursor-pointer block border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-blue-300 transition-colors">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => setResumeFile(e.target.files[0])}
              />
              {resumeFile ? (
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle2 size={18} />
                  <span className="text-sm font-medium">{resumeFile.name}</span>
                </div>
              ) : (
                <div className="text-slate-400">
                  <Upload size={24} className="mx-auto mb-2" />
                  <p className="text-sm">Click to upload resume (PDF, DOC)</p>
                  <p className="text-xs mt-1">Max 10 MB</p>
                </div>
              )}
            </label>
          </div>

          <button type="submit" disabled={loading || (!isLocked && (!nameConfirmed || !photoConfirmed))} className="btn-primary py-3.5 text-base">
            {loading ? <><span className="spinner" /> Saving…</> : 'Save & Go to Dashboard →'}
          </button>
        </form>

        {/* ── Completion sidebar ── */}
        <div>
          <CompletionPanel completedCount={completedCount} totalCount={checks.length} />
        </div>
      </div>
    </div>
  );
}
