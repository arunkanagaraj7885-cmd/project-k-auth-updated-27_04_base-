'use client';

const PLAN_CONFIG = {
  free:     { label: 'Free',     className: 'plan-free' },
  standard: { label: 'Standard', className: 'plan-standard' },
  premium:  { label: 'Premium',  className: 'plan-premium' },
};

export default function PlanBadge({ plan = 'free', className = '' }) {
  const config = PLAN_CONFIG[plan] || PLAN_CONFIG.free;
  return (
    <span
      suppressHydrationWarning
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.className} ${className}`}
    >
      {config.label}
    </span>
  );
}
