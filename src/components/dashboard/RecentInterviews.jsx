'use client';
import InterviewCard from '@/components/shared/InterviewCard';
import Link from 'next/link';
import { Play } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RecentInterviews({ interviews = [] }) {
  const router = useRouter();

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800">Recent Interviews</h3>
        <Link href="/main/reports" className="text-xs text-blue-600 hover:underline font-medium">
          View all
        </Link>
      </div>

      {interviews.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
            <Play size={20} className="text-blue-400" />
          </div>
          <p className="text-sm text-slate-500">No interviews yet. Start your first one!</p>
          <button
            onClick={() => router.push('/main/start-interview')}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Start Interview →
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {interviews.map((interview) => (
            <InterviewCard key={interview.id} interview={interview} />
          ))}
        </div>
      )}
    </div>
  );
}
