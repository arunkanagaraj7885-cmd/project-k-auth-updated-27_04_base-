import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectUser, selectPlan, selectIsAuthed, clearCredentials } from '@/store/slices/authSlice';
import { resetSession } from '@/store/slices/interviewSlice';
import { queryClient } from '@/lib/queryClient';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export function useAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector(selectUser);
  const plan = useAppSelector(selectPlan);
  const isAuthed = useAppSelector(selectIsAuthed);

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch { /* ignore — still clear local state */ }
    dispatch(clearCredentials());
    dispatch(resetSession());
    queryClient.clear();
    router.push('/auth/login');
    toast.success('Logged out successfully');
  };

  return { user, plan, isAuthed, logout };
}
