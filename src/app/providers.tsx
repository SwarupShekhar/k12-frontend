'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import StyledComponentsRegistry from './lib/registry';

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  }));

  // Fix hydration mismatch for theme
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <StyledComponentsRegistry>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </StyledComponentsRegistry>
    )
  }

  return (
    <StyledComponentsRegistry>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster richColors position="top-center" />
        </QueryClientProvider>
      </ThemeProvider>
    </StyledComponentsRegistry>
  );
}

