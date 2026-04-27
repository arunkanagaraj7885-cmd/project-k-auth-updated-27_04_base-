'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import Logo from '@/components/shared/Logo';
import TryYourselfCard from '@/components/pricing/TryYourselfCard';
import StandardCard from '@/components/pricing/StandardCard';
import PremiumCard from '@/components/pricing/PremiumCard';
import OrderSummary from '@/components/pricing/OrderSummary';
import { paymentsApi } from '@/lib/api/payments';
import { useAppDispatch } from '@/store/hooks';
import { updatePlan, setPlanSelected } from '@/store/slices/authSlice';

// Cookie helper
function setOnbCookie(val) {
  document.cookie = `pk_onb=${val}; path=/; max-age=86400; SameSite=Lax`;
}

export default function PricingPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const dispatch     = useAppDispatch();

  // ?onboarding=1 means this is part of the new-user signup flow
  const isOnboarding = searchParams.get('onboarding') === '1';

  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [loading, setLoading]           = useState(false);

  // After plan selection, new users go to profile setup; upgraders go to dashboard
  const postPlanRoute = isOnboarding ? '/main/profile-setup' : '/main/dashboard';

  const handleProceed = async ({ plan, coupon }) => {
    setLoading(true);
    try {
      if (plan === 'free') {
        dispatch(updatePlan('free'));
        dispatch(setPlanSelected(true));
        if (isOnboarding) setOnbCookie('profile');
        toast.success(
          isOnboarding
            ? 'Free plan selected! Now set up your profile.'
            : 'Welcome to Project K! Your free interview is ready.'
        );
        router.push(postPlanRoute);
        return;
      }

      // Create Razorpay order
      const orderRes = await paymentsApi.createOrder(plan, coupon);
      const { order_id, amount, currency, key_id } = orderRes.data;

      if (typeof window !== 'undefined') {
        const rzp = new window.Razorpay({
          key: key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount,
          currency: currency || 'INR',
          name: 'Project K',
          description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
          order_id,
          handler: async (response) => {
            try {
              await paymentsApi.verifyPayment({
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
              });
              await paymentsApi.activateSubscription({ order_id, plan });
              dispatch(updatePlan(plan));
              dispatch(setPlanSelected(true));
              if (isOnboarding) setOnbCookie('profile');
              toast.success(
                isOnboarding
                  ? 'Payment successful! Now let\'s set up your profile.'
                  : 'Payment successful! Your plan is now active.'
              );
              router.push(postPlanRoute);
            } catch {
              toast.error('Payment verification failed. Please contact support.');
            }
          },
          prefill: {},
          theme: { color: '#2563eb' },
        });
        rzp.open();
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Something went wrong. Please try again.');
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
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">1</span>
              Account
            </span>
            <span className="text-slate-300">›</span>
            <span className="flex items-center gap-1.5 font-semibold text-slate-700">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">2</span>
              Choose Plan
            </span>
            <span className="text-slate-300">›</span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 text-xs font-bold flex items-center justify-center">3</span>
              Profile
            </span>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Hero */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {isOnboarding
              ? 'Step 2 — Choose your plan'
              : 'Choose a plan that fits your interview journey'}
          </h1>
          <p className="text-slate-500 max-w-xl leading-relaxed">
            {isOnboarding
              ? 'Pick a plan to unlock AI-powered mock interviews. You can always upgrade later.'
              : 'Affordable monthly plans built for students and freshers. Practice with AI-powered mock interviews, get instant reports, and upgrade when you need deeper feedback.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Plan cards */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
            <TryYourselfCard
              isSelected={selectedPlan === 'free'}
              onSelect={() => setSelectedPlan('free')}
            />
            <StandardCard
              isSelected={selectedPlan === 'standard'}
              onSelect={() => setSelectedPlan('standard')}
            />
            <div className="relative mt-3">
              <PremiumCard
                isSelected={selectedPlan === 'premium'}
                onSelect={() => setSelectedPlan('premium')}
              />
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
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
