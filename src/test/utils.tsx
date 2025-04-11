import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'styled-components';
import { theme } from '../styles/theme';

// Create a QueryClient for tests
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
      refetchOnWindowFocus: false,
    },
  },
});

// Wrapper component to provide all application context providers
interface AllProvidersProps {
  children: React.ReactNode;
  queryClient?: QueryClient;
}

const AllProviders = ({ 
  children, 
  queryClient = createTestQueryClient() 
}: AllProvidersProps) => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

// Custom render method with providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
  providerProps?: Omit<AllProvidersProps, 'children'>
) => render(ui, {
  wrapper: (props) => <AllProviders {...props} {...providerProps} />,
  ...options
});

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override render method
export { customRender as render };