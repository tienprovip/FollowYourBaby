import { QueryClient } from '@tanstack/react-query';

// ---------------------------------------------------------------------------
// TanStack Query client with sensible defaults for a mobile health-tracking
// app: moderate stale time, single retry to avoid hammering the API when
// offline, and a short cache GC window to keep memory lean.
// ---------------------------------------------------------------------------

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,       // 1 minute — data is fresh for 60 s
      gcTime: 5 * 60_000,     // 5 minutes — keep unused cache entries
      retry: 1,               // one automatic retry on failure
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
