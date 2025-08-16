import { PromotionalFeatures } from "@/components/PromotionalFeatures";
import { ThemeToggle } from "@/components/ThemeToggle";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-900/95 dark:to-gray-900 overflow-hidden">
      {/* Scaling wrapper for M1 Air and larger screens */}
      <div className="w-full flex justify-center">
        <div className="relative w-full max-w-[1600px] min-h-screen transform-gpu origin-top scale-[0.95] md:scale-100 lg:scale-[1.05] xl:scale-[1.10] 2xl:scale-[1.15]">
          {/* Theme Toggle */}
          <div className="absolute top-6 right-6 z-50">
            <ThemeToggle />
          </div>

          {/* Main Container */}
          <div className="container mx-auto px-4 md:px-6 py-10 md:py-12 min-h-screen flex flex-col items-center justify-center">
            {/* Brand Header */}
            <div className="text-center mb-10 md:mb-12">
              <h1 className="text-[40px] md:text-6xl lg:text-7xl font-bold text-foreground tracking-tight leading-tight mb-3 md:mb-4">
                <span className="bg-gradient-to-r from-blue-accent via-purple-accent to-emerald-accent bg-clip-text text-transparent animate-gradient-x bg-[length:200%_200%]">
                  Exight
                </span>
              </h1>
              <p className="text-lg md:text-2xl text-muted-foreground mb-4 md:mb-6">
                Insights for your expenses.
              </p>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                Take control of your financial future with smart expense tracking, EMI management, and actionable insights.
              </p>
            </div>

            {/* Promotional Features */}
            <div className="w-full max-w-6xl">
              <PromotionalFeatures className="w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
