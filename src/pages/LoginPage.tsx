import { ThemeToggle } from "@/components/ThemeToggle";
import { PromotionalFeatures } from "@/components/PromotionalFeatures";
import { AuthForm } from "@/components/auth/AuthForm";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import ScreenScale from "@/components/ScreenScale";

const LoginPage = () => {
  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-900/95 dark:to-gray-900">
      {/* Dark mode toggle */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Scaling wrapper for entire page */}
      <div className="h-full w-full flex items-center justify-center">
        <ScreenScale className="w-full">
          <div className="mx-auto max-w-[1400px] h-[700px] flex items-stretch justify-center">
            {/* 40/60 split container */}
            <div className="w-full h-full flex items-stretch justify-center">
              {/* Left: Auth 40% */}
              <div className="w-[40%] h-full flex items-stretch justify-start">
                <div className="w-full max-w-[520px] h-full pl-6 pr-6 pt-6 flex flex-col">
                  {/* Brand (pinned top-left) */}
                  <div className="text-left">
                    <h1 className="text-[44px] leading-none font-extrabold tracking-tight typography-heading">
                      <span className="bg-gradient-to-r from-blue-accent via-purple-accent to-emerald-accent bg-clip-text text-transparent animate-gradient-x bg-[length:200%_200%]">Exight</span>
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground typography-body">Insights for your expenses.</p>
                  </div>

                  {/* Centered block: Tabs + Form + Divider + Google + Terms */}
                  <div className="flex-1 flex items-center">
                    <div className="w-full space-y-4">
                      <AuthForm />
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 border-t border-gray-200 dark:border-gray-800"></div>
                        <span className="text-xs text-gray-500 typography-small">or</span>
                        <div className="flex-1 border-t border-gray-200 dark:border-gray-800"></div>
                      </div>
                      <GoogleAuthButton />
                      <p className="text-[11px] text-gray-500 typography-small text-center leading-tight">
                        By signing in, you agree to our <button className="text-emerald-600 hover:text-emerald-700 underline">Terms of Service</button> and <button className="text-emerald-600 hover:text-emerald-700 underline">Privacy Policy</button>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Promo 60% */}
              <div className="w-[60%] h-full flex items-center justify-center px-8">
                <div className="w-full max-w-[760px] h-full flex flex-col">
                  <div className="mb-4 text-center">
                    <h2 className="text-3xl md:text-4xl typography-heading text-foreground">
                      Take control of your <span className="gradient-text">financial future</span>
                    </h2>
                    <p className="mt-3 text-sm md:text-base text-muted-foreground typography-body max-w-2xl mx-auto">
                      Join thousands of users who trust Exight to manage their expenses, track EMIs, and gain valuable financial insights.
                    </p>
                  </div>
                  <div className="flex-1">
                    <PromotionalFeatures className="h-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScreenScale>
      </div>
    </div>
  );
};

export default LoginPage;

