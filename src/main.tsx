import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import './i18n';
import { Toaster } from "./components/ui/sonner";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DataProviderContext } from './services/data/DataContext';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider } from 'next-themes';

// Create a client for React Query
const queryClient = new QueryClient();

// Get the initial data source from local storage or default to 'mock'
const savedDataSource = localStorage.getItem('preferredDataSource') as 'mock' | 'supabase' | null;
const initialDataSource = savedDataSource || 'mock';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <DataProviderContext initialDataSource={initialDataSource}>
              <AuthProvider>
                <App />
                <Toaster />
              </AuthProvider>
            </DataProviderContext>
          </BrowserRouter>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
