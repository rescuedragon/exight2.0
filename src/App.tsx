import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect, Suspense, lazy } from 'react';
import { ModalProvider } from '@/contexts/ModalContext';

import { FeedbackModal } from '@/components/FeedbackModal';

// Route-level code splitting
const Index = lazy(() => import('./pages/Index').then((m) => ({ default: m.default })));
const TryMe = lazy(() => import('./pages/Index').then((m) => ({ default: m.TryMe })));
const NotFound = lazy(() => import('./pages/NotFound'));
const TestSpace = lazy(() => import('./pages/TestSpace'));
const Login = lazy(() => import('./components/Login'));

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const location = useLocation();

  const recomputeAuth = () => {
    const token = localStorage.getItem('authToken');
    const demoMode = localStorage.getItem('demoMode');

    setIsDemoMode(demoMode === 'true');
    // Only a real token or explicit demo mode counts as authenticated
    setIsAuthenticated(!!token || demoMode === 'true');
  };

  useEffect(() => {
    // Initial check
    recomputeAuth();
    // Respond to auth events from apiService
    const onAuthChanged = () => recomputeAuth();
    window.addEventListener('authChanged', onAuthChanged);
    // Respond to cross-tab storage changes
    const onStorage = (e: StorageEvent) => {
      if (['authToken', 'demoMode'].includes(e.key || '')) {
        recomputeAuth();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('authChanged', onAuthChanged);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  useEffect(() => {
    // Re-evaluate on route changes to be safe
    recomputeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-900/95 dark:to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <ModalProvider>
        <Toaster />
        <Sonner />
        <FeedbackModal />
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-900/95 dark:to-gray-900">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-300">Loading...</p>
              </div>
            </div>
          }
        >
          <Routes>
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
            <Route
              path="/"
              element={
                isAuthenticated ? isDemoMode ? <TryMe /> : <Index /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/dashboard"
              element={
                isAuthenticated ? isDemoMode ? <TryMe /> : <Index /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/testspace"
              element={isAuthenticated ? <TestSpace /> : <Navigate to="/login" />}
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ModalProvider>
    </TooltipProvider>
  );
};

export default App;
