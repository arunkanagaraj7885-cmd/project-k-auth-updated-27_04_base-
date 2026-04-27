'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Check, Zap, Lock } from 'lucide-react';
import OrderSummary from '@/components/pricing/OrderSummary';
import { useAppDispatch } from '@/store/hooks';
import { updatePlan } from '@/store/slices/authSlice';

const PLANS = [
  {
    id: 'free',
    name: 'Try Yourself',
    price: '₹0',
    period: 'one time',
    description: 'Experience Project K for free before committing to a paid plan.',
    features: ['1 full interview included', 'Detailed report included', 'Completely free to try'],
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
    badge: 'Most Popular',
  },
];

export default function UpgradePage() {
  const router   = useRouter();
  const dispatch = useAppDispatch();

  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [loading, setLoading]           = useState(false);

  const handleProceed = async ({ plan }) => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      dispatch(updatePlan(plan));
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

      <div className="flex flex-col lg:flex-row gap-6 items-start">

        {/* ── Plan list ── */}
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
                {plan.badge && (
                  <span className="absolute -top-3 left-5 flex items-center gap-1 px-3 py-0.5 bg-blue-600 text-white text-xs font-bold rounded-full shadow">
                    <Zap size={10} /> {plan.badge}
                  </span>
                )}

                <div className="flex items-start gap-4">
                  <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                    selected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                  }`}>
                    {selected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>

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

                    <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-1.5 text-xs text-slate-600">
                          <Check size={13} className={`flex-shrink-0 mt-0.5 ${plan.id === 'premium' ? 'text-blue-500' : 'text-green-500'}`} />
                          {f}
                        </li>
                      ))}
                    </ul>

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

        {/* ── Order summary ── */}
        <div className="w-full lg:w-80 flex-shrink-0">
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
