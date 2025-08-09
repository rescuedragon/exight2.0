import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Index, { TryMe } from "./pages/Index";
import { Mail } from "lucide-react";
import NotFound from "./pages/NotFound";
import TestSpace from "./pages/TestSpace";
import Login from "./components/Login";
import { ModalProvider } from "@/contexts/ModalContext";
import { apiService } from "@/lib/api";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user has auth token
        const token = localStorage.getItem('authToken');
        const demoMode = localStorage.getItem('demoMode');
        const lastLoginDate = localStorage.getItem('lastLoginDate');
        
        // Set demo mode first
        setIsDemoMode(demoMode === 'true');
        
        if (token) {
          try {
            // Try to verify token with API
            const isAuthValid = await apiService.checkAuth();
            setIsAuthenticated(isAuthValid);
          } catch (apiError) {
            console.error('API auth check failed:', apiError);
            // Fallback to token check
            setIsAuthenticated(!!token);
          }
        } else {
          // No token, check for demo mode
          setIsAuthenticated(demoMode === 'true');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Final fallback to localStorage check
        const lastLoginDate = localStorage.getItem('lastLoginDate');
        setIsAuthenticated(!!lastLoginDate);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

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
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ModalProvider>
          <Toaster />
          <Sonner />
          {/* Feedback Email – fixed bottom-right */}
          <a
            href="mailto:feedback@exight.in?subject=Exight%20Feedback"
            className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-2xl border border-border/40 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-colors"
            aria-label="Send feedback"
          >
            <Mail className="h-4 w-4" />
            <span>Feedback</span>
          </a>
          <Routes>
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
            <Route path="/" element={
              isAuthenticated ? (
                isDemoMode ? <TryMe /> : <Index />
              ) : (
                <Navigate to="/login" />
              )
            } />
            <Route path="/dashboard" element={
              isAuthenticated ? (
                isDemoMode ? <TryMe /> : <Index />
              ) : (
                <Navigate to="/login" />
              )
            } />
            <Route path="/testspace" element={isAuthenticated ? <TestSpace /> : <Navigate to="/login" />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ModalProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
