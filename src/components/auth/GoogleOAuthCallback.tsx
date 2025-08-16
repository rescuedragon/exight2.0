import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const GoogleOAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const token = searchParams.get('token');
        const errorParam = searchParams.get('error');

        if (errorParam) {
          throw new Error(errorParam);
        }

        if (!token) {
          throw new Error('No authentication token received');
        }

        // Store the token
        localStorage.setItem('authToken', token);
        setStatus('success');
        
        // Redirect to dashboard after a brief delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);

      } catch (error) {
        console.error('OAuth callback error:', error);
        setError(error instanceof Error ? error.message : 'Authentication failed');
        setStatus('error');
        
        // Redirect to login after showing error for a few seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20">
      <div className="text-center">
        {status === 'loading' && (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300">Completing authentication...</p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="space-y-4">
            <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto">
              <svg className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg text-emerald-600 dark:text-emerald-400">Authentication successful!</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Redirecting to dashboard...</p>
          </div>
        )}
        
        {status === 'error' && (
          <div className="space-y-4">
            <div className="h-12 w-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
              <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-lg text-red-600 dark:text-red-400">Authentication failed</p>
            {error && <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>}
            <p className="text-sm text-gray-500 dark:text-gray-400">Redirecting to login...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleOAuthCallback;
