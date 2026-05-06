'use client';
import Image from 'next/image';
import projectKLogo from '@/assets/images/project-k-logo.svg';

export default function Logo({ size = 'md' }) {
  const sizes = {
    sm: { width: 120, height: 38 },
    md: { width: 154, height: 48 },
    lg: { width: 178, height: 56 },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div className="flex items-center justify-center">
      <Image
        src={projectKLogo}
        alt="Project K"
        width={s.width}
        height={s.height}
        priority
      />
    </div>
  );
}
