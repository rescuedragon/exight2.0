import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import TestSpace from "./pages/TestSpace";

const queryClient = new QueryClient();

// Check if user should be logged in (once per day)
const shouldShowLogin = () => {
  // Check for demo mode - bypass login if demo mode is enabled
  const demoMode = localStorage.getItem('demoMode') === 'true';
  if (demoMode) {
    console.log('Demo mode enabled, bypassing login');
    return false;
  }
  
  const lastLogin = localStorage.getItem('lastLoginDate');
  const today = new Date().toDateString();
  
  console.log('Checking login status:', { lastLogin, today, token: localStorage.getItem('authToken') });
  
  if (!lastLogin || lastLogin !== today) {
    console.log('No login today, showing login page');
    return true; // Show login if never logged in today
  }
  
  const token = localStorage.getItem('authToken');
  const needsLogin = !token;
  console.log('Token exists:', !!token, 'Needs login:', needsLogin);
  return needsLogin; // Show login if no token
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [shouldLogin, setShouldLogin] = useState(false);
  const [loginKey, setLoginKey] = useState(0);

  useEffect(() => {
    const needsLogin = shouldShowLogin();
    setShouldLogin(needsLogin);
    setIsLoading(false);
  }, [loginKey]);

  // Listen for storage changes (when login happens)
  useEffect(() => {
    const handleStorageChange = () => {
      setLoginKey(prev => prev + 1);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={shouldLogin ? <Navigate to="/login" /> : <Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={shouldLogin ? <Navigate to="/login" /> : <Index />} />
          <Route path="/testspace" element={<TestSpace />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
