"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { SessionProvider } from 'next-auth/react'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnReconnect: false
    }
  }
})

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (  
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          <NextUIProvider navigate={router.push}>
            <NextThemesProvider {...themeProps}>
              {children}
            </NextThemesProvider>
          </NextUIProvider>
        </QueryClientProvider>
      </SessionProvider>
  );
}
