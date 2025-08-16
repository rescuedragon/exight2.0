import { AuthForm } from "@/components/auth/AuthForm";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { PromotionalFeatures } from "@/components/PromotionalFeatures";
import { cn } from "@/lib/utils";

const Login = () => {
  return (
    <div className="h-screen w-screen bg-white overflow-hidden">
      {/* Dashboard layout */}
        <div className="h-full w-full flex flex-col lg:flex-row bg-white">
            
                            {/* Left side - Authentication - 40% */}
        <div className="w-full lg:w-[40%] flex flex-col h-full lg:h-screen p-6 lg:p-8 animate-in fade-in slide-in-from-left-4 duration-700">
          {/* Brand header - Top */}
          <div className="flex-shrink-0 mb-6">
            <div className="flex items-start space-x-2">
              <h1 className="text-4xl lg:text-5xl typography-heading bg-clip-text text-transparent leading-loose pb-2" style={{
                backgroundImage: 'linear-gradient(45deg, #059669, #2563eb, #9333ea, #059669)',
                backgroundSize: '400% 400%',
                animation: 'gradient 8s ease-in-out infinite'
              }}>
                Exight
              </h1>
            </div>
            <p className="text-gray-600 text-lg typography-body mt-2">
              Insights for your expenses.
            </p>
          </div>

          {/* Auth form - Fill remaining space with fixed layout */}
          <div className="flex-1 flex flex-col justify-start pt-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            <div className="space-y-3 max-w-sm mx-auto w-full">
                <AuthForm />
                
                {/* Divider */}
                <div className="flex items-center space-x-3">
                  <div className="flex-1 border-t border-gray-200"></div>
                  <span className="text-xs text-gray-500 typography-small">or</span>
                  <div className="flex-1 border-t border-gray-200"></div>
                </div>

                {/* Google auth */}
                <GoogleAuthButton />

                {/* Footer text */}
                <div className="mt-3 text-center">
                  <p className="text-[10px] text-gray-500 typography-small leading-tight">
                    By signing in, you agree to our{" "}
                    <button className="text-emerald-600 hover:text-emerald-700 underline transition-colors">
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button className="text-emerald-600 hover:text-emerald-700 underline transition-colors">
                      Privacy Policy
                    </button>
                  </p>
                </div>
                </div>
              </div>
            </div>

                    {/* Right side - Promotional features - 60% */}
        <div className="hidden lg:flex lg:w-[60%] bg-gradient-to-br from-gray-50 to-gray-100/50 relative h-full lg:h-screen animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
              {/* Subtle background decoration */}
              <div className="absolute inset-0">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-emerald-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-tr from-purple-400/10 to-emerald-400/10 rounded-full blur-3xl"></div>
              </div>

                                  {/* Content */}
          <div className="relative z-10 flex flex-col h-full p-8 lg:p-12 w-full">
            <div className="flex flex-col h-full">
              {/* Welcome message */}
              <div className="mb-6">
                <h2 className="text-2xl lg:text-3xl typography-heading text-gray-900 mb-3 leading-tight">
                  Take control of your{" "}
                  <span className="bg-clip-text text-transparent" style={{
                    backgroundImage: 'linear-gradient(45deg, #059669, #2563eb, #9333ea, #059669)',
                    backgroundSize: '400% 400%',
                    animation: 'gradient 10s ease-in-out infinite'
                  }}>
                    financial future
                  </span>
                </h2>
                <p className="text-base text-gray-600 typography-body">
                  Join thousands of users who trust Exight to manage their expenses, track EMIs, and gain valuable financial insights.
                </p>
              </div>

              {/* Features - Fill remaining space */}
              <div className="flex-1 flex flex-col">
                <PromotionalFeatures className="w-full h-full" />
              </div>
            </div>
          </div>
            </div>
        </div>
    </div>
  );
};

export default Login;
