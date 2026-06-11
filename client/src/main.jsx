import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import {
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query";
import { AuthProvider } from './context/AuthContext.jsx';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});
ReactDOM.createRoot(
  document.getElementById('root')
).render(

  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <App />
          <Toaster position="top-right" />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

// QueryClientProvider - provides React Query caching and API state globally

// BrowserRouter - handles all route navigation

// AuthProvider - provides user, login, signup, logout, loading globally

// Toaster - renders toast notifications globally