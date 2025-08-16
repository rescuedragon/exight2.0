import { PromotionalFeatures } from "@/components/PromotionalFeatures";
import { ThemeToggle } from "@/components/ThemeToggle";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-900/95 dark:to-gray-900 overflow-hidden relative">
      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Main Container */}
      <div className="container mx-auto px-4 py-12 min-h-screen flex flex-col items-center justify-center">
        {/* Brand Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-7xl font-bold text-foreground tracking-tight leading-tight mb-4">
            <span className="bg-gradient-to-r from-blue-accent via-purple-accent to-emerald-accent bg-clip-text text-transparent animate-gradient-x bg-[length:200%_200%]">
              Exight
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-6">
            Insights for your expenses.
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Take control of your financial future with smart expense tracking, EMI management, and actionable insights.
          </p>
        </div>

        {/* Promotional Features */}
        <div className="w-full max-w-6xl">
          <PromotionalFeatures className="w-full" />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
