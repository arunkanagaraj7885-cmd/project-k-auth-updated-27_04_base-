import { useQuery } from '@tanstack/react-query';
import { interviewApi } from '@/lib/api/interview';
import { useAppDispatch } from '@/store/hooks';
import { setConfig, setSessionId } from '@/store/slices/interviewSlice';

export function useInterviewDefaults() {
  return useQuery({
    queryKey: ['interview', 'defaults'],
    queryFn: () => interviewApi.getConfigDefaults().then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useResumeStatus() {
  return useQuery({
    queryKey: ['resume', 'status'],
    queryFn: () => interviewApi.getResumeStatus
      ? interviewApi.getResumeStatus().then((r) => r.data)
      : Promise.resolve({ uploaded: false }),
    staleTime: 5 * 60 * 1000,
  });
}
