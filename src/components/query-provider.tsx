'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

// Props: This component wraps children components that need React Query context
export default function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
     // Provides the QueryClient context to all child components
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
