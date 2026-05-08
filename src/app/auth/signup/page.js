'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { CheckCircle2, Loader2, ShieldCheck, RefreshCw } from 'lucide-react';
import Logo from '@/components/shared/Logo';
import PasswordInput from '@/components/auth/PasswordInput';
import { authApi } from '@/lib/api/auth';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';
import { saveTokens } from '@/lib/tokens';

const OTP_SECONDS = 60;

const COUNTRY_CODES = [
  { code: '+91',  flag: '🇮🇳', label: 'IN' },
  { code: '+1',   flag: '🇺🇸', label: 'US' },
  { code: '+44',  flag: '🇬🇧', label: 'GB' },
  { code: '+61',  flag: '🇦🇺', label: 'AU' },
  { code: '+971', flag: '🇦🇪', label: 'AE' },
  { code: '+65',  flag: '🇸🇬', label: 'SG' },
  { code: '+60',  flag: '🇲🇾', label: 'MY' },
  { code: '+49',  flag: '🇩🇪', label: 'DE' },
  { code: '+33',  flag: '🇫🇷', label: 'FR' },
  { code: '+81',  flag: '🇯🇵', label: 'JP' },
];

function setOnbCookie(val) {
  document.cookie = `pk_onb=${val}; path=/; max-age=86400; SameSite=Lax`;
}

function validatePhone(number) {
  // 7–12 digits after stripping spaces/dashes
  return /^\d{7,12}$/.test(number.replace(/[\s\-]/g, ''));
}

function validateForm({ firstName, lastName, countryCode, phoneNumber, password, confirmPassword }) {
  const errors = {};
  if (!firstName.trim())  errors.firstName = 'First name is required';
  if (!lastName.trim())   errors.lastName  = 'Last name is required';
  if (!phoneNumber.trim()) {
    errors.phoneNumber = 'Phone number is required';
  } else if (!validatePhone(phoneNumber)) {
    errors.phoneNumber = 'Enter a valid phone number (7–12 digits)';
  }
  if (password.length < 8)           errors.password = 'At least 8 characters required';
  else if (!/[A-Z]/.test(password))  errors.password = 'Must contain an uppercase letter';
  else if (!/[0-9]/.test(password))  errors.password = 'Must contain a number';
  if (password !== confirmPassword)  errors.confirmPassword = 'Passwords do not match';
  return errors;
}

export default function SignupPage() {
  const router   = useRouter();
  const dispatch = useAppDispatch();

  /* ── Form fields ── */
  const [firstName,       setFirstName]       = useState('');
  const [lastName,        setLastName]        = useState('');
  const [email,           setEmail]           = useState('');
  const [countryCode,     setCountryCode]     = useState('+91');
  const [phoneNumber,     setPhoneNumber]     = useState('');
  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  /* ── OTP state ── */
  const [otp,             setOtp]             = useState(['', '', '', '', '', '']);
  const [isOtpSent,       setIsOtpSent]       = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [otpLoading,      setOtpLoading]      = useState(false);
  const [verifyLoading,   setVerifyLoading]   = useState(false);
  const [resendTimer,     setResendTimer]      = useState(0);

  /* ── Register state ── */
  const [registerLoading, setRegisterLoading] = useState(false);
  const [formErrors,      setFormErrors]      = useState({});

  const otpRefs = useRef([]);

  /* ── Countdown ── */
  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

  /* ── Reset OTP when email changes ── */
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (isOtpSent || isEmailVerified) {
      setIsOtpSent(false);
      setIsEmailVerified(false);
      setOtp(['', '', '', '', '', '']);
      setResendTimer(0);
    }
  };

  /* ── Send OTP ── */
  const handleSendOtp = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormErrors((e) => ({ ...e, email: 'Enter a valid email address' }));
      return;
    }
    setFormErrors((e) => ({ ...e, email: undefined }));
    setOtpLoading(true);
    try {
      const res = await authApi.sendOtp(email);
      if (res.data.user_exists) {
        toast.error('An account with this email already exists. Please log in.');
        return;
      }
      setIsOtpSent(true);
      setOtp(['', '', '', '', '', '']);
      setResendTimer(OTP_SECONDS);
      toast.success('OTP sent to your email');
      setTimeout(() => otpRefs.current[0]?.focus(), 120);
    } catch (err) {
      const detail = err.response?.data?.detail;
      toast.error(typeof detail === 'string' ? detail : 'Failed to send OTP. Try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  /* ── OTP input handlers ── */
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const next = [...otp];
    digits.split('').forEach((ch, i) => { next[i] = ch; });
    setOtp(next);
    otpRefs.current[Math.min(digits.length, 5)]?.focus();
  };

  /* ── Verify OTP ── */
  const handleVerifyOtp = async () => {
    const code = otp.join('');
    if (code.length !== 6) { toast.error('Enter the complete 6-digit OTP'); return; }
    setVerifyLoading(true);
    try {
      const res = await authApi.verifyOtp(email, code, 'register');
      if (res.data.is_email_verified === 'valid') {
        setIsEmailVerified(true);
      } else {
        toast.error('Verification failed. Try again.');
      }
    } catch (err) {
      const detail = err.response?.data?.detail;
      toast.error(typeof detail === 'string' ? detail : 'Invalid OTP. Please try again.');
    } finally {
      setVerifyLoading(false);
    }
  };

  /* ── Register ── */
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isEmailVerified) { toast.error('Please verify your email first'); return; }
    const errors = validateForm({ firstName, lastName, countryCode, phoneNumber, password, confirmPassword });
    if (Object.keys(errors).length) { setFormErrors(errors); return; }
    setFormErrors({});
    setRegisterLoading(true);
    try {
      const fullPhone = `${countryCode}${phoneNumber.replace(/[\s\-]/g, '')}`;
      const res = await authApi.register({ firstName, lastName, email, password, confirmPassword, phoneNumber: fullPhone });
      const payload = res.data;

      if (payload.access_token) saveTokens(payload.access_token, payload.refresh_token);

      const userPlan = payload.user?.plan || 'free';
      const userObj  = {
        id:         payload.user?.id || payload.user_id || null,
        name:       `${firstName} ${lastName}`,
        email,
        first_name: firstName,
        last_name:  lastName,
        avatar_url: payload.user?.avatar_url || null,
        plan:       userPlan,
      };
      sessionStorage.setItem('demo_user', JSON.stringify(userObj));
      sessionStorage.setItem('demo_plan', userPlan);
      dispatch(setCredentials({ user: userObj, plan: userPlan, onboarding_complete: false, plan_selected: false }));
      setOnbCookie('plan');
      toast.success('Account created! Now choose your plan.');
      router.push('/pricing?onboarding=1');
    } catch (err) {
      const detail = err.response?.data?.detail;
      const msg = Array.isArray(detail) ? detail.map((d) => d.msg).join(', ') : detail || 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setRegisterLoading(false);
    }
  };

  const otpCode   = otp.join('');
  const canSubmit = isEmailVerified && !registerLoading;
  const canResend = isOtpSent && !isEmailVerified && resendTimer === 0 && !otpLoading;

  return (
    <div className="auth-bg min-h-screen flex items-center justify-center px-4 py-10">
      <div className="card w-full max-w-md p-8 animate-fade-in">

        {/* Logo */}
        <div className="flex justify-center mb-5">
          <Logo size="md" />
        </div>

        <h2 className="text-center text-xl font-bold text-slate-800 mb-1">Create your account</h2>
        <p className="text-center text-sm text-slate-500 mb-7">
          Register for <span className="font-semibold text-slate-700">Project K Interview Module</span>
        </p>

        <form onSubmit={handleRegister} className="flex flex-col gap-4" noValidate>

          {/* ── Name row ── */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} type="text"
                placeholder="First name" autoComplete="given-name"
                className={`input-base ${formErrors.firstName ? 'error' : ''}`} />
              {formErrors.firstName && <p className="mt-1 text-xs text-red-500">{formErrors.firstName}</p>}
            </div>
            <div>
              <input value={lastName} onChange={(e) => setLastName(e.target.value)} type="text"
                placeholder="Last name / Initial" autoComplete="family-name"
                className={`input-base ${formErrors.lastName ? 'error' : ''}`} />
              {formErrors.lastName && <p className="mt-1 text-xs text-red-500">{formErrors.lastName}</p>}
            </div>
          </div>

          {/* ── Email + Verify button ── */}
          <div>
            <div className="flex gap-2 items-start">
              <div className="relative flex-1">
                <input value={email} onChange={handleEmailChange} type="email"
                  placeholder="Email address" autoComplete="email" disabled={isEmailVerified}
                  className={`input-base w-full ${isEmailVerified ? 'pr-8 bg-green-50 border-green-400 text-slate-600' : ''} ${formErrors.email ? 'error' : ''}`} />
                {isEmailVerified && (
                  <CheckCircle2 size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
                )}
              </div>
              <button type="button" onClick={handleSendOtp}
                disabled={!email || isEmailVerified || otpLoading || (isOtpSent && resendTimer > 0)}
                className={`flex-shrink-0 h-[42px] px-4 rounded-lg text-sm font-semibold active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 whitespace-nowrap
                  ${isEmailVerified ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                {otpLoading ? (
                  <><Loader2 size={13} className="animate-spin" /> Sending…</>
                ) : isEmailVerified ? (
                  <><CheckCircle2 size={13} /> Verified</>
                ) : canResend ? (
                  <><RefreshCw size={13} /> Resend</>
                ) : isOtpSent && resendTimer > 0 ? (
                  `Resend (${resendTimer}s)`
                ) : (
                  'Verify Email'
                )}
              </button>
            </div>
            {formErrors.email && <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>}
          </div>

          {/* ── OTP — compact inline ── */}
          {isOtpSent && !isEmailVerified && (
            <div className="animate-fade-in space-y-2">
              <p className="text-xs text-slate-500">
                OTP sent to <span className="font-semibold text-slate-700">{email}</span>
              </p>
              <div className="flex items-center gap-2" onPaste={handleOtpPaste}>
                {/* 6 compact boxes */}
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (otpRefs.current[i] = el)}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className={`w-9 h-9 text-center text-sm font-bold rounded-lg border-2 transition-all focus:outline-none bg-white
                      ${digit ? 'border-blue-500 text-blue-700' : 'border-slate-200 text-slate-700'}
                      focus:border-blue-500 focus:ring-1 focus:ring-blue-100`}
                  />
                ))}
                {/* Inline verify button */}
                <button type="button" onClick={handleVerifyOtp}
                  disabled={otpCode.length !== 6 || verifyLoading}
                  className="flex-1 h-9 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 transition-all">
                  {verifyLoading
                    ? <Loader2 size={12} className="animate-spin" />
                    : <><ShieldCheck size={12} /> Verify</>}
                </button>
              </div>
            </div>
          )}

          {/* ── Phone number with country code ── */}
          <div>
            <div className="flex gap-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="input-base flex-shrink-0 cursor-pointer"
                style={{ width: 90, paddingLeft: 8, paddingRight: 4 }}
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code + c.label} value={c.code}>
                    {c.flag} {c.code}
                  </option>
                ))}
              </select>
              <input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/[^\d\s\-]/g, ''))}
                type="tel"
                placeholder="Phone number"
                autoComplete="tel"
                className={`input-base flex-1 ${formErrors.phoneNumber ? 'error' : ''}`}
              />
            </div>
            {formErrors.phoneNumber && <p className="mt-1 text-xs text-red-500">{formErrors.phoneNumber}</p>}
          </div>

          {/* ── Password row ── */}
          <div className="grid grid-cols-2 gap-3">
            <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Password" autoComplete="new-password" error={formErrors.password} />
            <PasswordInput value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password" autoComplete="new-password" error={formErrors.confirmPassword} />
          </div>

          {/* ── Submit ── */}
          <button type="submit" disabled={!canSubmit}
            className="btn-primary mt-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            {registerLoading
              ? <><Loader2 size={16} className="animate-spin" /> Creating Account…</>
              : 'Create Account →'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-blue-600 font-medium hover:underline">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
