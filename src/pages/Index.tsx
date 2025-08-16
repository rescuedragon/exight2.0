import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { authAPI } from "@/services/api";

const Index = () => {
  const [userProfile, setUserProfile] = useState<{ firstName?: string; lastName?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated and get profile
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authAPI.isAuthenticated()) {
          const profile = await authAPI.getProfile();
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // If auth fails, redirect to login
        window.location.href = '/login';
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    authAPI.logout();
    window.location.href = '/login';
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-20 flex items-center justify-between px-8 z-50">
        {/* Brand */}
        <div className="select-none">
          <h1 className="text-3xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">Exight</span>
          </h1>
        </div>

        {/* User menu and theme toggle */}
        <div className="flex items-center gap-4">
          {userProfile && (
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Hello, {userProfile.firstName || 'User'}
            </span>
          )}
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <LogIn className="h-4 w-4" />
            Logout
          </Button>
          <ThemeToggle />
        </div>
      </div>

      {/* Main Content */}
      <div className="h-full w-full flex items-center justify-center pt-20">
        <div className="text-center space-y-6 max-w-2xl px-8">
          <div className="space-y-4">
            <h2 className="text-6xl font-bold text-gray-900 dark:text-white">
              Welcome to Your
            </h2>
            <h3 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
              Dashboard
            </h3>
          </div>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            This is a clean slate for your new dashboard. Start building amazing features here!
          </p>

          <div className="pt-8">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Ready to build
              </span>
            </div>
          </div>

          {/* Development Info */}
          <div className="pt-8 space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <p>🚀 Authentication: Working</p>
            <p>🎨 Theme System: Available</p>
            <p>🔧 Components: UI library ready</p>
            <p>📱 Responsive: Mobile-first design</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;