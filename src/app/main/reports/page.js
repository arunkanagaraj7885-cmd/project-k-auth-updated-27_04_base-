'use client';
import { useState } from 'react';
import { FileText, Search } from 'lucide-react';
import InterviewCard from '@/components/shared/InterviewCard';
import Pagination from '@/components/shared/Pagination';
import EmptyState from '@/components/shared/EmptyState';
import { useReports } from '@/hooks/useReport';
import { useRouter } from 'next/navigation';

export default function ReportsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useReports({ page, limit: 10, search });

  const reports = data?.reports ?? [];
  const total = data?.total_pages ?? 1;

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">My Reports</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Review your interview feedback and track your progress over time.
          </p>
        </div>
        <button
          onClick={() => router.push('/main/start-interview')}
          className="btn-primary"
          style={{ width: 'auto', padding: '10px 20px' }}
        >
          + New Interview
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by role or date…"
          className="input-base pl-9"
        />
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 skeleton rounded-xl" />
          ))}
        </div>
      ) : reports.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No reports yet"
          description="Complete your first interview to see detailed feedback reports here."
          cta="Start an Interview"
          onCta={() => router.push('/main/start-interview')}
        />
      ) : (
        <div className="card p-4">
          <div className="space-y-2">
            {reports.map((r) => (
              <InterviewCard key={r.id} interview={r} />
            ))}
          </div>
          <Pagination current={page} total={total} onChange={setPage} />
        </div>
      )}
    </div>
  );
}
