import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { authAPI } from "@/services/api";

interface GoogleAuthButtonProps {
  className?: string;
  onClick?: () => void;
}

// Google OAuth configuration
const GOOGLE_CLIENT_ID = "176712194964-34r23nnq9no31e92mgkjmo1qu87c63nu.apps.googleusercontent.com";

export function GoogleAuthButton({ className, onClick }: GoogleAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const navigate = useNavigate();

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setShowInfo(false);
    
    try {
      // Check if Google Identity Services is loaded
      if (typeof window.google === 'undefined') {
        // Try to wait for it to load
        await new Promise((resolve, reject) => {
          let attempts = 0;
          const checkGoogle = () => {
            attempts++;
            if (typeof window.google !== 'undefined') {
              resolve(true);
            } else if (attempts < 10) {
              setTimeout(checkGoogle, 500);
            } else {
              reject(new Error('Google Identity Services failed to load'));
            }
          };
          checkGoogle();
        });
      }

      // Initialize Google OAuth
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCallback,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Prompt for Google sign-in
      window.google.accounts.id.prompt();
    } catch (error) {
      console.error('Google auth failed:', error);
      setShowInfo(true);
      setIsLoading(false);
    }
    
    onClick?.();
  };

  const handleGoogleCallback = async (response: { credential: string }) => {
    try {
      // Send the credential token to our backend
      const result = await authAPI.googleLogin(response.credential);
      
      if (result.token) {
        // Successfully authenticated, redirect to dashboard
        navigate('/');
      }
    } catch (error) {
      console.error('Google login failed:', error);
      setShowInfo(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {showInfo && (
        <div className="mb-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 text-xs">
          <p className="font-medium mb-1">⚠️ Google sign-in failed</p>
          <p>Unable to complete Google authentication. Please try again or use email/password authentication above.</p>
        </div>
      )}
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleAuth}
        disabled={isLoading}
        className={cn(
          "w-full h-12 bg-white dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-900 dark:text-gray-100 typography-button text-xs rounded-xl transition-all duration-200 shadow-sm hover:shadow-md dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.3)]",
          "flex items-center justify-center gap-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
      >
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        {isLoading ? 'CONNECTING...' : 'CONTINUE WITH GOOGLE'}
      </Button>
    </div>
  );
}
