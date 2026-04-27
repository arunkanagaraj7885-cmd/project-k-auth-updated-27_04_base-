'use client';
import { Bell } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { selectUser, selectPlan } from '@/store/slices/authSlice';
import { selectSidebarOpen } from '@/store/slices/uiSlice';
import PlanBadge from './PlanBadge';

export default function AppHeader({ title }) {
  const user = useAppSelector(selectUser);
  const plan = useAppSelector(selectPlan);
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

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-700 leading-tight">{user?.name || 'User'}</p>
            <PlanBadge plan={plan} />
          </div>
        </div>
      </div>
    </header>
  );
}
