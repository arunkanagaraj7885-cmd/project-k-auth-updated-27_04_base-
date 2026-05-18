'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronRight } from 'lucide-react';
import { useReports } from '@/hooks/useReport';
import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/slices/authSlice';

const PAGE_SIZE = 10;

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function ScoreBadge({ score }) {
  const color =
    score >= 90 ? 'bg-green-50 text-green-700 border-green-200' :
    score >= 80 ? 'bg-blue-50  text-blue-700  border-blue-200' :
    score >= 70 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  'bg-red-50   text-red-600   border-red-200';
  return (
    <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full border text-sm font-bold ${color}`}>
      {score}
    </span>
  );
}

export default function ReportsPage() {
  const router = useRouter();
  const user   = useAppSelector(selectUser);

  const [searchInput, setSearchInput] = useState('');
  const [typeInput, setTypeInput]     = useState('');
  const [scoreInput, setScoreInput]   = useState('');
  const [dateInput, setDateInput]     = useState('');

  const [applied, setApplied] = useState({ search: '', type: '', scoreRange: '', dateRange: '' });
  const [page, setPage]       = useState(1);

  const { data, isLoading } = useReports({ ...applied, page, limit: PAGE_SIZE });

  const reports      = data?.reports      ?? [];
  const totalCount   = data?.total        ?? 0;
  const totalPages   = data?.total_pages  ?? 1;
  const avgScore     = data?.avg_score    ?? 0;
  const highestScore = data?.highest_score ?? 0;

  const handleApply = () => {
    setPage(1);
    setApplied({ search: searchInput, type: typeInput, scoreRange: scoreInput, dateRange: dateInput });
  };

  const handleClear = () => {
    setSearchInput('');
    setTypeInput('');
    setScoreInput('');
    setDateInput('');
    setPage(1);
    setApplied({ search: '', type: '', scoreRange: '', dateRange: '' });
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleApply(); };

  const firstName = user?.name?.split(' ')[0] || user?.first_name || 'there';

  return (
    <div className="animate-fade-in">

      {/* ── Page header ── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
          <p className="text-sm text-slate-500 mt-0.5">All completed interview reports in a simple list view.</p>
        </div>
        <span className="px-4 py-1.5 rounded-full bg-white border border-slate-200 text-sm text-slate-600 shadow-sm flex-shrink-0">
          Welcome, {firstName}
        </span>
      </div>

      {/* ── Filter bar ── */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-5 flex items-end gap-3">
        {/* Search */}
        <div className="flex-1">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Search</p>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search by title"
              className="input-base text-sm w-full"
              style={{ paddingLeft: '2.25rem' }}
            />
          </div>
        </div>

        {/* Interview Type */}
        <div className="flex-1">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Interview Type</p>
          <select
            value={typeInput}
            onChange={(e) => setTypeInput(e.target.value)}
            className="input-base text-sm bg-white"
          >
            <option value="">All Types</option>
            <option value="full">Full Interview</option>
            <option value="mock">Mock Interview</option>
          </select>
        </div>

        {/* Score Range */}
        <div className="flex-1">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Score Range</p>
          <select
            value={scoreInput}
            onChange={(e) => setScoreInput(e.target.value)}
            className="input-base text-sm bg-white"
          >
            <option value="">All Scores</option>
            <option value="80-100">80 – 100</option>
            <option value="50-80">50 – 80</option>
          </select>
        </div>

        {/* Date */}
        <div className="flex-1">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Date</p>
          <select
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            className="input-base text-sm bg-white"
          >
            <option value="">All Dates</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-end gap-2 shrink-0">
          <button
            onClick={handleClear}
            className="px-5 py-[10px] rounded-lg border border-red-200 text-sm font-medium text-red-500 bg-white hover:bg-red-50 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={handleApply}
            className="btn-primary"
            style={{ width: 'auto', padding: '10px 24px' }}
          >
            Apply
          </button>
        </div>
      </div>

      {/* ── Stats + Table card ── */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

        {/* Stats strip */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <p className="text-sm font-semibold text-slate-800">Reports</p>
            <p className="text-xs text-slate-400 mt-0.5">Click any row to open the detailed report.</p>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">{totalCount}</p>
              <p className="text-xs text-slate-400">Total Reports</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">{avgScore}</p>
              <p className="text-xs text-slate-400">Average Score</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">{highestScore || '—'}</p>
              <p className="text-xs text-slate-400">Highest Score</p>
            </div>
          </div>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-[1fr_160px_90px_140px_40px] gap-4 px-5 py-2.5 border-b border-slate-100 bg-slate-50">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Title</span>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Type</span>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Score</span>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Completed Date</span>
          <span />
        </div>

        {/* Rows */}
        {isLoading ? (
          <div className="p-5 space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-12 skeleton rounded-lg" />
            ))}
          </div>
        ) : reports.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-slate-500 text-sm">No reports match your filters.</p>
            <button
              onClick={handleClear}
              className="text-blue-600 text-sm hover:underline mt-2 inline-block"
            >
              Clear filters
            </button>
          </div>
        ) : (
          reports.map((r, i) => (
            <div
              key={r.session_id}
              onClick={() => router.push(`/main/reports/${r.session_id}`)}
              className={`grid grid-cols-[1fr_160px_90px_140px_40px] gap-4 px-5 py-4 items-center cursor-pointer hover:bg-blue-50/40 transition-colors ${
                i < reports.length - 1 ? 'border-b border-slate-100' : ''
              }`}
            >
              <span className="text-sm font-medium text-slate-800 truncate">{r.title}</span>
              <span className="text-sm text-slate-500">
                {r.interview_type === 'full' ? 'Full Interview' : 'Mock Interview'}
              </span>
              <span><ScoreBadge score={r.score} /></span>
              <span className="text-sm text-slate-500">{formatDate(r.completed_date)}</span>
              <ChevronRight size={16} className="text-slate-300" />
            </div>
          ))
        )}

        {/* Pagination */}
        {totalCount > 0 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100">
            <span className="text-sm text-slate-500">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, totalCount)} of {totalCount}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-sm rounded-lg border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-9 h-9 text-sm rounded-lg border font-medium transition-colors ${
                    page === i + 1
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 text-sm rounded-lg border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
