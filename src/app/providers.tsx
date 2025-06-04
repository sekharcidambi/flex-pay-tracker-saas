'use client';

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/hooks/useAuth";
import { BusinessProvider } from "@/hooks/useBusiness";
import { ReactNode } from "react";
import { ThemeProvider } from 'next-themes';
import { createBrowserClient } from '@supabase/ssr';
import { useState } from 'react';

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  const [supabaseClient] = useState(() => {
    if (typeof window === 'undefined') {
      return null;
    }
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables');
      return null;
    }

    return createBrowserClient(supabaseUrl, supabaseAnonKey);
  });

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <BusinessProvider>
            <Toaster />
            <Sonner />
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </BusinessProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
} 