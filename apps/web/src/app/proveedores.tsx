import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const clientedeconsultas = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const AplicacionProveedores: React.FC<{ children: React.ReactNode }> = ({
  children: hijos,
}) => {
  return <QueryClientProvider client={clientedeconsultas}>{hijos}</QueryClientProvider>;
};
