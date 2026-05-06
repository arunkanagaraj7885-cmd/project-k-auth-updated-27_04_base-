'use client';
import { Bell } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { selectSidebarOpen } from '@/store/slices/uiSlice';

export default function AppHeader({ title }) {
  const sidebarOpen = useAppSelector(selectSidebarOpen);

  return (
    <header
      className="fixed top-0 right-0 z-30 h-16 bg-white border-b border-slate-200 flex items-center px-6 gap-4 transition-all duration-300"
      style={{ left: sidebarOpen ? 260 : 72 }}
    >
      <h1 className="flex-1 text-lg font-semibold text-slate-800">{title}</h1>

      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors">
          <Bell size={18} />
        </button>
      </div>
    </header>
  );
}
