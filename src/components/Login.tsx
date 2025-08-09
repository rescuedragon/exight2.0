import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [email, setEmail] = useState("demo@exight.com");
  const [password, setPassword] = useState("demo123");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1); // 1: Email & OTP, 2: New Password, 3: Success
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
      if (isLogin) {
        // Login flow
        const response = await apiService.login({ email, password });
        
        // Force full reload so App re-checks auth from token
        window.location.href = "/";
      } else {
        // Register flow
        const response = await apiService.register({ 
          firstName, 
          lastName, 
          email, 
          password 
        });
        
        // Force full reload so App re-checks auth from token
        window.location.href = "/";
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      setError(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotPasswordStep === 1) {
      // Simulate OTP verification
      if (forgotEmail && otp.length === 6) {
        setForgotPasswordStep(2);
      } else {
        alert("Please enter a valid email and 6-digit OTP");
      }
    } else {
      // Handle password reset
      if (newPassword === confirmPassword && newPassword.length >= 6) {
        setForgotPasswordStep(3); // Show success screen
        // Auto close after 2 seconds
        setTimeout(() => {
          setShowForgotPassword(false);
          setForgotPasswordStep(1);
          setForgotEmail("");
          setOtp("");
          setNewPassword("");
          setConfirmPassword("");
        }, 2000);
      } else {
        alert("Passwords don't match or are too short (minimum 6 characters)");
      }
    }
  };

  const closeForgotPassword = () => {
    setShowForgotPassword(false);
    setForgotPasswordStep(1);
    setForgotEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const addDemoData = () => {
    // Create specific demo expenses as requested
    const demoExpenses = [
      // 4 Recurring expenses
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
        name: 'Google Drive',
        amount: 165,
        currency: 'INR',
        type: 'EMI',
        deductionDay: 15,
        isRecurring: true,
        totalMonths: null,
        remainingMonths: null,
        remainingAmount: null,
        createdAt: new Date(2024, 0, 15),
        partialPayments: []
      },
      {
        id: 'exp_3',
        name: 'YouTube Premium',
        amount: 650,
        currency: 'INR',
        type: 'EMI',
        deductionDay: 10,
        isRecurring: true,
        totalMonths: null,
        remainingMonths: null,
        remainingAmount: null,
        createdAt: new Date(2024, 0, 10),
        partialPayments: []
      },
      {
        id: 'exp_4',
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
      },
      // 4 Fixed term expenses
      {
        id: 'exp_5',
        name: 'Home Loan EMI',
        amount: 45000,
        currency: 'INR',
        type: 'EMI',
        deductionDay: 7,
        isRecurring: false,
        totalMonths: 240, // 20 years
        remainingMonths: 180, // 15 years remaining
        remainingAmount: 45000 * 180,
        createdAt: new Date(2019, 5, 1),
        partialPayments: []
      },
      {
        id: 'exp_6',
        name: 'Car Loan EMI',
        amount: 18500,
        currency: 'INR',
        type: 'EMI',
        deductionDay: 12,
        isRecurring: false,
        totalMonths: 60, // 5 years
        remainingMonths: 32, // 2.7 years remaining
        remainingAmount: 18500 * 32,
        createdAt: new Date(2022, 2, 1),
        partialPayments: []
      },
      {
        id: 'exp_7',
        name: 'Education Loan',
        amount: 12000,
        currency: 'INR',
        type: 'Personal Loan',
        deductionDay: 20,
        isRecurring: false,
        totalMonths: 84, // 7 years
        remainingMonths: 45, // 3.75 years remaining
        remainingAmount: 12000 * 45,
        createdAt: new Date(2021, 8, 1),
        partialPayments: []
      },
      {
        id: 'exp_8',
        name: 'MacBook',
        amount: 8500,
        currency: 'INR',
        type: 'Personal Loan',
        deductionDay: 25,
        isRecurring: false,
        totalMonths: 24, // 2 years
        remainingMonths: 8, // 8 months remaining
        remainingAmount: 8500 * 8,
        createdAt: new Date(2023, 3, 1),
        partialPayments: []
      },
      // Additional seasonal expenses to create dynamic graph
      {
        id: 'exp_9',
        name: 'iPhone 16',
        amount: 29500,
        currency: 'INR',
        type: 'EMI',
        deductionDay: 15,
        isRecurring: false,
        totalMonths: 12, // 1 year
        remainingMonths: 8, // 8 months remaining (started in Jan)
        remainingAmount: 29500 * 8,
        createdAt: new Date(2024, 0, 15),
        partialPayments: []
      },
      {
        id: 'exp_10',
        name: 'Summer Vacation',
        amount: 35000,
        currency: 'INR',
        type: 'Personal Loan',
        deductionDay: 1,
        isRecurring: false,
        totalMonths: 6, // 6 months
        remainingMonths: 3, // 3 months remaining (started in Jun)
        remainingAmount: 35000 * 3,
        createdAt: new Date(2024, 5, 1),
        partialPayments: []
      },
      {
        id: 'exp_11',
        name: 'Diwali Shopping',
        amount: 25000,
        currency: 'INR',
        type: 'Personal Loan',
        deductionDay: 10,
        isRecurring: false,
        totalMonths: 4, // 4 months
        remainingMonths: 2, // 2 months remaining (started in Sep)
        remainingAmount: 25000 * 2,
        createdAt: new Date(2024, 8, 10),
        partialPayments: []
      },
      {
        id: 'exp_12',
        name: 'Year-End Bonus Tax',
        amount: 15000,
        currency: 'INR',
        type: 'EMI',
        deductionDay: 31,
        isRecurring: false,
        totalMonths: 3, // 3 months
        remainingMonths: 1, // 1 month remaining (started in Oct)
        remainingAmount: 15000 * 1,
        createdAt: new Date(2024, 9, 31),
        partialPayments: []
      }
    ];

    // Create specific demo loans as requested
    const demoLoans = [
      // 4 Active loans (2 with partial payments)
      {
        id: 'loan_1',
        personName: 'Rahul Sharma',
        amount: 50000,
        currency: 'INR',
        dateGiven: new Date(2024, 2, 15),
        status: 'active',
        totalReceived: 20000, // Partial payment
        remainingAmount: 30000,
        createdAt: new Date(2024, 2, 15),
          payments: [
            {
            id: 'payment_1_1',
            amount: 15000,
            date: new Date(2024, 4, 10),
            type: 'payment' as const,
            description: 'First installment'
          },
          {
            id: 'payment_1_2',
              amount: 5000,
            date: new Date(2024, 6, 5),
            type: 'payment' as const,
            description: 'Partial payment'
            }
          ]
        },
        {
        id: 'loan_2',
        personName: 'Priya Patel',
        amount: 75000,
        currency: 'INR',
        dateGiven: new Date(2024, 1, 20),
        status: 'active',
        totalReceived: 35000, // Partial payment
        remainingAmount: 40000,
        createdAt: new Date(2024, 1, 20),
          payments: [
            {
            id: 'payment_2_1',
            amount: 25000,
            date: new Date(2024, 3, 15),
            type: 'payment' as const,
            description: 'First payment'
          },
          {
            id: 'payment_2_2',
              amount: 10000,
            date: new Date(2024, 5, 20),
            type: 'payment' as const,
            description: 'Second payment'
            }
          ]
        },
        {
        id: 'loan_3',
        personName: 'Amit Kumar',
        amount: 25000,
        currency: 'INR',
        dateGiven: new Date(2024, 4, 10),
        status: 'active',
          totalReceived: 0,
        remainingAmount: 25000,
        createdAt: new Date(2024, 4, 10),
          payments: []
        },
        {
        id: 'loan_4',
        personName: 'Sneha Singh',
        amount: 40000,
        currency: 'INR',
        dateGiven: new Date(2024, 3, 5),
        status: 'active',
        totalReceived: 0,
        remainingAmount: 40000,
        createdAt: new Date(2024, 3, 5),
        payments: []
      },
      // 4 Completed loans (2 written off)
      {
        id: 'loan_5',
        personName: 'Vikram Gupta',
          amount: 30000,
        currency: 'INR',
        dateGiven: new Date(2023, 8, 15),
        status: 'completed',
          totalReceived: 30000,
        remainingAmount: 0,
        createdAt: new Date(2023, 8, 15),
          payments: [
            {
            id: 'payment_5_1',
            amount: 30000,
            date: new Date(2024, 1, 10),
            type: 'payment' as const,
            description: 'Full payment'
            }
          ]
        },
        {
        id: 'loan_6',
        personName: 'Kavya Reddy',
        amount: 20000,
        currency: 'INR',
        dateGiven: new Date(2023, 10, 20),
        status: 'completed',
        totalReceived: 20000,
        remainingAmount: 0,
        createdAt: new Date(2023, 10, 20),
          payments: [
            {
            id: 'payment_6_1',
            amount: 10000,
            date: new Date(2024, 0, 15),
            type: 'payment' as const,
            description: 'First installment'
          },
          {
            id: 'payment_6_2',
            amount: 10000,
            date: new Date(2024, 2, 20),
            type: 'payment' as const,
            description: 'Final payment'
            }
          ]
        },
        {
        id: 'loan_7',
        personName: 'Arjun Nair',
          amount: 35000,
        currency: 'INR',
        dateGiven: new Date(2023, 6, 10),
        status: 'written-off',
        totalReceived: 10000,
        remainingAmount: 25000,
        writeOffDate: new Date(2024, 5, 15),
        createdAt: new Date(2023, 6, 10),
          payments: [
            {
            id: 'payment_7_1',
              amount: 10000,
            date: new Date(2023, 9, 5),
            type: 'payment' as const,
            description: 'Partial payment before write-off'
            }
          ]
        },
        {
        id: 'loan_8',
        personName: 'Meera Joshi',
        amount: 15000,
        currency: 'INR',
        dateGiven: new Date(2023, 5, 25),
        status: 'written-off',
        totalReceived: 0,
        remainingAmount: 15000,
        writeOffDate: new Date(2024, 4, 30),
        createdAt: new Date(2023, 5, 25),
        payments: []
      }
    ];

    localStorage.setItem('expenses', JSON.stringify(demoExpenses));
    localStorage.setItem('loans', JSON.stringify(demoLoans));
    
    console.log('Demo data loaded: 8 expenses (4 recurring, 4 fixed-term), 8 loans (4 active, 4 completed)');
    console.log('Saved expenses to localStorage:', demoExpenses);
    console.log('Saved loans to localStorage:', demoLoans);
  };


  const features = [
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "EMI & Expense Tracking",
      description: "Track annual EMIs and visualize monthly spending patterns with smart reminders"
    },
    {
      icon: <HandCoins className="h-6 w-6" />,
      title: "Loan Management",
      description: "Manage loans given to friends with person-wise history and payment tracking"
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Smart Insights & Analytics",
      description: "AI-powered analysis of spending habits with detailed payment receipts"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure & Private",
      description: "Your financial data stays completely secure on your device"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-900/95 dark:to-gray-900 overflow-hidden relative">
      {/* Brand - Top Left */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed top-6 left-6 z-30 space-y-2"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-foreground tracking-tight leading-tight animate-fade-in-up stagger-1">
          <span 
            className="animate-gradient-x"
            style={{
              background: 'linear-gradient(90deg, #3B82F6, #8B5CF6, #0D9F73, #3B82F6, #8B5CF6, #0D9F73, #3B82F6)',
              backgroundSize: '400% 400%',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Exight
          </span>
        </h1>
        <div className="h-1 w-24 bg-gradient-to-r from-blue-accent to-purple-accent rounded-full animate-fade-in-up stagger-2"></div>
        <p 
          className="text-xl md:text-2xl font-bold animate-fade-in-up stagger-3 tracking-wide animate-gradient-x"
          style={{
            background: 'linear-gradient(90deg, #3B82F6, #8B5CF6, #0D9F73, #3B82F6, #8B5CF6, #0D9F73, #3B82F6)',
            backgroundSize: '400% 400%',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Insights for your expenses.
        </p>
      </motion.div>

      {/* Theme Toggle and Try Me Button */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
        <button
          onClick={() => {
            console.log("Try me button clicked - setting up demo mode");
            
            // Set demo mode flag
            localStorage.setItem('demoMode', 'true');
            localStorage.setItem('userName', 'Demo User');
            localStorage.setItem('lastLoginDate', new Date().toDateString());
            
            console.log("Demo mode set, adding demo data...");
            console.log("localStorage demoMode:", localStorage.getItem('demoMode'));
            console.log("localStorage lastLoginDate:", localStorage.getItem('lastLoginDate'));
            
            // Add complete demo data directly
            const demoExpenses = [
              // 4 Recurring expenses
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
                name: 'Google Drive',
                amount: 165,
                currency: 'INR',
                type: 'EMI',
                deductionDay: 15,
                isRecurring: true,
                totalMonths: null,
                remainingMonths: null,
                remainingAmount: null,
                createdAt: new Date(2024, 0, 15),
                partialPayments: []
              },
              {
                id: 'exp_3',
                name: 'YouTube Premium',
                amount: 650,
                currency: 'INR',
                type: 'EMI',
                deductionDay: 10,
                isRecurring: true,
                totalMonths: null,
                remainingMonths: null,
                remainingAmount: null,
                createdAt: new Date(2024, 0, 10),
                partialPayments: []
              },
              {
                id: 'exp_4',
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
              },
              // 4 Fixed term expenses
              {
                id: 'exp_5',
                name: 'Home Loan EMI',
                amount: 45000,
                currency: 'INR',
                type: 'EMI',
                deductionDay: 7,
                isRecurring: false,
                totalMonths: 240, // 20 years
                remainingMonths: 180, // 15 years remaining
                remainingAmount: 45000 * 180,
                createdAt: new Date(2019, 5, 1),
                partialPayments: []
              },
              {
                id: 'exp_6',
                name: 'Car Loan EMI',
                amount: 18500,
                currency: 'INR',
                type: 'EMI',
                deductionDay: 12,
                isRecurring: false,
                totalMonths: 60, // 5 years
                remainingMonths: 32, // 2.7 years remaining
                remainingAmount: 18500 * 32,
                createdAt: new Date(2022, 2, 1),
                partialPayments: []
              },
              {
                id: 'exp_7',
                name: 'Education Loan',
                amount: 12000,
                currency: 'INR',
                type: 'Personal Loan',
                deductionDay: 20,
                isRecurring: false,
                totalMonths: 84, // 7 years
                remainingMonths: 45, // 3.75 years remaining
                remainingAmount: 12000 * 45,
                createdAt: new Date(2021, 8, 1),
                partialPayments: []
              },
              {
                id: 'exp_8',
                name: 'MacBook',
                amount: 8500,
                currency: 'INR',
                type: 'Personal Loan',
                deductionDay: 25,
                isRecurring: false,
                totalMonths: 24, // 2 years
                remainingMonths: 8, // 8 months remaining
                remainingAmount: 8500 * 8,
                createdAt: new Date(2023, 3, 1),
                partialPayments: []
              },
              // Additional seasonal expenses to create dynamic graph
              {
                id: 'exp_9',
                name: 'iPhone 16',
                amount: 29500,
                currency: 'INR',
                type: 'EMI',
                deductionDay: 15,
                isRecurring: false,
                totalMonths: 12, // 1 year
                remainingMonths: 8, // 8 months remaining (started in Jan)
                remainingAmount: 29500 * 8,
                createdAt: new Date(2024, 0, 15),
                partialPayments: []
              },
              {
                id: 'exp_10',
                name: 'Summer Vacation',
                amount: 35000,
                currency: 'INR',
                type: 'Personal Loan',
                deductionDay: 1,
                isRecurring: false,
                totalMonths: 6, // 6 months
                remainingMonths: 3, // 3 months remaining (started in Jun)
                remainingAmount: 35000 * 3,
                createdAt: new Date(2024, 5, 1),
                partialPayments: []
              },
              {
                id: 'exp_11',
                name: 'Diwali Shopping',
                amount: 25000,
                currency: 'INR',
                type: 'Personal Loan',
                deductionDay: 10,
                isRecurring: false,
                totalMonths: 4, // 4 months
                remainingMonths: 2, // 2 months remaining (started in Sep)
                remainingAmount: 25000 * 2,
                createdAt: new Date(2024, 8, 10),
                partialPayments: []
              },
              {
                id: 'exp_12',
                name: 'Year-End Bonus Tax',
                amount: 15000,
                currency: 'INR',
                type: 'EMI',
                deductionDay: 31,
                isRecurring: false,
                totalMonths: 3, // 3 months
                remainingMonths: 1, // 1 month remaining (started in Oct)
                remainingAmount: 15000 * 1,
                createdAt: new Date(2024, 9, 31),
                partialPayments: []
              }
            ];

            const demoLoans = [
              // 4 Active loans (2 with partial payments)
              {
                id: 'loan_1',
                personName: 'Rahul Sharma',
                amount: 50000,
                currency: 'INR',
                dateGiven: new Date(2024, 2, 15),
                status: 'active',
                totalReceived: 20000, // Partial payment
                remainingAmount: 30000,
                createdAt: new Date(2024, 2, 15),
                payments: [
                  {
                    id: 'payment_1_1',
                    amount: 15000,
                    date: new Date(2024, 4, 10),
                    type: 'payment' as const,
                    description: 'First installment'
                  },
                  {
                    id: 'payment_1_2',
                    amount: 5000,
                    date: new Date(2024, 6, 5),
                    type: 'payment' as const,
                    description: 'Partial payment'
                  }
                ]
              },
              {
                id: 'loan_2',
                personName: 'Priya Patel',
                amount: 75000,
                currency: 'INR',
                dateGiven: new Date(2024, 1, 20),
                status: 'active',
                totalReceived: 35000, // Partial payment
                remainingAmount: 40000,
                createdAt: new Date(2024, 1, 20),
                payments: [
                  {
                    id: 'payment_2_1',
                    amount: 25000,
                    date: new Date(2024, 3, 15),
                    type: 'payment' as const,
                    description: 'First payment'
                  },
                  {
                    id: 'payment_2_2',
                    amount: 10000,
                    date: new Date(2024, 5, 20),
                    type: 'payment' as const,
                    description: 'Second payment'
                  }
                ]
              },
              {
                id: 'loan_3',
                personName: 'Amit Kumar',
                amount: 25000,
                currency: 'INR',
                dateGiven: new Date(2024, 4, 10),
                status: 'active',
                totalReceived: 0,
                remainingAmount: 25000,
                createdAt: new Date(2024, 4, 10),
                payments: []
              },
              {
                id: 'loan_4',
                personName: 'Sneha Singh',
                amount: 40000,
                currency: 'INR',
                dateGiven: new Date(2024, 3, 5),
                status: 'active',
                totalReceived: 0,
                remainingAmount: 40000,
                createdAt: new Date(2024, 3, 5),
                payments: []
              },
              // 4 Completed loans (2 written off)
              {
                id: 'loan_5',
                personName: 'Vikram Gupta',
                amount: 30000,
                currency: 'INR',
                dateGiven: new Date(2023, 8, 15),
                status: 'completed',
                totalReceived: 30000,
                remainingAmount: 0,
                createdAt: new Date(2023, 8, 15),
                payments: [
                  {
                    id: 'payment_5_1',
                    amount: 30000,
                    date: new Date(2024, 1, 10),
                    type: 'payment' as const,
                    description: 'Full payment'
                  }
                ]
              },
              {
                id: 'loan_6',
                personName: 'Kavya Reddy',
                amount: 20000,
                currency: 'INR',
                dateGiven: new Date(2023, 10, 20),
                status: 'completed',
                totalReceived: 20000,
                remainingAmount: 0,
                createdAt: new Date(2023, 10, 20),
                payments: [
                  {
                    id: 'payment_6_1',
                    amount: 10000,
                    date: new Date(2024, 0, 15),
                    type: 'payment' as const,
                    description: 'First installment'
                  },
                  {
                    id: 'payment_6_2',
                    amount: 10000,
                    date: new Date(2024, 2, 20),
                    type: 'payment' as const,
                    description: 'Final payment'
                  }
                ]
              },
              {
                id: 'loan_7',
                personName: 'Arjun Nair',
                amount: 35000,
                currency: 'INR',
                dateGiven: new Date(2023, 6, 10),
                status: 'written-off',
                totalReceived: 10000,
                remainingAmount: 25000,
                writeOffDate: new Date(2024, 5, 15),
                createdAt: new Date(2023, 6, 10),
                payments: [
                  {
                    id: 'payment_7_1',
                    amount: 10000,
                    date: new Date(2023, 9, 5),
                    type: 'payment' as const,
                    description: 'Partial payment before write-off'
                  }
                ]
              },
              {
                id: 'loan_8',
                personName: 'Meera Joshi',
                amount: 15000,
                currency: 'INR',
                dateGiven: new Date(2023, 5, 25),
                status: 'written-off',
                totalReceived: 0,
                remainingAmount: 15000,
                writeOffDate: new Date(2024, 4, 30),
                createdAt: new Date(2023, 5, 25),
                payments: []
              }
            ];

            localStorage.setItem('expenses', JSON.stringify(demoExpenses));
            localStorage.setItem('loans', JSON.stringify(demoLoans));
            
            console.log("Demo data added, reloading to dashboard...");
            
            // Force page reload to trigger authentication check
            window.location.href = "/";
          }}
          className="group px-4 py-2 text-sm font-medium text-muted-foreground/60 hover:text-transparent bg-white/20 hover:bg-white/40 dark:bg-background/20 dark:hover:bg-background/40 backdrop-blur-sm border border-white/30 dark:border-border/30 rounded-3xl transition-all duration-300 hover:scale-105 hover:shadow-lg relative overflow-hidden"
        >
          <span className="relative z-10 group-hover:bg-gradient-to-r group-hover:from-blue-accent group-hover:via-purple-accent group-hover:to-emerald-accent group-hover:bg-clip-text group-hover:text-transparent group-hover:animate-gradient-x group-hover:bg-[length:200%_200%] transition-all duration-300">
            Try me
          </span>
        </button>
        <ThemeToggle />
      </div>

      {/* Main Container */}
      <div className="relative z-40 flex min-h-screen">
        {/* Login Form - Left Side */}
        <div className="w-2/5 flex flex-col justify-start items-center pt-48 p-16 max-lg:w-full max-lg:p-8 max-lg:pt-36">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full max-w-lg mx-auto flex flex-col items-center"
          >


            {/* Form Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.15 }}
              className="flex justify-start"
            >
              <div className="w-[450px] rounded-3xl bg-white/80 dark:bg-background/60 backdrop-blur-xl border border-white/30 dark:border-border/40 shadow-2xl">
                <CardContent className="p-10">
                  {/* Tab Navigation */}
                  <div className="flex mb-8 bg-gradient-to-r from-muted/40 to-muted/20 dark:from-muted/20 dark:to-muted/10 rounded-3xl p-2 backdrop-blur-sm">
                    <button
                      onClick={() => setIsLogin(true)}
                      className={`flex-1 py-3 px-8 rounded-3xl text-base font-bold transition-all duration-300 ${isLogin
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl transform scale-105"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/30 dark:hover:bg-accent/40 hover:scale-102"
                        }`}
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => setIsLogin(false)}
                      className={`flex-1 py-3 px-8 rounded-3xl text-base font-bold transition-all duration-300 ${!isLogin
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl transform scale-105"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/30 dark:hover:bg-accent/40 hover:scale-102"
                        }`}
                    >
                      Register
                    </button>
                  </div>

                  {error && (
                    <div className="p-3 text-sm text-red-600 dark:text-red-300 bg-red-50/80 dark:bg-red-900/30 rounded-2xl border border-red-200 dark:border-red-800/50 backdrop-blur-sm mb-4">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6 min-h-[280px]">
                    <AnimatePresence mode="wait">
                      {!isLogin && (
                        <motion.div
                          key="name-fields"
                          initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                          animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          style={{ overflow: "hidden" }}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="firstName" className="text-base font-bold text-foreground">First Name</Label>
                              <Input
                                id="firstName"
                                type="text"
                                placeholder="Enter first name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="py-4 px-4 text-base bg-white/70 dark:bg-background/70 border-2 border-border/40 dark:border-border/60 focus-visible:ring-4 focus-visible:ring-blue-accent/20 focus-visible:ring-offset-0 rounded-2xl focus:border-blue-accent/70 transition-all duration-300 font-medium"
                                required={!isLogin}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="lastName" className="text-base font-bold text-foreground">Last Name</Label>
                              <Input
                                id="lastName"
                                type="text"
                                placeholder="Enter last name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="py-4 px-4 text-base bg-white/70 dark:bg-background/70 border-2 border-border/40 dark:border-border/60 focus-visible:ring-4 focus-visible:ring-blue-accent/20 focus-visible:ring-offset-0 rounded-2xl focus:border-blue-accent/70 transition-all duration-300 font-medium"
                                required={!isLogin}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-base font-bold text-foreground">Email Address</Label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground group-focus-within:text-blue-accent transition-colors duration-300" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-14 pr-4 py-4 text-base bg-white/70 dark:bg-background/70 border-2 border-border/40 dark:border-border/60 focus-visible:ring-4 focus-visible:ring-blue-accent/20 focus-visible:ring-offset-0 rounded-2xl focus:border-blue-accent/70 transition-all duration-300 font-medium"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-base font-bold text-foreground">Password</Label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground group-focus-within:text-blue-accent transition-colors duration-300" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-14 pr-14 py-4 text-base bg-white/70 dark:bg-background/70 border-2 border-border/40 dark:border-border/60 focus-visible:ring-4 focus-visible:ring-blue-accent/20 focus-visible:ring-offset-0 rounded-2xl focus:border-blue-accent/70 transition-all duration-300 font-medium"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-blue-accent transition-colors duration-300 p-1"
                        >
                          {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                        </button>
                      </div>
                    </div>

                    {/* Forgot Password - Only show in Sign In mode */}
                    {isLogin && (
                      <div className="text-right">
                        <button
                          type="button"
                          className="text-sm text-blue-accent hover:text-blue-accent/80 transition-colors duration-200 font-medium"
                          onClick={() => setShowForgotPassword(true)}
                        >
                          Forgot Password?
                        </button>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full group bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 hover:from-blue-500 hover:via-blue-600 hover:to-purple-500 text-white font-bold text-lg py-4 px-8 shadow-2xl hover:shadow-blue-500/30 dark:shadow-blue-900/50 hover:shadow-blue-500/40 dark:hover:shadow-blue-900/70 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 mt-8 rounded-3xl"
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
                <span 
                  className="animate-gradient-x font-extrabold"
                  style={{
                    background: 'linear-gradient(90deg, #3B82F6, #8B5CF6, #0D9F73, #3B82F6, #8B5CF6, #0D9F73, #3B82F6)',
                    backgroundSize: '400% 400%',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
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
                  <Card className="backdrop-blur-2xl bg-white/10 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden h-full">
                    <CardContent className="p-6 h-full flex flex-col justify-center">
                      <div className="flex items-center gap-4">
                        <motion.div
                          className="p-3 rounded-2xl bg-gradient-to-br from-blue-accent/20 to-purple-accent/20 text-blue-accent group-hover:scale-105 transition-transform duration-200 flex-shrink-0"
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
              <span 
                className="animate-gradient-x"
                style={{
                  background: 'linear-gradient(90deg, #3B82F6, #8B5CF6, #0D9F73, #3B82F6, #8B5CF6, #0D9F73, #3B82F6)',
                  backgroundSize: '400% 400%',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  WebkitTextFillColor: 'transparent'
                }}
              >
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
                <Card className="backdrop-blur-2xl bg-white/10 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-3xl h-full">
                  <CardContent className="p-4 h-full flex flex-col justify-center">
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="p-2 rounded-xl bg-gradient-to-br from-blue-accent/20 to-purple-accent/20 text-blue-accent flex-shrink-0"
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

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotPassword && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={closeForgotPassword}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-md bg-white/90 dark:bg-background/90 backdrop-blur-xl border border-white/30 dark:border-border/40 rounded-3xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                {forgotPasswordStep === 3 ? (
                  // Success Screen
                  <div className="text-center py-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
                      className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center"
                    >
                      <motion.svg
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="w-10 h-10 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <motion.path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </motion.svg>
                    </motion.div>
                    <motion.h2
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-2xl font-bold text-foreground mb-2"
                    >
                      Password Reset Successful!
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-muted-foreground"
                    >
                      Your password has been updated successfully
                    </motion.p>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-foreground mb-2">
                        {forgotPasswordStep === 1 ? "Reset Password" : "Create New Password"}
                      </h2>
                      <p className="text-muted-foreground">
                        {forgotPasswordStep === 1 
                          ? "Enter your email and the OTP sent to you" 
                          : "Enter your new password"}
                      </p>
                    </div>

                <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
                  {forgotPasswordStep === 1 ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="forgotEmail" className="text-base font-bold text-foreground">Email Address</Label>
                        <Input
                          id="forgotEmail"
                          type="email"
                          placeholder="Enter your email address"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          className="py-4 px-4 text-base bg-white/70 dark:bg-background/70 border-2 border-border/40 dark:border-border/60 focus-visible:ring-4 focus-visible:ring-blue-accent/20 focus-visible:ring-offset-0 rounded-2xl focus:border-blue-accent/70 transition-all duration-300 font-medium"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="otp" className="text-base font-bold text-foreground">6-Digit OTP</Label>
                        <Input
                          id="otp"
                          type="text"
                          placeholder="Enter 6-digit OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          className="py-4 px-4 text-base bg-white/70 dark:bg-background/70 border-2 border-border/40 dark:border-border/60 focus-visible:ring-4 focus-visible:ring-blue-accent/20 focus-visible:ring-offset-0 rounded-2xl focus:border-blue-accent/70 transition-all duration-300 font-medium text-center text-2xl tracking-widest"
                          maxLength={6}
                          required
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-base font-bold text-foreground">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          placeholder="Enter new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="py-4 px-4 text-base bg-white/70 dark:bg-background/70 border-2 border-border/40 dark:border-border/60 focus-visible:ring-4 focus-visible:ring-blue-accent/20 focus-visible:ring-offset-0 rounded-2xl focus:border-blue-accent/70 transition-all duration-300 font-medium"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-base font-bold text-foreground">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="py-4 px-4 text-base bg-white/70 dark:bg-background/70 border-2 border-border/40 dark:border-border/60 focus-visible:ring-4 focus-visible:ring-blue-accent/20 focus-visible:ring-offset-0 rounded-2xl focus:border-blue-accent/70 transition-all duration-300 font-medium"
                          required
                        />
                      </div>
                    </>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      onClick={closeForgotPassword}
                      className="flex-1 py-4 px-6 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold text-base rounded-3xl transition-all duration-300"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 py-4 px-6 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 hover:from-blue-500 hover:via-blue-600 hover:to-purple-500 text-white font-bold text-base rounded-3xl shadow-xl transition-all duration-300"
                    >
                      {forgotPasswordStep === 1 ? "Verify OTP" : "Reset Password"}
                    </Button>
                  </div>
                </form>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login; 