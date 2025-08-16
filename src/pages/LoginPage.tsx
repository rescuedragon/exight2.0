import { ThemeToggle } from "@/components/ThemeToggle";
import { PromotionalFeatures } from "@/components/PromotionalFeatures";
import { AuthForm } from "@/components/auth/AuthForm";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";

const LoginPage = () => {
  return (
    <div className="min-h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-900/95 dark:to-gray-900 relative">
      {/* Dark mode toggle */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Brand — extreme top-left */}
      <div className="absolute top-6 left-6 z-50 select-none">
        <h1 className="text-[32px] md:text-[36px] leading-none font-extrabold tracking-tight typography-heading">
          <span className="bg-gradient-to-r from-blue-accent via-purple-accent to-emerald-accent bg-clip-text text-transparent animate-gradient-x bg-[length:200%_200%]">Exight</span>
        </h1>
        <p className="mt-1 text-xs md:text-sm text-muted-foreground typography-body">Insights for your expenses.</p>
      </div>

      {/* 40/60 grid that vertically centers both sides - full-bleed width */}
      <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-[2fr_3fr] items-center gap-x-12 px-4 md:px-8">
        {/* Left: Auth (40%) */}
        <div className="flex items-center justify-center py-16 lg:py-0">
          <div className="w-full space-y-5 px-2 sm:px-4 transform origin-center lg:scale-y-125">
            <AuthForm />
            <div className="flex items-center gap-3">
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

        {/* Right: Promo (60%) */}
        <div className="flex flex-col items-center justify-center py-16 lg:py-0 transform origin-center lg:scale-y-125">
          <div className="w-full text-center mb-6 px-2 sm:px-4">
            <h2 className="text-3xl md:text-4xl typography-heading text-foreground">
              Take control of your <span className="gradient-text">financial future</span>
            </h2>
            <p className="mt-3 text-sm md:text-base text-muted-foreground typography-body max-w-2xl mx-auto">
              Join thousands of users who trust Exight to manage their expenses, track EMIs, and gain valuable financial insights.
            </p>
          </div>
          <PromotionalFeatures className="w-full h-full" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

