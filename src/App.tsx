import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Index, { TryMe } from "./pages/Index";
import { Mail } from "lucide-react";
import NotFound from "./pages/NotFound";
import TestSpace from "./pages/TestSpace";
import Login from "./components/Login";
import { ModalProvider } from "@/contexts/ModalContext";

import { FeedbackModal } from "@/components/FeedbackModal";



const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    // Simple auth check without API calls
    const token = localStorage.getItem('authToken');
    const demoMode = localStorage.getItem('demoMode');
    const lastLoginDate = localStorage.getItem('lastLoginDate');
    
    setIsDemoMode(demoMode === 'true');
    setIsAuthenticated(!!token || demoMode === 'true' || !!lastLoginDate);
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
    <TooltipProvider>
      <ModalProvider>
        <Toaster />
        <Sonner />
        <FeedbackModal />
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
  );
};

export default App;
