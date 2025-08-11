import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Eye, EyeOff, Mail, Lock, ArrowRight, TrendingUp, BarChart3, CreditCard, Shield, HandCoins, Users, Calculator, Receipt } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiService } from "@/lib/api";

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (isLogin) {
        // Login flow
        const response = await apiService.login({ email, password });
        // Persist friendly greeting data for dashboard fallback
        try {
          const first = response?.user?.firstName || email.split('@')[0] || 'User';
          if (first) localStorage.setItem('userName', first);
          if (response?.user?.id) localStorage.setItem('userId', String(response.user.id));
          localStorage.setItem('lastLoginDate', new Date().toDateString());
        } catch (localStorageError) {
          console.warn('Failed to save user data to localStorage:', localStorageError);
        }
        // Navigate faster without full reload
        navigate("/", { replace: true });
      } else {
        // Register flow
        const response = await apiService.register({ 
          firstName, 
          lastName, 
          email, 
          password 
        });
        // Persist greeting info
        try {
          const first = response?.user?.firstName || firstName || email.split('@')[0] || 'User';
          if (first) localStorage.setItem('userName', first);
          if (response?.user?.id) localStorage.setItem('userId', String(response.user.id));
          localStorage.setItem('lastLoginDate', new Date().toDateString());
        } catch (localStorageError) {
          console.warn('Failed to save user data to localStorage:', localStorageError);
        }
        // Navigate faster without full reload
        navigate("/", { replace: true });
      }
    } catch (error: unknown) {
      console.error('Auth error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Warm the API on mount to reduce first-request latency
  useEffect(() => {
    void apiService.healthCheck().catch(() => undefined);
  }, []);

  const handleDemoMode = () => {
    try {
      // Set demo mode flag
      localStorage.setItem('demoMode', 'true');
      localStorage.setItem('userName', 'Demo User');
      localStorage.setItem('lastLoginDate', new Date().toDateString());
      
      // Add demo data
      const demoExpenses = [
        {
          id: 'exp_1',
          name: 'Rent',
          amount: 25000,
          currency: 'INR',
          type: 'EMI',
          deductionDay: 1,
          isRecurring: true,
          totalMonths: null,
          remainingMonths: null,
          remainingAmount: null,
          createdAt: new Date(2024, 0, 1),
          partialPayments: []
        },
        {
          id: 'exp_2',
          name: 'Netflix',
          amount: 650,
          currency: 'INR',
          type: 'EMI',
          deductionDay: 5,
          isRecurring: true,
          totalMonths: null,
          remainingMonths: null,
          remainingAmount: null,
          createdAt: new Date(2024, 0, 5),
          partialPayments: []
        }
      ];

      const demoLoans = [
        {
          id: 'loan_1',
          personName: 'Demo User',
          amount: 50000,
          currency: 'INR',
          dateGiven: new Date(2024, 2, 15),
          status: 'active',
          totalReceived: 20000,
          remainingAmount: 30000,
          createdAt: new Date(2024, 2, 15),
          payments: []
        }
      ];

      localStorage.setItem('expenses', JSON.stringify(demoExpenses));
      localStorage.setItem('loans', JSON.stringify(demoLoans));
      
      // Navigate to main app
      window.location.href = "/";
    } catch (error) {
      console.error('Demo mode setup failed:', error);
      setError('Failed to setup demo mode. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-900/95 dark:to-gray-900 overflow-hidden relative" role="main" aria-label="Authentication">
      {/* Brand - Top Left */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed top-6 left-6 z-30 space-y-2"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-foreground tracking-tight leading-tight animate-fade-in-up stagger-1">
          <span className="gradient-text animate-gradient-x">Exight</span>
        </h1>
        <div className="h-1 w-24 bg-gradient-to-r from-blue-accent to-purple-accent rounded-full animate-fade-in-up stagger-2"></div>
        <p className="text-xl md:text-2xl font-bold animate-fade-in-up stagger-3 tracking-wide gradient-text animate-gradient-x">
          Insights for your expenses.
        </p>
      </motion.div>

      {/* Theme Toggle + Try me */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-2">
        <Button
          onClick={handleDemoMode}
          size="sm"
          className="hidden sm:inline-flex items-center gap-2 rounded-full px-4 h-9 border border-white/50 bg-gradient-to-r from-indigo-200 via-purple-200 to-emerald-200 text-foreground shadow-sm hover:shadow-md transition-all"
          title="Preview the app instantly with sample data"
        >
          <span className="inline-block h-2 w-2 rounded-full bg-blue-600 animate-bounce" />
          <span className="font-semibold">Try me</span>
        </Button>
        <ThemeToggle />
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center"
        >
          {/* Demo Mode removed for dev environment to mirror real app */}

          {/* Login/Register Form */}
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-2 border-white/20 shadow-2xl order-2 md:order-1">
            <CardContent className="p-8">
              <div className="text-center mb-4">
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  {isLogin ? "Welcome Back" : "Create Account"}
                </h2>
                <p className="text-muted-foreground">
                  {isLogin ? "Sign in to your account" : "Start managing your expenses"}
                </p>
              </div>

              {/* Subtle feature highlights */}
              <div className="mb-6 grid grid-cols-1 gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 justify-center">
                  <Shield className="h-4 w-4" /> Private & secure
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <BarChart3 className="h-4 w-4" /> Smart analytics & projections
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <HandCoins className="h-4 w-4" /> Track expenses and loans together
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="firstName" className="text-sm font-medium text-foreground">First Name</Label>
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="First Name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-sm font-medium text-foreground">Last Name</Label>
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Last Name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="mt-1"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg transition-all duration-300"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {isLogin ? "Signing In..." : "Creating Account..."}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      {isLogin ? "Sign In" : "Create Account"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  )}
                </Button>
              </form>

              <div className="text-center mt-6">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-600 hover:text-blue-500 text-sm font-medium transition-colors"
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
              </div>
            </CardContent>
          </Card>
          {/* Promo Panel */}
          <div className="order-1 md:order-2">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4">
              Track your <span className="gradient-text">expenses & loans</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl">
              Monitor EMIs, track loans given to friends, and get smart insights to take control of your finances.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-2xl p-5 bg-white/70 dark:bg-gray-900/60 border border-white/30 dark:border-gray-800/60 shadow-sm">
                <div className="flex items-start gap-3">
                  <BarChart3 className="h-5 w-5 text-purple-500" />
                  <div>
                    <div className="font-semibold">EMI & Expense Tracking</div>
                    <div className="text-sm text-muted-foreground">Track annual EMIs and visualize monthly patterns with reminders.</div>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl p-5 bg-white/70 dark:bg-gray-900/60 border border-white/30 dark:border-gray-800/60 shadow-sm">
                <div className="flex items-start gap-3">
                  <HandCoins className="h-5 w-5 text-emerald-500" />
                  <div>
                    <div className="font-semibold">Loan Management</div>
                    <div className="text-sm text-muted-foreground">Manage loans with person-wise history and payment tracking.</div>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl p-5 bg-white/70 dark:bg-gray-900/60 border border-white/30 dark:border-gray-800/60 shadow-sm">
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="font-semibold">Smart Insights & Analytics</div>
                    <div className="text-sm text-muted-foreground">Actionable charts and projections to plan better.</div>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl p-5 bg-white/70 dark:bg-gray-900/60 border border-white/30 dark:border-gray-800/60 shadow-sm">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-indigo-500" />
                  <div>
                    <div className="font-semibold">Secure & Private</div>
                    <div className="text-sm text-muted-foreground">Your financial data stays safe with secure authentication.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login; 