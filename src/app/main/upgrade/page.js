'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Check, Zap } from 'lucide-react';
import OrderSummary from '@/components/pricing/OrderSummary';
import { useAppDispatch } from '@/store/hooks';
import { updatePlan } from '@/store/slices/authSlice';

const PLANS = [
  {
    id: 'standard',
    name: 'Standard',
    price: '₹499',
    period: '/ month',
    description: 'Perfect to get started with guided mock practice at a student-friendly price.',
    features: [
      '10 mock interviews with AI avatar',
      'Each mock under 5 minutes or 4 to 5 questions',
      '4 full interviews up to 15 minutes',
      'Basic report after each session',
      'Email support',
    ],
    badge: null,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '₹899',
    period: '/ month',
    description: 'Best value for serious preparation with more attempts, deeper analysis, and job support.',
    features: [
      '20 mock interviews with AI avatar',
      'Each mock under 5 minutes or 4 to 5 questions',
      '8 full interviews up to 15 minutes',
      'Detailed report with stronger insights',
      'Job assistance included',
      'Email and WhatsApp support',
    ],
    badge: 'Most Popular',
  },
];

export default function UpgradePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [loading, setLoading] = useState(false);

  const handleProceed = async ({ plan }) => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      dispatch(updatePlan(plan));

      // Persist plan — update both keys so layout rehydrate always reads the latest
      sessionStorage.setItem('demo_plan', plan);
      const savedRaw = sessionStorage.getItem('demo_user');
      if (savedRaw) {
        try {
          const savedUser = JSON.parse(savedRaw);
          sessionStorage.setItem('demo_user', JSON.stringify({ ...savedUser, plan }));
        } catch { /* ignore */ }
      }

      toast.success('Plan updated successfully!');
      router.push('/main/dashboard');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Upgrade your plan</h1>
        <p className="text-slate-500 text-sm">Affordable monthly plans built for students and freshers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

        {/* ── Plan list ── */}
        <div className="space-y-4">
          {PLANS.map((plan) => {
            const selected = selectedPlan === plan.id;
            const isPremium = plan.id === 'premium';
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative rounded-2xl border-2 p-6 cursor-pointer transition-all bg-white ${
                  selected
                    ? isPremium
                      ? 'border-blue-500 shadow-lg shadow-blue-100'
                      : 'border-blue-400 shadow-md shadow-blue-50'
                    : 'border-slate-200 hover:border-blue-200 hover:shadow-sm'
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3.5 left-6 flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full shadow-md">
                    <Zap size={10} /> {plan.badge}
                  </span>
                )}

                <div className="flex items-start gap-4">
                  <div className={`mt-1 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                    selected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                  }`}>
                    {selected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <h3 className="font-bold text-slate-800 text-lg leading-tight">{plan.name}</h3>
                        <p className="text-xs text-slate-500 mt-1 max-w-sm">{plan.description}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-3xl font-bold text-slate-900">{plan.price}</span>
                        <span className="text-xs text-slate-500 ml-1">{plan.period}</span>
                      </div>
                    </div>

                    <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                          <Check size={13} className={`flex-shrink-0 mt-0.5 ${isPremium ? 'text-blue-500' : 'text-green-500'}`} />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Order summary ── */}
        <div className="flex flex-col h-full">
          <OrderSummary
            selectedPlan={selectedPlan}
            onProceed={handleProceed}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
