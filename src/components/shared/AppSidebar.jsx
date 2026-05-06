'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Play, FileText, Briefcase,
  LogOut, ChevronLeft, ChevronRight,
  Sparkles, User, Settings, HelpCircle,
  ChevronUp,
} from 'lucide-react';
import PlanBadge from './PlanBadge';
import Logo from './Logo';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectUser, selectPlan, clearCredentials } from '@/store/slices/authSlice';
import { resetSession } from '@/store/slices/interviewSlice';
import { selectSidebarOpen, toggleSidebar } from '@/store/slices/uiSlice';
import { queryClient } from '@/lib/queryClient';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// ── Main nav (top section) ─────────────────────────────────────────────────
const NAV_ITEMS = [
  { href: '/main/dashboard',       icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/main/start-interview', icon: Play,            label: 'Start Interview' },
  { href: '/main/reports',         icon: FileText,        label: 'Reports' },
  { href: '/main/jobs',            icon: Briefcase,       label: 'Job Board', plan: 'premium' },
];

// ── User pop-up menu items ─────────────────────────────────────────────────
const USER_MENU = [
  { href: '/main/upgrade',       icon: Sparkles,    label: 'Upgrade Plan',  accent: true },
  { href: '/main/profile-setup', icon: User,        label: 'Profile' },
  { href: '/main/settings',      icon: Settings,    label: 'Settings' },
  { href: '/main/help',          icon: HelpCircle,  label: 'Help' },
];

export default function AppSidebar() {
  const pathname    = usePathname();
  const router      = useRouter();
  const dispatch    = useAppDispatch();
  const user        = useAppSelector(selectUser);
  const plan        = useAppSelector(selectPlan);
  const sidebarOpen = useAppSelector(selectSidebarOpen);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef   = useRef(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    setMenuOpen(false);
    try { await api.post('/auth/logout'); } catch { /* ignore */ }
    dispatch(clearCredentials());
    dispatch(resetSession());
    queryClient.clear();
    // Clear onboarding cookie
    document.cookie = 'pk_onb=; path=/; max-age=0';
    router.push('/auth/login');
    toast.success('Logged out successfully');
  };

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  const firstName = user?.name?.split(' ')[0] || 'User';

  return (
    <aside
      className="sidebar transition-all duration-300 bg-white border-r border-[#e3e7ee]"
      style={{ width: sidebarOpen ? 260 : 72 }}
    >
      {/* ── Logo + collapse toggle ── */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-[#e3e7ee]">
        {sidebarOpen && (
          <div className="pl-1">
            <Logo size="sm" />
          </div>
        )}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors ml-auto"
        >
          {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {/* ── Nav items ── */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ href, icon: Icon, label, plan: reqPlan }) => {
          const active = pathname?.startsWith(href);
          const locked = reqPlan && plan !== reqPlan && plan !== 'premium';

          return (
            <Link
              key={href}
              href={locked ? '/pricing' : href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group ${
                active
                  ? 'text-[#0b66d6] bg-transparent'
                  : 'text-[#7b7f8c] hover:text-[#2b3240] bg-transparent'
              }`}
              title={!sidebarOpen ? label : undefined}
            >
              {!sidebarOpen && <Icon size={18} className="flex-shrink-0" />}
              {sidebarOpen && <span className="flex-1">{label}</span>}
              {sidebarOpen && locked && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-transparent text-[#7b7f8c]">
                  Pro
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── User section (bottom) ── */}
      <div className="relative border-t border-[#e3e7ee] px-3 py-3" ref={menuRef}>

        {/* Pop-up menu — rendered above the trigger */}
        {menuOpen && (
          <div
            className="absolute left-3 right-3 bottom-full mb-2 rounded-2xl border border-[#1e3a67] bg-white shadow-sm overflow-hidden z-50"
            style={{ width: sidebarOpen ? 236 : 208, left: sidebarOpen ? 12 : undefined, right: sidebarOpen ? 12 : 'auto' }}
          >
            {/* Menu header */}
            {sidebarOpen && (
              <div className="px-4 py-3 border-b border-slate-200">
                <p className="text-[#2b3240] text-sm font-semibold truncate">{user?.name || firstName}</p>
                <p className="text-slate-500 text-xs truncate">{user?.email || ''}</p>
              </div>
            )}

            {/* Menu items */}
            <div className="py-1.5">
              {USER_MENU.map(({ href, icon: Icon, label, accent }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                    accent
                      ? 'text-[#2b3240] hover:bg-[#f4f6fa]'
                      : 'text-[#2b3240] hover:bg-[#f4f6fa]'
                  }`}
                >
                  <Icon size={16} className="flex-shrink-0" />
                  <span>{label}</span>
                  {accent && (
                    <span className="ml-auto text-xs px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                      ✦
                    </span>
                  )}
                </Link>
              ))}
            </div>

            {/* Divider + Logout */}
            <div className="border-t border-slate-200 py-1.5">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} className="flex-shrink-0" />
                <span>Log out</span>
              </button>
            </div>
          </div>
        )}

        {/* ── Trigger: user card ── */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
            menuOpen ? 'bg-[#d9dde4]' : 'hover:bg-[#eaedf3]'
          }`}
          title={!sidebarOpen ? `${user?.name || 'Account'} — click for menu` : undefined}
        >
          {/* Avatar */}
          {user?.avatar_url ? (
            <Image
              src={user.avatar_url}
              alt={user.name || 'Avatar'}
              width={32}
              height={32}
              className="rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#2f3f55] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">{initials}</span>
            </div>
          )}

          {/* Name + plan badge */}
          {sidebarOpen && (
            <div className="flex-1 min-w-0 text-left">
              <p className="text-[#1f2937] text-sm font-medium truncate">{firstName}</p>
              <PlanBadge plan={plan} className="mt-0.5" />
            </div>
          )}

          {/* Chevron indicator */}
          {sidebarOpen && (
            <ChevronUp
              size={14}
              className={`flex-shrink-0 text-slate-500 transition-transform ${menuOpen ? 'rotate-180' : ''}`}
            />
          )}
        </button>
      </div>
    </aside>
  );
}
