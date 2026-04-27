'use client';
import { useState } from 'react';
import { Briefcase, MapPin, ExternalLink, Bookmark, Search } from 'lucide-react';
import BlurredSection from '@/components/shared/BlurredSection';
import { useAppSelector } from '@/store/hooks';
import { selectPlan } from '@/store/slices/authSlice';
import { useQuery } from '@tanstack/react-query';
import { jobsApi } from '@/lib/api/jobs';
import toast from 'react-hot-toast';

function JobCard({ job }) {
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await jobsApi.save(job.id);
      toast.success('Job saved!');
    } catch {
      toast.error('Failed to save job.');
    }
  };

  return (
    <div className="card p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-slate-800">{job.title}</h3>
          <p className="text-sm text-slate-600 mt-0.5">{job.company}</p>
          <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
            <span className="flex items-center gap-1"><MapPin size={11} /> {job.location}</span>
            {job.type && <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">{job.type}</span>}
            {job.salary && <span className="text-green-600 font-medium">{job.salary}</span>}
          </div>
          {job.description && (
            <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-2">{job.description}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={handleSave}
            className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-colors"
          >
            <Bookmark size={15} />
          </button>
          {job.apply_url && (
            <a
              href={job.apply_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-colors"
            >
              <ExternalLink size={15} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function JobsPage() {
  const plan = useAppSelector(selectPlan);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['jobs', search],
    queryFn: () => jobsApi.getAll({ search }).then((r) => r.data),
    enabled: plan === 'premium',
  });

  const jobs = data?.jobs ?? [];

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">Job Board</h2>
        <p className="text-sm text-slate-500 mt-1">Curated openings matched to your profile and target role.</p>
      </div>

      <BlurredSection unlockPlan="premium">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search jobs by title, company, or keyword…"
              className="input-base pl-9"
            />
          </div>

          {/* Job list */}
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => <div key={i} className="h-24 skeleton rounded-xl" />)}
            </div>
          ) : jobs.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                <Briefcase size={24} className="text-blue-400" />
              </div>
              <p className="text-slate-500 text-sm">No jobs found. Check back later!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => <JobCard key={job.id} job={job} />)}
            </div>
          )}
        </div>
      </BlurredSection>
    </div>
  );
}
