import React, { useState, useEffect, useRef, Suspense, useMemo, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { InfoBar } from "@/components/InfoBar";
import { ExpenseDashboard } from "@/components/ExpenseDashboard";
import { LoansDashboard } from "@/components/LoansDashboard";
import { DetailedView } from "@/components/DetailedView";
import { MonthlyExpensesModal } from "@/components/MonthlyExpensesModal";
import { ActiveExpensesModal } from "@/components/ActiveExpensesModal";
import { ExpenseHistory } from "@/components/ExpenseHistory";
import { LoanDetailedView } from "@/components/LoanDetailedView";
import { AddExpenseModal } from "@/components/AddExpenseModal";
import { AddLoanModal } from "@/components/AddLoanModal";
import { YearlyProjectionModal } from "@/components/YearlyProjectionModal";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useModal } from "@/contexts/ModalContext";
import { useNavigate } from "react-router-dom";
import { apiService } from "@/lib/api";
import { 
  Wallet, 
  HandCoins, 
  BarChart3, 
  Eye, 
  EyeOff, 
  LogOut,
  Calendar,
  TrendingUp,
  History,
  Users,
  Settings,
  Play,
  TestTube,
  Target,
  ArrowRight,
  Plus,
  X,
  CheckCircle,
  AlertTriangle,
  Clock
} from "lucide-react";
import { Expense } from "@/types/expense";
import { Loan } from "@/types/loan";
import { LoansInfoBar } from "@/components/LoansInfoBar";

// Try Me Component with hardcoded demo data
const TryMe = memo(() => {
  const navigate = useNavigate();
  const { isAnyModalOpen, openModal, closeModal } = useModal();
  
  // State variables
  const [activeTab, setActiveTab] = useState('expenses');
  const [isPrivacyMode, setIsPrivacyMode] = useState(false);
  const [showDetailedView, setShowDetailedView] = useState(false);
  
  // Hardcoded demo data
  const demoExpenses: Expense[] = [
    // 4 Recurring expenses
    {
      id: 'exp_1',
      name: 'Rent',
      amount: 25000,
      currency: 'INR' as const,
      type: 'EMI' as const,
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
      currency: 'INR' as const,
      type: 'EMI' as const,
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
      currency: 'INR' as const,
      type: 'EMI' as const,
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
      currency: 'INR' as const,
      type: 'EMI' as const,
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
      currency: 'INR' as const,
      type: 'EMI' as const,
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
      currency: 'INR' as const,
      type: 'EMI' as const,
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
      currency: 'INR' as const,
      type: 'Personal Loan' as const,
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
      currency: 'INR' as const,
      type: 'Personal Loan' as const,
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
      currency: 'INR' as const,
      type: 'EMI' as const,
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
      currency: 'INR' as const,
      type: 'Personal Loan' as const,
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
      currency: 'INR' as const,
      type: 'Personal Loan' as const,
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
      currency: 'INR' as const,
      type: 'EMI' as const,
      deductionDay: 31,
      isRecurring: false,
      totalMonths: 3, // 3 months
      remainingMonths: 1, // 1 month remaining (started in Oct)
      remainingAmount: 15000 * 1,
      createdAt: new Date(2024, 9, 31),
      partialPayments: []
    }
  ];

  const demoLoans: Loan[] = [
    // 4 Active loans (2 with partial payments)
    {
      id: 'loan_1',
      personName: 'Rahul Sharma',
      amount: 50000,
      currency: 'INR',
      dateGiven: new Date(2024, 2, 15),
      status: 'active' as const,
      totalReceived: 20000,
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
      status: 'active' as const,
      totalReceived: 35000,
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
      status: 'active' as const,
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
      status: 'active' as const,
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
      status: 'completed' as const,
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
      status: 'completed' as const,
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
      status: 'written-off' as const,
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
      status: 'written-off' as const,
      totalReceived: 0,
      remainingAmount: 15000,
      writeOffDate: new Date(2024, 4, 30),
      createdAt: new Date(2023, 5, 25),
      payments: []
    }
  ];

  // Memoized data filtering
  const { activeExpenses, recurringExpenses, fixedTimeExpenses } = useMemo(() => {
    const activeExpenses = demoExpenses.filter(expense => {
      // Show recurring expenses always
      if (expense.isRecurring) {
        return true;
      }

      // For non-recurring expenses, be more permissive - show if:
      // 1. Has remaining months > 0, OR
      // 2. Has remaining amount > 0, OR  
      // 3. Has total months (new expense), OR
      // 4. No remaining data but has total months (newly created)
      const hasRemainingMonths = expense.remainingMonths && expense.remainingMonths > 0;
      const hasRemainingAmount = expense.remainingAmount && expense.remainingAmount > 0;
      const hasTotalMonths = expense.totalMonths && expense.totalMonths > 0;
      const isNewExpense = hasTotalMonths && (!expense.remainingMonths || expense.remainingMonths > 0);
      
      const isActive = hasRemainingMonths || hasRemainingAmount || isNewExpense;
      return isActive;
    });

    const recurringExpenses = activeExpenses.filter(expense => expense.isRecurring);
    const fixedTimeExpenses = activeExpenses.filter(expense => !expense.isRecurring);

    return { activeExpenses, recurringExpenses, fixedTimeExpenses };
  }, [/* depends only on demoExpenses values; static within component */]);

  const { activeLoans, completedLoans } = useMemo(() => {
    const activeLoans = demoLoans.filter(loan => loan.status === 'active');
    const completedLoans = demoLoans.filter(loan => loan.status === 'completed' || loan.status === 'written-off');
    return { activeLoans, completedLoans };
  }, [/* static demoLoans */]);

  const handleTabSwitch = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  const handleScroll = useCallback(() => {
    // Scroll handling logic here
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await apiService.logout();
    } finally {
      localStorage.removeItem('demoMode');
      window.location.href = '/login';
    }
  }, []);

  const handleAddExpense = useCallback(async (newExpenseData: Omit<Expense, 'id' | 'createdAt' | 'partialPayments'>) => {
    // Add expense logic here
  }, []);

  const handleAddLoan = useCallback(async (newLoanData: Omit<Loan, 'id' | 'createdAt' | 'payments' | 'totalReceived' | 'remainingAmount' | 'status'>) => {
    // Add loan logic here
  }, []);

  const handleDeleteExpense = useCallback(async (expenseId: string) => {
    // Delete expense logic here
  }, []);

  const handleUpdateExpense = useCallback(async (updatedExpense: Expense) => {
    // Update expense logic here
  }, []);

  const handleUpdateLoan = useCallback(async (updatedLoan: Loan) => {
    // Update loan logic here
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      {/* Demo Mode Banner removed as requested */}

      {/* Title - Top Left */}
      {!isAnyModalOpen && (
        <div className="fixed top-16 left-6 z-30 space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
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
        </div>
      )}

      {/* Top Right Controls */}
      {!isAnyModalOpen && (
        <div className="fixed top-16 right-6 z-40 flex flex-col gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="h-12 w-12 rounded-full bg-background/80 backdrop-blur-sm border border-border/40 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-all duration-200 hover:scale-102 shadow-sm hover:shadow-md"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      )}

      <div className="container mx-auto px-6 py-8 max-w-7xl min-h-screen">
        {/* Spacer for layout */}
        <div className="pt-20 mb-6"></div>

        {/* Navigation Bar with balanced horizontal alignment */}
        <div className="flex items-center mb-6">
          {/* Left side - Greeting */}
          <div className="flex items-center gap-6 flex-1">
            <p className="text-lg font-semibold text-foreground">
              Hi Demo User!
            </p>
          </div>

          {/* Center - Tab Buttons */}
          <div className="flex justify-center flex-1">
            <div className="grid w-auto grid-cols-2 gap-1 bg-white/10 backdrop-blur-sm rounded-lg p-1 shadow-lg border border-white/20">
              <button
                onClick={() => setActiveTab('expenses')}
                className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-all duration-150 ease-out ${
                  activeTab === 'expenses'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transform scale-105'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/50'
                }`}
              >
                <Wallet className={`h-4 w-4 transition-colors duration-150 ${activeTab === 'expenses' ? 'text-white' : 'text-muted-foreground'}`} />
                Expenses
              </button>
              <button
                onClick={() => setActiveTab('loans')}
                className={`flex items-center justify-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-all duration-150 ease-out ${
                  activeTab === 'loans'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transform scale-105'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/50'
                }`}
              >
                <HandCoins className={`h-4 w-4 transition-colors duration-150 ${activeTab === 'loans' ? 'text-white' : 'text-muted-foreground'}`} />
                Loans
              </button>
            </div>
          </div>

          {/* Right side - Action Buttons */}
          <div className="flex items-center gap-4 flex-1 justify-end">
            {/* Privacy Toggle - Just Eye Icon */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsPrivacyMode(!isPrivacyMode)}
              className="h-10 w-10 rounded-full text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-102 backdrop-blur-sm bg-white/10 dark:bg-gray-800/20 hover:bg-white/20 dark:hover:bg-gray-800/30 border border-white/20 dark:border-gray-700/30"
              title={isPrivacyMode ? "Show Data" : "Hide Data"}
            >
              {isPrivacyMode ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </Button>
            
            {/* Analytics Button */}
            <Button 
              variant="outline" 
              size="lg" 
              className="gap-3 rounded-full px-6 hover:shadow-lg transition-all duration-200 hover:scale-102 hover:shadow-purple-accent/20 border-border/40 backdrop-blur-sm"
              onClick={() => setShowDetailedView(true)}
            >
              <BarChart3 className="h-5 w-5" />
              Analytics
            </Button>

            {/* Add Entry Button */}
            <div>
              {activeTab === 'expenses' ? (
                <AddExpenseModal onAddExpense={handleAddExpense} />
              ) : (
                <AddLoanModal onAddLoan={handleAddLoan} existingPersons={[]} />
              )}
            </div>
          </div>
        </div>

        {/* Main Content with Tabs */}
        <div className="space-y-4 pb-8">
          <div className="w-full">
            {/* Tab Content */}
            <div className="relative">
              <div key="expenses-tab" className={`transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform ${activeTab === 'expenses' ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-4 absolute inset-0 pointer-events-none'}`}>
                <div className="space-y-6">
                  {/* Info Bar */}
                  <InfoBar 
                    expenses={activeExpenses} 
                    onUpdateExpense={handleUpdateExpense} 
                    onDeleteExpense={handleDeleteExpense} 
                    isPrivacyMode={isPrivacyMode} 
                  />

                  {/* Dashboard */}
                  <div>
                    <ExpenseDashboard 
                      expenses={activeExpenses} 
                      onUpdateExpense={handleUpdateExpense}
                      isPrivacyMode={isPrivacyMode}
                    />
                  </div>
                </div>
              </div>

              <div key="loans-tab" className={`transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform ${activeTab === 'loans' ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 -translate-x-4 absolute inset-0 pointer-events-none'}`}>
                <div className="space-y-6">
                  {/* Loans Info Bar */}
                  <LoansInfoBar 
                    loans={activeLoans} 
                    onUpdateLoan={handleUpdateLoan} 
                    isPrivacyMode={isPrivacyMode} 
                  />

                  {/* Loans Dashboard */}
                  <div>
                    <LoansDashboard 
                      loans={activeLoans} 
                      onUpdateLoan={handleUpdateLoan}
                      isPrivacyMode={isPrivacyMode}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed View Modal */}
        {showDetailedView && (
          <>
            {activeTab === 'expenses' ? (
              <DetailedView 
                expenses={activeExpenses} 
                onClose={() => setShowDetailedView(false)} 
              />
            ) : (
              <LoanDetailedView 
                loans={activeLoans} 
                onClose={() => setShowDetailedView(false)}
                onUpdateLoan={handleUpdateLoan}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
});

TryMe.displayName = 'TryMe';

// Main Index Component
const Index = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('expenses');
  const [isPrivacyMode, setIsPrivacyMode] = useState(false);
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAnyModalOpen, setIsAnyModalOpen] = useState(false);
  const [userName, setUserName] = useState('User');
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Load data from server on mount
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setIsLoading(true);
        // Load user for greeting
        const user = await apiService.getCurrentUser();
        if (!cancelled) {
          const fallbackName = localStorage.getItem('userName') || 'User';
          setUserName(user?.firstName || fallbackName);
        }
        // Fetch expenses and loans in parallel
        const [exp, ln] = await Promise.all([
          apiService.listExpenses().catch(() => [] as Expense[]),
          apiService.listLoans().catch(() => [] as Loan[]),
        ]);
        if (!cancelled) {
          setExpenses(exp as Expense[]);
          setLoans(ln as Loan[]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, []);

  const handleAddExpense = async (newExpenseData: Omit<Expense, 'id' | 'createdAt' | 'partialPayments'>) => {
    try {
      const created = await apiService.createExpense(newExpenseData);
      setExpenses(prev => [created, ...prev]);
    } catch (e) {
      console.error('Create expense failed', e);
    }
  };

  const handleAddLoan = async (newLoanData: Omit<Loan, 'id' | 'createdAt' | 'payments' | 'totalReceived' | 'remainingAmount' | 'status'>) => {
    try {
      const created = await apiService.createLoan(newLoanData);
      setLoans(prev => [created, ...prev]);
    } catch (e) {
      console.error('Create loan failed', e);
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      await apiService.deleteExpense(expenseId);
      setExpenses(prev => prev.filter(expense => String(expense.id) !== String(expenseId)));
    } catch (e) {
      console.error('Delete expense failed', e);
    }
  };

  const handleUpdateExpense = async (updatedExpense: Expense) => {
    try {
      const saved = await apiService.updateExpense(String(updatedExpense.id), updatedExpense);
      setExpenses(prev => prev.map(expense => 
        String(expense.id) === String(saved.id) ? saved : expense
      ));
    } catch (e) {
      console.error('Update expense failed', e);
    }
  };

  const handleUpdateLoan = async (updatedLoan: Loan) => {
    setLoans(prev => prev.map(loan => 
      loan.id === updatedLoan.id ? updatedLoan : loan
    ));
  };

  const handleLogout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('lastLoginDate');
      localStorage.removeItem('userName');
      localStorage.removeItem('userId');
      localStorage.removeItem('demoMode');
      // Use SPA navigation for speed
      navigate('/login');
    }
  };

  // Hide header controls on scroll
  useEffect(() => {
    function onScroll() {
      const head = document.getElementById('sticky-controls');
      if (!head) return;
      if (window.scrollY > 10) {
        head.style.opacity = '0';
        head.style.pointerEvents = 'none';
      } else {
        head.style.opacity = '1';
        head.style.pointerEvents = 'auto';
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Get existing person names for autocomplete
  const existingPersons = Array.from(new Set(loans.map(loan => loan.personName)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      {/* Title - Top Left */}
      {!isAnyModalOpen && (
        <div id="sticky-controls" className="fixed top-6 left-6 z-30 space-y-2 transition-opacity duration-200">
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
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
        </div>
      )}

      {/* Top Right Controls */}
      {!isAnyModalOpen && (
        <div className="fixed top-6 right-6 z-40 flex flex-col gap-2 transition-opacity duration-200" id="sticky-controls">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="h-12 w-12 rounded-full bg-background/80 backdrop-blur-sm border border-border/40 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-all duration-200 hover:scale-102 shadow-sm hover:shadow-md"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      )}

      <div className="container mx-auto px-6 py-8 max-w-7xl min-h-screen">
        {/* Spacer for layout */}
        <div className="pt-20 mb-6"></div>

        {/* Navigation Bar with balanced horizontal alignment */}
        <div className="flex items-center mb-6">
          {/* Left side - Greeting */}
          <div className="flex items-center gap-6 flex-1">
            <p className="text-lg font-semibold text-foreground">
              Hi {userName}!
            </p>
          </div>

          {/* Center - Tab Buttons */}
          <div className="flex justify-center flex-1">
            <div className="grid w-auto grid-cols-2 gap-1 bg-white/10 backdrop-blur-sm rounded-lg p-1 shadow-lg border border-white/20">
              <button
                onClick={() => setActiveTab('expenses')}
                className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-all duration-150 ease-out ${
                  activeTab === 'expenses'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transform scale-105'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/50'
                }`}
              >
                <Wallet className={`h-4 w-4 transition-colors duration-150 ${activeTab === 'expenses' ? 'text-white' : 'text-muted-foreground'}`} />
                Expenses
              </button>
              <button
                onClick={() => setActiveTab('loans')}
                className={`flex items-center justify-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-all duration-150 ease-out ${
                  activeTab === 'loans'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transform scale-105'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/50'
                }`}
              >
                <HandCoins className={`h-4 w-4 transition-colors duration-150 ${activeTab === 'loans' ? 'text-white' : 'text-muted-foreground'}`} />
                Loans
              </button>
            </div>
          </div>

          {/* Right side - Action Buttons */}
          <div className="flex items-center gap-4 flex-1 justify-end">
            {/* Privacy Toggle - Just Eye Icon */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsPrivacyMode(!isPrivacyMode)}
              className="h-10 w-10 rounded-full text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-102 backdrop-blur-sm bg-white/10 dark:bg-gray-800/20 hover:bg-white/20 dark:hover:bg-gray-800/30 border border-white/20 dark:border-gray-700/30"
              title={isPrivacyMode ? "Show Data" : "Hide Data"}
            >
              {isPrivacyMode ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </Button>
            
            {/* Analytics Button */}
            <Button 
              variant="outline" 
              size="lg" 
              className="gap-3 rounded-full px-6 hover:shadow-lg transition-all duration-200 hover:scale-102 hover:shadow-purple-accent/20 border-border/40 backdrop-blur-sm"
              onClick={() => setShowDetailedView(true)}
            >
              <BarChart3 className="h-5 w-5" />
              Analytics
            </Button>

            {/* Add Entry Button */}
            <div>
              {activeTab === 'expenses' ? (
                <AddExpenseModal onAddExpense={handleAddExpense} />
              ) : (
                <AddLoanModal onAddLoan={handleAddLoan} existingPersons={existingPersons} />
              )}
            </div>
          </div>
        </div>

        {/* Main Content with Tabs */}
        <div className="space-y-4 pb-8">
          <div className="w-full">
            {/* Tab Content */}
            <div className="relative">
              <div key="expenses-tab" className={`transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform ${activeTab === 'expenses' ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-4 absolute inset-0 pointer-events-none'}`}>
                <div className="space-y-6">
                  {/* Info Bar */}
                  <InfoBar 
                    expenses={expenses} 
                    onUpdateExpense={handleUpdateExpense} 
                    onDeleteExpense={handleDeleteExpense} 
                    isPrivacyMode={isPrivacyMode} 
                  />

                  {/* Dashboard */}
                  <div>
                    <ExpenseDashboard 
                      expenses={expenses} 
                      onUpdateExpense={handleUpdateExpense}
                      isPrivacyMode={isPrivacyMode}
                    />
                  </div>
                </div>
              </div>

              <div key="loans-tab" className={`transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform ${activeTab === 'loans' ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 -translate-x-4 absolute inset-0 pointer-events-none'}`}>
                <div className="space-y-6">
                  {/* Loans Info Bar */}
                  <LoansInfoBar 
                    loans={loans} 
                    onUpdateLoan={handleUpdateLoan} 
                    isPrivacyMode={isPrivacyMode} 
                  />

                  {/* Loans Dashboard */}
                  <div>
                    <LoansDashboard 
                      loans={loans} 
                      onUpdateLoan={handleUpdateLoan}
                      isPrivacyMode={isPrivacyMode}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed View Modal */}
        {showDetailedView && (
          <>
            {activeTab === 'expenses' ? (
              <DetailedView 
                expenses={expenses} 
                onClose={() => setShowDetailedView(false)} 
              />
            ) : (
              <LoanDetailedView 
                loans={loans} 
                onClose={() => setShowDetailedView(false)}
                onUpdateLoan={handleUpdateLoan}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
export { TryMe };