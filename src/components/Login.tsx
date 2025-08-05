import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Eye, EyeOff, Mail, Lock, ArrowRight, TrendingUp, BarChart3, CreditCard, Shield, HandCoins, Users, Calculator, Receipt } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

  // Optimized animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.25,
        ease: "easeOut"
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      // Accept any credentials - no actual authentication
      console.log("Login successful with:", { email, password });
      
      // Set last login date to today
      localStorage.setItem('lastLoginDate', new Date().toDateString());
      
      // Add test data if it doesn't exist
      addTestData();
      
      // Navigate to dashboard
      navigate("/");
    } catch (error: any) {
      console.error("Auth error:", error);
      setError(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const addTestData = () => {
    // Check if test data already exists
    const existingExpenses = localStorage.getItem('expenses');
    const existingLoans = localStorage.getItem('loans');
    
    console.log("Adding test data...");
    console.log("Existing expenses:", existingExpenses);
    console.log("Existing loans:", existingLoans);
    
    if (!existingExpenses) {
      console.log("Adding expense test data...");
      const testExpenses = [
        {
          id: "1",
          name: "Home Loan EMI",
          amount: 45000,
          currency: "INR",
          type: "EMI",
          deductionDay: 5,
          isRecurring: true,
          totalMonths: 240,
          remainingMonths: 180,
          remainingAmount: 8100000,
          createdAt: new Date("2023-01-15"),
          partialPayments: []
        },
        {
          id: "2",
          name: "Car Loan EMI",
          amount: 15000,
          currency: "INR",
          type: "EMI",
          deductionDay: 12,
          isRecurring: true,
          totalMonths: 60,
          remainingMonths: 42,
          remainingAmount: 630000,
          createdAt: new Date("2023-06-20"),
          partialPayments: []
        },
        {
          id: "3",
          name: "Personal Loan EMI",
          amount: 8000,
          currency: "INR",
          type: "EMI",
          deductionDay: 25,
          isRecurring: true,
          totalMonths: 36,
          remainingMonths: 24,
          remainingAmount: 192000,
          createdAt: new Date("2023-09-10"),
          partialPayments: []
        },
        {
          id: "4",
          name: "Netflix Subscription",
          amount: 499,
          currency: "INR",
          type: "Recurring",
          deductionDay: 1,
          isRecurring: true,
          totalMonths: null,
          remainingMonths: null,
          remainingAmount: null,
          createdAt: new Date("2023-12-01"),
          partialPayments: []
        },
        {
          id: "5",
          name: "Gym Membership",
          amount: 2000,
          currency: "INR",
          type: "Recurring",
          deductionDay: 15,
          isRecurring: true,
          totalMonths: null,
          remainingMonths: null,
          remainingAmount: null,
          createdAt: new Date("2023-11-01"),
          partialPayments: []
        },
        {
          id: "6",
          name: "Amazon Prime",
          amount: 1499,
          currency: "INR",
          type: "Recurring",
          deductionDay: 10,
          isRecurring: true,
          totalMonths: null,
          remainingMonths: null,
          remainingAmount: null,
          createdAt: new Date("2023-10-15"),
          partialPayments: []
        },
        {
          id: "7",
          name: "Spotify Premium",
          amount: 119,
          currency: "INR",
          type: "Recurring",
          deductionDay: 20,
          isRecurring: true,
          totalMonths: null,
          remainingMonths: null,
          remainingAmount: null,
          createdAt: new Date("2023-08-01"),
          partialPayments: []
        },
        {
          id: "8",
          name: "Credit Card EMI",
          amount: 3500,
          currency: "INR",
          type: "EMI",
          deductionDay: 28,
          isRecurring: true,
          totalMonths: 12,
          remainingMonths: 8,
          remainingAmount: 28000,
          createdAt: new Date("2024-01-05"),
          partialPayments: []
        },
        {
          id: "9",
          name: "Education Loan EMI",
          amount: 12000,
          currency: "INR",
          type: "EMI",
          deductionDay: 8,
          isRecurring: true,
          totalMonths: 84,
          remainingMonths: 72,
          remainingAmount: 864000,
          createdAt: new Date("2022-06-15"),
          partialPayments: []
        },
        {
          id: "10",
          name: "Bike Loan EMI",
          amount: 6000,
          currency: "INR",
          type: "EMI",
          deductionDay: 18,
          isRecurring: true,
          totalMonths: 36,
          remainingMonths: 30,
          remainingAmount: 180000,
          createdAt: new Date("2023-03-10"),
          partialPayments: []
        },
        {
          id: "11",
          name: "Insurance Premium",
          amount: 3500,
          currency: "INR",
          type: "Recurring",
          deductionDay: 22,
          isRecurring: true,
          totalMonths: null,
          remainingMonths: null,
          remainingAmount: null,
          createdAt: new Date("2023-07-01"),
          partialPayments: []
        },
        {
          id: "12",
          name: "Internet Bill",
          amount: 999,
          currency: "INR",
          type: "Recurring",
          deductionDay: 3,
          isRecurring: true,
          totalMonths: null,
          remainingMonths: null,
          remainingAmount: null,
          createdAt: new Date("2023-05-01"),
          partialPayments: []
        }
      ];
      localStorage.setItem('expenses', JSON.stringify(testExpenses));
      console.log("Expenses saved:", testExpenses.length, "entries");
    }
    
    if (!existingLoans) {
      console.log("Adding loan test data...");
      const testLoans = [
        {
          id: "1",
          personName: "Rahul Sharma",
          amount: 25000,
          currency: "INR",
          dateGiven: new Date("2024-01-15"),
          status: "active",
          totalReceived: 5000,
          remainingAmount: 20000,
          createdAt: new Date("2024-01-15"),
          payments: [
            {
              id: "1",
              amount: 5000,
              date: new Date("2024-02-15"),
              type: "payment",
              notes: "Partial payment"
            }
          ]
        },
        {
          id: "2",
          personName: "Priya Patel",
          amount: 15000,
          currency: "INR",
          dateGiven: new Date("2024-02-01"),
          status: "active",
          totalReceived: 0,
          remainingAmount: 15000,
          createdAt: new Date("2024-02-01"),
          payments: []
        },
        {
          id: "3",
          personName: "Amit Kumar",
          amount: 50000,
          currency: "INR",
          dateGiven: new Date("2023-12-10"),
          status: "active",
          totalReceived: 30000,
          remainingAmount: 20000,
          createdAt: new Date("2023-12-10"),
          payments: [
            {
              id: "2",
              amount: 20000,
              date: new Date("2024-01-10"),
              type: "payment",
              notes: "First installment"
            },
            {
              id: "3",
              amount: 10000,
              date: new Date("2024-02-10"),
              type: "payment",
              notes: "Second installment"
            }
          ]
        },
        {
          id: "4",
          personName: "Neha Singh",
          amount: 10000,
          currency: "INR",
          dateGiven: new Date("2024-03-01"),
          status: "active",
          totalReceived: 0,
          remainingAmount: 10000,
          createdAt: new Date("2024-03-01"),
          payments: []
        },
        {
          id: "5",
          personName: "Vikram Mehta",
          amount: 75000,
          currency: "INR",
          dateGiven: new Date("2023-11-20"),
          status: "active",
          totalReceived: 45000,
          remainingAmount: 30000,
          createdAt: new Date("2023-11-20"),
          payments: [
            {
              id: "4",
              amount: 25000,
              date: new Date("2024-01-20"),
              type: "payment",
              notes: "First payment"
            },
            {
              id: "5",
              amount: 20000,
              date: new Date("2024-02-20"),
              type: "payment",
              notes: "Second payment"
            }
          ]
        },
        {
          id: "6",
          personName: "Sneha Reddy",
          amount: 30000,
          currency: "INR",
          dateGiven: new Date("2024-01-25"),
          status: "active",
          totalReceived: 10000,
          remainingAmount: 20000,
          createdAt: new Date("2024-01-25"),
          payments: [
            {
              id: "6",
              amount: 10000,
              date: new Date("2024-02-25"),
              type: "payment",
              notes: "First payment"
            }
          ]
        },
        {
          id: "7",
          personName: "Arjun Malhotra",
          amount: 45000,
          currency: "INR",
          dateGiven: new Date("2023-10-15"),
          status: "active",
          totalReceived: 30000,
          remainingAmount: 15000,
          createdAt: new Date("2023-10-15"),
          payments: [
            {
              id: "7",
              amount: 15000,
              date: new Date("2023-12-15"),
              type: "payment",
              notes: "First installment"
            },
            {
              id: "8",
              amount: 15000,
              date: new Date("2024-01-15"),
              type: "payment",
              notes: "Second installment"
            }
          ]
        },
        {
          id: "8",
          personName: "Kavya Iyer",
          amount: 8000,
          currency: "INR",
          dateGiven: new Date("2024-02-10"),
          status: "active",
          totalReceived: 0,
          remainingAmount: 8000,
          createdAt: new Date("2024-02-10"),
          payments: []
        },
        {
          id: "9",
          personName: "Rohan Desai",
          amount: 60000,
          currency: "INR",
          dateGiven: new Date("2023-09-05"),
          status: "active",
          totalReceived: 40000,
          remainingAmount: 20000,
          createdAt: new Date("2023-09-05"),
          payments: [
            {
              id: "9",
              amount: 20000,
              date: new Date("2023-11-05"),
              type: "payment",
              notes: "First payment"
            },
            {
              id: "10",
              amount: 20000,
              date: new Date("2024-01-05"),
              type: "payment",
              notes: "Second payment"
            }
          ]
        },
        {
          id: "10",
          personName: "Ananya Gupta",
          amount: 12000,
          currency: "INR",
          dateGiven: new Date("2024-03-05"),
          status: "active",
          totalReceived: 0,
          remainingAmount: 12000,
          createdAt: new Date("2024-03-05"),
          payments: []
        },
        {
          id: "11",
          personName: "Dhruv Kapoor",
          amount: 35000,
          currency: "INR",
          dateGiven: new Date("2023-12-20"),
          status: "active",
          totalReceived: 25000,
          remainingAmount: 10000,
          createdAt: new Date("2023-12-20"),
          payments: [
            {
              id: "11",
              amount: 15000,
              date: new Date("2024-01-20"),
              type: "payment",
              notes: "First payment"
            },
            {
              id: "12",
              amount: 10000,
              date: new Date("2024-02-20"),
              type: "payment",
              notes: "Second payment"
            }
          ]
        },
        {
          id: "12",
          personName: "Zara Khan",
          amount: 18000,
          currency: "INR",
          dateGiven: new Date("2024-01-30"),
          status: "active",
          totalReceived: 6000,
          remainingAmount: 12000,
          createdAt: new Date("2024-01-30"),
          payments: [
            {
              id: "13",
              amount: 6000,
              date: new Date("2024-02-28"),
              type: "payment",
              notes: "Partial payment"
            }
          ]
        }
      ];
      localStorage.setItem('loans', JSON.stringify(testLoans));
      console.log("Loans saved:", testLoans.length, "entries");
    }
  };

  const features = [
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Track Annual EMIs",
      description: "Never miss a payment with smart reminders"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Visualize Monthly Expenses",
      description: "Beautiful charts show your spending patterns"
    },
    {
      icon: <HandCoins className="h-6 w-6" />,
      title: "Manage Loans Given",
      description: "Track money you've lent to friends and family"
    },
    {
      icon: <Calculator className="h-6 w-6" />,
      title: "Smart Payment Tracking",
      description: "Monitor partial payments and outstanding amounts"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Person-wise Loan History",
      description: "Keep track of who owes you what"
    },
    {
      icon: <Receipt className="h-6 w-6" />,
      title: "Payment Receipts",
      description: "Record and track all loan payments received"
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Smart Recurring Insights",
      description: "AI-powered analysis of your spending habits"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure & Private",
      description: "Your financial data stays on your device"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-900/95 dark:to-gray-900 overflow-hidden relative">
      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Main Container */}
      <div className="relative z-40 flex min-h-screen">
        {/* Login Form - Left Side */}
        <div className="w-2/5 flex items-center justify-center p-12 max-lg:w-full max-lg:p-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full max-w-md mx-auto"
          >
            {/* Brand */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="mb-8 text-center"
            >
              <h1 className="text-4xl font-bold text-foreground tracking-tight mb-2">
                <span className="bg-gradient-to-r from-blue-accent via-purple-accent to-emerald-accent bg-clip-text text-transparent animate-gradient-x bg-[length:200%_200%]">
                  Exight
                </span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Insights for your expenses
              </p>
            </motion.div>

            {/* Form Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.15 }}
              className="flex justify-center"
            >
              <div className="w-full max-w-sm rounded-xl bg-white/50 dark:bg-background/40 backdrop-blur-sm border border-border/20 dark:border-border/30 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group-hover:opacity-100 hover:!opacity-100 group-hover:scale-100 hover:!scale-100">
                <CardContent className="p-8">
                  {/* Tab Navigation */}
                  <div className="flex mb-4 bg-muted/30 dark:bg-muted/10 rounded-xl p-1.5">
                    <button
                      onClick={() => setIsLogin(true)}
                      className={`flex-1 py-2.5 px-6 rounded-lg text-sm font-semibold transition-all duration-200 ${
                        isLogin 
                          ? "bg-white dark:bg-accent text-foreground shadow-lg backdrop-blur-sm dark:bg-accent/90 dark:text-accent-foreground" 
                          : "text-muted-foreground hover:text-foreground hover:bg-white/20 dark:hover:bg-accent/30 dark:text-muted-foreground dark:hover:text-foreground"
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => setIsLogin(false)}
                      className={`flex-1 py-2.5 px-6 rounded-lg text-sm font-semibold transition-all duration-200 ${
                        !isLogin 
                          ? "bg-white dark:bg-accent text-foreground shadow-lg backdrop-blur-sm dark:bg-accent/90 dark:text-accent-foreground" 
                          : "text-muted-foreground hover:text-foreground hover:bg-white/20 dark:hover:bg-accent/30 dark:text-muted-foreground dark:hover:text-foreground"
                      }`}
                    >
                      Register
                    </button>
                  </div>

                  {error && (
                    <div className="p-3 text-sm text-red-600 dark:text-red-300 bg-red-50/80 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-800/50 backdrop-blur-sm mb-4">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="firstName" className="text-sm font-semibold text-foreground">First Name</Label>
                          <Input
                            id="firstName"
                            type="text"
                            placeholder="First name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="py-2.5 bg-white/50 dark:bg-muted/20 border-border/30 dark:border-border/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl focus:ring-2 focus:ring-blue-accent/20 focus:border-blue-accent/50 transition-all duration-200 font-medium dark:bg-background/50 dark:border-border/40 dark:focus:ring-blue-accent/30 dark:focus:border-blue-accent/50"
                            required={!isLogin}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="lastName" className="text-sm font-semibold text-foreground">Last Name</Label>
                          <Input
                            id="lastName"
                            type="text"
                            placeholder="Last name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="py-2.5 bg-white/50 dark:bg-muted/20 border-border/30 dark:border-border/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl focus:ring-2 focus:ring-blue-accent/20 focus:border-blue-accent/50 transition-all duration-200 font-medium dark:bg-background/50 dark:border-border/40 dark:focus:ring-blue-accent/30 dark:focus:border-blue-accent/50"
                            required={!isLogin}
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-sm font-semibold text-foreground">Email</Label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-blue-accent transition-colors duration-200" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-12 pr-4 py-2.5 bg-white/50 dark:bg-muted/20 border-border/30 dark:border-border/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl focus:ring-2 focus:ring-blue-accent/20 focus:border-blue-accent/50 transition-all duration-150 font-medium dark:bg-background/50 dark:border-border/40 dark:focus:ring-blue-accent/30 dark:focus:border-blue-accent/50"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label htmlFor="password" className="text-sm font-semibold text-foreground">Password</Label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-blue-accent transition-colors duration-200" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-12 pr-12 py-2.5 bg-white/50 dark:bg-muted/20 border-border/30 dark:border-border/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl focus:ring-2 focus:ring-blue-accent/20 focus:border-blue-accent/50 transition-all duration-150 font-medium dark:bg-background/50 dark:border-border/40 dark:focus:ring-blue-accent/30 dark:focus:border-blue-accent/50"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-600/90 hover:to-purple-600/90 text-white shadow-lg hover:shadow-blue-500/20 dark:shadow-blue-900/50 hover:shadow-blue-500/30 dark:hover:shadow-blue-900/60 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 mt-4"
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                        />
                      ) : (
                        <>
                          {isLogin ? "Sign In" : "Create Account"}
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Promotional Content - Right Side */}
        <div className="w-3/5 flex items-center justify-center p-12 max-lg:hidden">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="max-w-2xl space-y-8"
          >
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.2 }}
              className="text-center space-y-6"
            >
              <h2 className="text-5xl font-bold text-foreground leading-tight">
                Track your{" "}
                <span className="bg-gradient-to-r from-blue-accent via-purple-accent to-emerald-accent bg-clip-text text-transparent animate-gradient-x bg-[length:200%_200%] font-extrabold">
                  expenses & loans
                </span>
              </h2>
              
              <p className="text-xl text-muted-foreground/90 dark:text-muted-foreground/80 max-w-lg mx-auto leading-relaxed">
                Monitor EMIs, track loans given to friends, and get smart insights to take control of your finances.
              </p>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="grid grid-cols-2 gap-6"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2, delay: 0.4 + index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="group h-32"
                >
                  <Card className="backdrop-blur-2xl bg-white/10 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden h-full">
                    <CardContent className="p-6 h-full flex flex-col justify-center">
                      <div className="flex items-center gap-4">
                        <motion.div 
                          className="p-3 rounded-xl bg-gradient-to-br from-blue-accent/20 to-purple-accent/20 text-blue-accent group-hover:scale-105 transition-transform duration-200 flex-shrink-0"
                          whileHover={{ rotate: 2 }}
                        >
                          {feature.icon}
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-foreground text-base mb-1">{feature.title}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Mobile Promotional Section */}
      <div className="lg:hidden mt-8 px-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="space-y-6"
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-foreground leading-tight">
              Track your{" "}
              <span className="bg-gradient-to-r from-blue-accent via-purple-accent to-emerald-accent bg-clip-text text-transparent animate-gradient-x bg-[length:200%_200%]">
                expenses & loans
              </span>
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              Monitor EMIs, track loans given to friends, and get smart insights.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {features.slice(0, 2).map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2, delay: 0.3 + index * 0.05 }}
                whileHover={{ scale: 1.01 }}
                className="group h-24"
              >
                <Card className="backdrop-blur-2xl bg-white/10 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl h-full">
                  <CardContent className="p-4 h-full flex flex-col justify-center">
                    <div className="flex items-center gap-3">
                      <motion.div 
                        className="p-2 rounded-lg bg-gradient-to-br from-blue-accent/20 to-purple-accent/20 text-blue-accent flex-shrink-0"
                        whileHover={{ rotate: 2 }}
                      >
                        {feature.icon}
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground dark:text-foreground/90">{feature.title}</h3>
                        <p className="text-xs text-muted-foreground/90 dark:text-muted-foreground/80 mt-1">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login; 