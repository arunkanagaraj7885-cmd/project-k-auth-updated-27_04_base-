'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { Check, Zap, Lock } from 'lucide-react';
import Logo from '@/components/shared/Logo';
import OrderSummary from '@/components/pricing/OrderSummary';
import { useAppDispatch } from '@/store/hooks';
import { updatePlan, setPlanSelected } from '@/store/slices/authSlice';

function setOnbCookie(val) {
  document.cookie = `pk_onb=${val}; path=/; max-age=86400; SameSite=Lax`;
}

const PLANS = [
  {
    id: 'free',
    name: 'Try Yourself',
    price: '₹0',
    period: 'one time',
    description: 'Experience Project K for free before committing to a paid plan.',
    features: ['1 full interview included', 'Detailed report included', 'Completely free to try'],
    cta: 'Try for Free',
    badge: null,
  },
  {
    id: 'standard',
    name: 'Standard',
    price: '₹499',
    period: '/ month',
    description: 'Guided mock practice at a student-friendly price.',
    features: [
      '10 mock interviews with AI avatar',
      'Each mock under 5 min or 4–5 questions',
      '4 full interviews up to 15 minutes',
      'Basic report after each session',
      'Email support',
    ],
    locked: 'Detailed reports & job assistance locked — upgrade to Premium.',
    cta: 'Choose Standard',
    badge: null,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '₹899',
    period: '/ month',
    description: 'Best value for serious preparation with deeper analysis and job support.',
    features: [
      '20 mock interviews with AI avatar',
      'Each mock under 5 min or 4–5 questions',
      '8 full interviews up to 15 minutes',
      'Detailed report with stronger insights',
      'Job assistance included',
      'Email and WhatsApp support',
    ],
    cta: 'Get Hired Faster',
    badge: 'Most Popular',
  },
];

export default function PricingPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const dispatch     = useAppDispatch();

  const isOnboarding = searchParams.get('onboarding') === '1';
  const postPlanRoute = isOnboarding ? '/main/profile-setup' : '/main/dashboard';

  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [loading, setLoading]           = useState(false);

  const handleProceed = async ({ plan }) => {
    setLoading(true);
    try {
      // DEMO: bypass real payment — activate any plan instantly
      await new Promise((r) => setTimeout(r, 600));
      dispatch(updatePlan(plan));
      dispatch(setPlanSelected(true));
      if (isOnboarding) setOnbCookie('profile');
      const label = plan === 'free' ? 'Free plan' : plan.charAt(0).toUpperCase() + plan.slice(1) + ' plan';
      toast.success(isOnboarding ? `${label} selected! Now set up your profile.` : 'Plan activated!');
      setTimeout(() => { window.location.href = postPlanRoute; }, 800);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
        <Logo size="sm" />
        {isOnboarding && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            {[
              { step: 1, label: 'Account', done: true },
              { step: 2, label: 'Choose Plan', done: false, active: true },
              { step: 3, label: 'Profile', done: false },
            ].map(({ step, label, done, active }, i, arr) => (
              <span key={step} className="flex items-center gap-2">
                <span className="flex items-center gap-1.5">
                  <span className={`w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center ${done ? 'bg-green-500' : active ? 'bg-blue-600' : 'bg-slate-200 text-slate-500'}`}>
                    {done ? '✓' : step}
                  </span>
                  <span className={active ? 'font-semibold text-slate-700' : done ? 'text-slate-400' : 'text-slate-400'}>{label}</span>
                </span>
                {i < arr.length - 1 && <span className="text-slate-300">›</span>}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            {isOnboarding ? 'Step 2 — Choose your plan' : 'Choose a plan that fits your interview journey'}
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-lg">
            {isOnboarding
              ? 'Pick a plan to unlock AI-powered mock interviews. You can always upgrade later.'
              : 'Affordable monthly plans built for students and freshers.'}
          </p>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* ── Plan list (left) ── */}
          <div className="flex-1 space-y-3">
            {PLANS.map((plan) => {
              const selected = selectedPlan === plan.id;
              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative rounded-2xl border-2 p-5 cursor-pointer transition-all bg-white ${
                    selected
                      ? 'border-blue-500 shadow-md shadow-blue-100'
                      : 'border-slate-200 hover:border-blue-200'
                  }`}
                >
                  {/* Most Popular badge */}
                  {plan.badge && (
                    <span className="absolute -top-3 left-5 flex items-center gap-1 px-3 py-0.5 bg-blue-600 text-white text-xs font-bold rounded-full shadow">
                      <Zap size={10} /> {plan.badge}
                    </span>
                  )}

                  <div className="flex items-start gap-4">
                    {/* Radio indicator */}
                    <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                      selected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                    }`}>
                      {selected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>

                    {/* Plan details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div>
                          <h3 className="font-bold text-slate-800 text-base">{plan.name}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">{plan.description}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="text-2xl font-bold text-slate-900">{plan.price}</span>
                          <span className="text-xs text-slate-500 ml-1">{plan.period}</span>
                        </div>
                      </div>

                      {/* Features */}
                      <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-start gap-1.5 text-xs text-slate-600">
                            <Check size={13} className={`flex-shrink-0 mt-0.5 ${plan.id === 'premium' ? 'text-blue-500' : 'text-green-500'}`} />
                            {f}
                          </li>
                        ))}
                      </ul>

                      {/* Locked preview (Standard only) */}
                      {plan.locked && (
                        <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 relative overflow-hidden">
                          <p className="text-xs text-slate-400 blur-sm select-none">{plan.locked}</p>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-full border border-slate-200 shadow-sm text-xs font-medium text-slate-600">
                              <Lock size={11} /> Premium report preview locked
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Order summary (right, sticky) ── */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <OrderSummary
              selectedPlan={selectedPlan}
              onProceed={handleProceed}
              loading={loading}
              ctaLabel={isOnboarding ? 'Continue →' : undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
