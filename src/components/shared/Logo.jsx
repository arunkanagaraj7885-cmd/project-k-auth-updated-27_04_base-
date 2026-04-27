'use client';

export default function Logo({ size = 'md' }) {
  const sizes = {
    sm: { img: 32, text: 'text-base' },
    md: { img: 40, text: 'text-xl' },
    lg: { img: 52, text: 'text-2xl' },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div className="flex flex-col items-center gap-1">
      {/* SVG logo mark matching the circular arrow in screenshots */}
      <svg width={s.img} height={s.img} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="18" stroke="#2563eb" strokeWidth="2.5" fill="none" />
        <path
          d="M 12 20 C 12 14.5 16 11 20 11 C 26 11 29 15 29 20"
          stroke="#2563eb"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 28 20 C 28 25.5 24 29 20 29 C 14 29 11 25 11 20"
          stroke="#0ea5e9"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <polygon points="29,16 33,20 29,24" fill="#2563eb" />
        <polygon points="11,24 7,20 11,16" fill="#0ea5e9" />
      </svg>
      <span
        style={{ fontFamily: 'DM Serif Display, serif', letterSpacing: '0.12em' }}
        className={`${s.text} text-slate-800 font-normal uppercase tracking-widest`}
      >
        Project K
      </span>
    </div>
  );
}
