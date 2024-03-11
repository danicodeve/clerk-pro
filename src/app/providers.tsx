"use client";

import { ReactNode } from "react";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

const browserQueryClient: QueryClient | undefined = undefined;

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Garbage collection time for persister
        // The duration until inactive queries will be removed from the cache (localStorage).
        gcTime: Infinity,
        // The duration until a query transitions from fresh to stale.
        // As long as the query is fresh, data will always be read from the cache only.
        // No network request will happen.

        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 5 * 60 * 1000,
      },
    },
  });
}

export default function Providers({ children }: { children: ReactNode }) {
  const queryClient = browserQueryClient ?? makeQueryClient();

  const persister = createSyncStoragePersister({
    storage: window.localStorage,
  });

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}>
      {children}
    </PersistQueryClientProvider>
  );
}

// See more at:
// https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr#initial-setup
// https://tanstack.com/query/latest/docs/framework/react/plugins/persistQueryClient#persistqueryclientprovider
