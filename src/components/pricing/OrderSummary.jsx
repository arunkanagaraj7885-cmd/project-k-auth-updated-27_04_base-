'use client';
import { useState } from 'react';
import { Tag, Shield } from 'lucide-react';
import { paymentsApi } from '@/lib/api/payments';
import toast from 'react-hot-toast';

const PLAN_INFO = {
  free:     { label: 'Try Yourself',  price: 0,   description: 'One-time free access' },
  standard: { label: 'Standard Plan', price: 499, description: 'Monthly subscription for students' },
  premium:  { label: 'Premium Plan',  price: 899, description: 'Monthly subscription for students' },
};

export default function OrderSummary({ selectedPlan, onProceed, loading }) {
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);

  const info = PLAN_INFO[selectedPlan] || PLAN_INFO.free;
  const total = Math.max(0, info.price - discount);

  const handleApplyCoupon = async () => {
    if (!coupon.trim()) return;
    setValidatingCoupon(true);
    try {
      const res = await paymentsApi.validateCoupon(coupon, selectedPlan);
      const disc = res.data?.discount || 0;
      setDiscount(disc);
      setCouponApplied(true);
      toast.success(`Coupon applied! ₹${disc} off`);
    } catch {
      toast.error('Invalid or expired coupon code.');
      setDiscount(0);
      setCouponApplied(false);
    } finally {
      setValidatingCoupon(false);
    }
  };

  return (
    <div className="card p-6 sticky top-24">
      <h3 className="font-semibold text-slate-800 mb-4">Order summary</h3>

      {/* Selected plan */}
      <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 mb-5">
        <p className="text-xs text-slate-500 mb-0.5">Selected plan</p>
        <p className="font-semibold text-slate-800">{info.label}</p>
        <p className="text-xs text-slate-500 mt-0.5">{info.description}</p>
      </div>

      {/* Coupon */}
      {selectedPlan !== 'free' && (
        <div className="mb-5">
          <label className="block text-xs font-medium text-slate-600 mb-2">Coupon code</label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={coupon}
                onChange={(e) => { setCoupon(e.target.value.toUpperCase()); setCouponApplied(false); setDiscount(0); }}
                placeholder="Enter coupon"
                className="input-base pl-9 text-sm"
                disabled={couponApplied}
              />
            </div>
            <button
              onClick={handleApplyCoupon}
              disabled={validatingCoupon || couponApplied || !coupon}
              className="btn-secondary flex-shrink-0"
              style={{ width: 'auto', padding: '8px 16px', fontSize: 13 }}
            >
              {validatingCoupon ? <span className="spinner spinner-brand" style={{ width: 16, height: 16 }} /> : 'Apply'}
            </button>
          </div>
        </div>
      )}

      {/* Price breakdown */}
      {selectedPlan !== 'free' && (
        <div className="space-y-2 mb-5 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Plan amount</span>
            <span>₹{info.price}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Student discount</span>
              <span>-₹{discount}</span>
            </div>
          )}
          <div className="h-px bg-slate-200 my-2" />
          <div className="flex justify-between font-bold text-slate-800 text-base">
            <span>Total payable</span>
            <span>₹{total}</span>
          </div>
        </div>
      )}

      {/* CTA */}
      <button
        onClick={() => onProceed({ plan: selectedPlan, coupon: couponApplied ? coupon : null, total })}
        disabled={loading}
        className="btn-primary"
      >
        {loading ? (
          <span className="spinner" />
        ) : selectedPlan === 'free' ? (
          'Try for Free'
        ) : (
          'Proceed to Pay'
        )}
      </button>

      {selectedPlan !== 'free' && (
        <div className="flex items-center justify-center gap-2 mt-3 text-xs text-slate-400">
          <Shield size={12} />
          <span>Secure checkout. Monthly billing. Cancel anytime.</span>
        </div>
      )}

      {/* Note */}
      <p className="text-xs text-slate-400 mt-4 leading-relaxed">
        The Try Yourself option lets users experience the platform before paying. For Standard users,
        premium report sections can stay blurred with locked prompts to increase upgrade conversion.
      </p>
    </div>
  );
}
