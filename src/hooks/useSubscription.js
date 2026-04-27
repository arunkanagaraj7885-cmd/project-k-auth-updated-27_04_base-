import { useQuery } from '@tanstack/react-query';
import { paymentsApi } from '@/lib/api/payments';

export function usePlans() {
  return useQuery({
    queryKey: ['plans'],
    queryFn: () => paymentsApi.getPlans().then((r) => r.data),
    staleTime: 60 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
  });
}

export function useSubscription() {
  return useQuery({
    queryKey: ['subscription'],
    queryFn: () => paymentsApi.getSubscription().then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });
}
