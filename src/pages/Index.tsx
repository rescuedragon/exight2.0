import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { InfoBar } from "@/components/InfoBar";
import { LoansInfoBar } from "@/components/LoansInfoBar";
import { AddExpenseModal } from "@/components/AddExpenseModal";
import { AddLoanModal } from "@/components/AddLoanModal";
import { ExpenseDashboard } from "@/components/ExpenseDashboard";
import { LoansDashboard } from "@/components/LoansDashboard";
import { DetailedView } from "@/components/DetailedView";
import { LoanDetailedView } from "@/components/LoanDetailedView";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Expense } from "@/types/expense";
import { Loan } from "@/types/loan";
import { BarChart3, Eye, EyeOff, HandCoins, Wallet, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useModal } from "@/contexts/ModalContext";

// Try Me Component with hardcoded demo data
const TryMe = () => {
  const navigate = useNavigate();
  const { isAnyModalOpen, openModal, closeModal } = useModal();
  
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
      status: 'active' as const,
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

  const [expenses, setExpenses] = useState<Expense[]>(demoExpenses);
  const [loans, setLoans] = useState<Loan[]>(demoLoans);
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [actionLogs, setActionLogs] = useState<ActionLog[]>([]);
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const [isPrivacyMode, setIsPrivacyMode] = useState(false);
  const [activeTab, setActiveTab] = useState('expenses');
  const [userName, setUserName] = useState<string>('Demo User');

  // Handle scroll-based fade effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const fadeStart = 2;
      const fadeEnd = 20;
      
      if (scrollY <= fadeStart) {
        setScrollOpacity(1);
      } else if (scrollY >= fadeEnd) {
        setScrollOpacity(0);
      } else {
        const progress = (scrollY - fadeStart) / (fadeEnd - fadeStart);
        const opacity = 1 - Math.pow(progress, 0.5);
        setScrollOpacity(Math.max(0, Math.min(1, opacity)));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('lastLoginDate');
    localStorage.removeItem('userName');
    localStorage.removeItem('demoMode');
    window.location.href = '/login';
  };

  const handleAddExpense = async (newExpenseData: Omit<Expense, 'id' | 'createdAt' | 'partialPayments'>) => {
    const newExpense: Expense = {
      id: Date.now().toString(),
      name: newExpenseData.name,
      amount: newExpenseData.amount,
      currency: newExpenseData.currency,
      type: newExpenseData.type,
      deductionDay: newExpenseData.deductionDay,
      isRecurring: newExpenseData.isRecurring,
      totalMonths: newExpenseData.totalMonths,
      remainingMonths: newExpenseData.remainingMonths,
      remainingAmount: newExpenseData.remainingAmount,
      createdAt: new Date(),
      partialPayments: []
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const handleAddLoan = async (newLoanData: Omit<Loan, 'id' | 'createdAt' | 'payments' | 'totalReceived' | 'remainingAmount' | 'status'>) => {
    const newLoan: Loan = {
      id: Date.now().toString(),
      personName: newLoanData.personName,
      amount: newLoanData.amount,
      currency: newLoanData.currency,
      dateGiven: newLoanData.dateGiven,
      description: newLoanData.description,
      status: 'active',
      totalReceived: 0,
      remainingAmount: newLoanData.amount,
      createdAt: new Date(),
      payments: []
    };
    setLoans(prev => [newLoan, ...prev]);
  };

  const handleDeleteExpense = async (expenseId: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== expenseId));
  };

  const handleUpdateExpense = async (updatedExpense: Expense) => {
    setExpenses(prev => prev.map(expense => 
      expense.id === updatedExpense.id ? updatedExpense : expense
    ));
  };

  const handleUpdateLoan = async (updatedLoan: Loan) => {
    setLoans(prev => prev.map(loan => 
      loan.id === updatedLoan.id ? updatedLoan : loan
    ));
  };

  // Get unique person names for loan form
  const existingPersons = Array.from(new Set(loans.map(loan => loan.personName)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      {/* Title - Top Left */}
      {!isAnyModalOpen && (
        <div 
          className="fixed top-6 left-6 z-30 space-y-2 transition-opacity duration-300 ease-out"
          style={{ opacity: scrollOpacity }}
        >
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-tight animate-fade-in-up stagger-1">
          <span className="bg-gradient-to-r from-blue-accent via-purple-accent to-emerald-accent bg-clip-text text-transparent animate-gradient-x">
            Exight
          </span>
        </h1>
        <div className="h-1 w-24 bg-gradient-to-r from-blue-accent to-purple-accent rounded-full animate-fade-in-up stagger-2"></div>
        </div>
      )}

      {/* Top Right Controls */}
      {!isAnyModalOpen && (
        <div 
          className="fixed top-6 right-6 z-40 flex flex-col gap-2 transition-opacity duration-300 ease-out"
          style={{ opacity: scrollOpacity }}
        >

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

        {/* Navigation Bar with Tabs on Left and Actions on Right */}
        <div className="flex justify-between items-center mb-6">
          {/* Left side - Greeting and Tabs */}
          <div className="flex items-center gap-6 animate-fade-in-up stagger-1">
            <p className="text-lg font-semibold text-foreground">
              Hi {userName}!
            </p>
            
            {/* Tab Buttons */}
            <div className="grid w-auto grid-cols-2 bg-muted/20 backdrop-blur-sm rounded-lg p-1">
              <button
                onClick={() => setActiveTab('expenses')}
                className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === 'expenses'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Wallet className="h-4 w-4" />
                Expenses
              </button>
              <button
                onClick={() => setActiveTab('loans')}
                className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === 'loans'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <HandCoins className="h-4 w-4" />
                Loans
              </button>
            </div>
          </div>

          {/* Right side - Action Buttons */}
          <div className="flex items-center gap-4 animate-fade-in-up stagger-4">
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
              <div className={`transition-opacity duration-100 will-change-[opacity] ${activeTab === 'expenses' ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'}`}>
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

              <div className={`transition-opacity duration-100 will-change-[opacity] ${activeTab === 'loans' ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'}`}>
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

interface ActionLog {
  id: string;
  action: string;
  details: string;
  timestamp: Date;
  type: 'add' | 'update' | 'payment' | 'delete';
}

const Index = () => {
  const navigate = useNavigate();
  const { isAnyModalOpen, openModal, closeModal } = useModal();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [showDetailedView, setShowDetailedView] = useState(false);


  const [actionLogs, setActionLogs] = useState<ActionLog[]>([]);
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const [isPrivacyMode, setIsPrivacyMode] = useState(false);
  const [activeTab, setActiveTab] = useState('expenses');
  const [userName, setUserName] = useState<string>('User');



  // Handle scroll-based fade effect - faster fade to prevent overlap
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const fadeStart = 2; // Start fading after just 2px scroll
      const fadeEnd = 20; // Completely fade by 20px scroll (much faster fade)
      
      if (scrollY <= fadeStart) {
        setScrollOpacity(1);
      } else if (scrollY >= fadeEnd) {
        setScrollOpacity(0);
      } else {
        // Calculate opacity between fadeStart and fadeEnd
        // Using an ease-out curve for a more natural feel
        const progress = (scrollY - fadeStart) / (fadeEnd - fadeStart);
        const opacity = 1 - Math.pow(progress, 0.5); // Square root for ease-out
        setScrollOpacity(Math.max(0, Math.min(1, opacity)));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load data from localStorage on component mount
  useEffect(() => {
    console.log("Loading data from localStorage...");
    
    // Load expenses from localStorage
    const savedExpenses = localStorage.getItem('expenses');
    console.log("Saved expenses:", savedExpenses);
    
    if (savedExpenses) {
      const parsed = JSON.parse(savedExpenses);
      console.log("Parsed expenses:", parsed.length, "entries");
      const expensesWithDates = parsed.map((expense: any) => ({
        ...expense,
        createdAt: new Date(expense.createdAt),
        partialPayments: expense.partialPayments?.map((payment: any) => ({
          ...payment,
          date: new Date(payment.date)
        })) || []
      }));
      setExpenses(expensesWithDates);
      console.log("Expenses loaded:", expensesWithDates.length);
    } else {
      console.log("No expenses found in localStorage, loading demo data...");
      // Load demo data automatically if no data exists
      testLoadDemoData();
    }

    // Load loans from localStorage
    const savedLoans = localStorage.getItem('loans');
    console.log("Saved loans:", savedLoans);
    
    if (savedLoans) {
      const parsed = JSON.parse(savedLoans);
      console.log("Parsed loans:", parsed.length, "entries");
      const loansWithDates = parsed.map((loan: any) => ({
        ...loan,
        dateGiven: new Date(loan.dateGiven),
        createdAt: new Date(loan.createdAt),
        payments: loan.payments?.map((payment: any) => ({
          ...payment,
          date: new Date(payment.date)
        })) || []
      }));
      setLoans(loansWithDates);
      console.log("Loans loaded:", loansWithDates.length);
    } else {
      console.log("No loans found in localStorage, demo data will be loaded by testLoadDemoData");
    }

    // Load user name
    const savedUserName = localStorage.getItem('userName');
    if (savedUserName) {
      setUserName(savedUserName);
    }
  }, []);

  // Load action logs from localStorage
  const loadActionLogs = async () => {
    const savedLogs = localStorage.getItem('action-logs');
    if (savedLogs) {
      const parsed = JSON.parse(savedLogs);
      const logsWithDates = parsed.map((log: any) => ({
        ...log,
        timestamp: new Date(log.timestamp)
      }));
      setActionLogs(logsWithDates);
    }
  };

  useEffect(() => {
    loadActionLogs();
  }, []);

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Save loans to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('loans', JSON.stringify(loans));
  }, [loans]);

  const addActionLog = async (action: string, details: string, type: ActionLog['type']) => {
    const newLog: ActionLog = {
      id: Date.now().toString(),
      action,
      details,
      timestamp: new Date(),
      type
    };
    const updatedLogs = [newLog, ...actionLogs];
    setActionLogs(updatedLogs);
    localStorage.setItem('action-logs', JSON.stringify(updatedLogs));
  };

  const handleAddExpense = async (newExpenseData: Omit<Expense, 'id' | 'createdAt' | 'partialPayments'>) => {
    const newExpense: Expense = {
      id: Date.now().toString(),
      name: newExpenseData.name,
      amount: newExpenseData.amount,
      currency: newExpenseData.currency || 'INR',
      type: newExpenseData.type,
      deductionDay: newExpenseData.deductionDay,
      isRecurring: newExpenseData.isRecurring,
      totalMonths: newExpenseData.totalMonths || null,
      remainingMonths: newExpenseData.remainingMonths || newExpenseData.totalMonths || null,
      remainingAmount: newExpenseData.remainingAmount || (newExpenseData.totalMonths ? newExpenseData.amount * newExpenseData.totalMonths : null),
      createdAt: new Date(),
      partialPayments: []
    };
    
    setExpenses(prev => [...prev, newExpense]);
    await addActionLog(
      'Added New Expense',
      `Created ${newExpenseData.type}: ${newExpenseData.name} - ₹${newExpenseData.amount}/month`,
      'add'
    );
  };

  const handleAddLoan = async (newLoanData: Omit<Loan, 'id' | 'createdAt' | 'payments' | 'totalReceived' | 'remainingAmount' | 'status'>) => {
    const newLoan: Loan = {
      id: Date.now().toString(),
      ...newLoanData,
      status: 'active',
      totalReceived: 0,
      remainingAmount: newLoanData.amount,
      createdAt: new Date(),
      payments: []
    };
    
    setLoans(prev => [...prev, newLoan]);
    await addActionLog(
      'Added New Loan',
      `Lent ₹${newLoanData.amount} to ${newLoanData.personName}`,
      'add'
    );
  };

  const handleDeleteExpense = async (expenseId: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== expenseId));
    await addActionLog(
      'Deleted Expense',
      'Expense removed from tracking',
      'delete'
    );
  };

  const handleUpdateExpense = async (updatedExpense: Expense) => {
    const originalExpense = expenses.find(e => e.id === updatedExpense.id);
    
    setExpenses(prev => prev.map(expense => 
      expense.id === updatedExpense.id ? updatedExpense : expense
    ));
    
    if (originalExpense) {
      // Check if it's a partial payment
      if (updatedExpense.partialPayments.length > originalExpense.partialPayments.length) {
        const latestPayment = updatedExpense.partialPayments[updatedExpense.partialPayments.length - 1];
        await addActionLog(
          'Partial Payment Made',
          `Paid ₹${latestPayment.amount} towards ${updatedExpense.name}`,
          'payment'
        );
      } else {
        await addActionLog(
          'Updated Expense',
          `Modified ${updatedExpense.name}`,
          'update'
        );
      }
    }
  };

  const handleUpdateLoan = async (updatedLoan: Loan) => {
    const originalLoan = loans.find(l => l.id === updatedLoan.id);
    
    setLoans(prev => prev.map(loan => 
      loan.id === updatedLoan.id ? updatedLoan : loan
    ));
    
    if (originalLoan) {
      // Check if it's a payment
      if (updatedLoan.payments.length > originalLoan.payments.length) {
        const latestPayment = updatedLoan.payments[updatedLoan.payments.length - 1];
        const actionType = latestPayment.type === 'write-off' ? 'Written Off' : 'Payment Received';
        await addActionLog(
          actionType,
          `₹${latestPayment.amount} ${latestPayment.type === 'write-off' ? 'written off' : 'received'} from ${updatedLoan.personName}`,
          latestPayment.type === 'write-off' ? 'delete' : 'payment'
        );
      } else {
        await addActionLog(
          'Updated Loan',
          `Modified loan for ${updatedLoan.personName}`,
          'update'
        );
      }
    }
  };

  // Get existing person names for autocomplete
  const existingPersons = Array.from(new Set(loans.map(loan => loan.personName)));

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem('lastLoginDate');
    localStorage.removeItem('userName');
    localStorage.removeItem('demoMode');
    
    // Force page reload to trigger authentication check
    window.location.href = '/login';
  };

  const addDemoData = () => {
    // Create specific demo expenses as requested
    const testExpenses: Expense[] = [
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
      }
    ];

    // Create specific demo loans as requested
    const testLoans: Loan[] = [
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
            type: 'payment',
            description: 'First installment'
          },
          {
            id: 'payment_1_2',
            amount: 5000,
            date: new Date(2024, 6, 5),
            type: 'payment',
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
            type: 'payment',
            description: 'First payment'
          },
          {
            id: 'payment_2_2',
            amount: 10000,
            date: new Date(2024, 5, 20),
            type: 'payment',
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
            type: 'payment',
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
            type: 'payment',
            description: 'First installment'
          },
          {
            id: 'payment_6_2',
            amount: 10000,
            date: new Date(2024, 2, 20),
            type: 'payment',
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
            type: 'payment',
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

    localStorage.setItem('expenses', JSON.stringify(testExpenses));
    localStorage.setItem('loans', JSON.stringify(testLoans));
    
    // Reload the data
    setExpenses(testExpenses);
    setLoans(testLoans);
    
    console.log('Demo data loaded: 8 expenses (4 recurring, 4 fixed-term), 8 loans (4 active, 4 completed)');
  };

  const clearAllData = () => {
    // Clear all data from localStorage
    localStorage.removeItem('expenses');
    localStorage.removeItem('loans');
    localStorage.removeItem('action-logs');
    localStorage.removeItem('demoMode');
    
    // Clear state
    setExpenses([]);
    setLoans([]);
    setActionLogs([]);
    
    console.log('All demo data cleared from localStorage and state');
  };

  const testLoadDemoData = () => {
    // Test function to manually load demo data
    const demoExpenses = [
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

    localStorage.setItem('expenses', JSON.stringify(demoExpenses));
    localStorage.setItem('loans', JSON.stringify(demoLoans));
    
    // Reload the data
    setExpenses(demoExpenses);
    setLoans(demoLoans);
    
    console.log('Full demo data loaded: 8 expenses (4 recurring, 4 fixed-term), 8 loans (4 active, 4 completed)');
  };

      return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      {/* Title - Top Left */}
      {!isAnyModalOpen && (
        <div 
          className="fixed top-6 left-6 z-30 space-y-2 transition-opacity duration-300 ease-out"
          style={{ opacity: scrollOpacity }}
        >
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-tight animate-fade-in-up stagger-1">
          <span className="bg-gradient-to-r from-blue-accent via-purple-accent to-emerald-accent bg-clip-text text-transparent animate-gradient-x">
            Exight
          </span>
        </h1>
        <div className="h-1 w-24 bg-gradient-to-r from-blue-accent to-purple-accent rounded-full animate-fade-in-up stagger-2"></div>
        </div>
      )}

              {/* Top Right Controls */}
      {!isAnyModalOpen && (
        <div 
          className="fixed top-6 right-6 z-40 flex flex-col gap-2 transition-opacity duration-300 ease-out"
          style={{ opacity: scrollOpacity }}
        >

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

        {/* Navigation Bar with Tabs on Left and Actions on Right */}
        <div className="flex justify-between items-center mb-6">
          {/* Left side - Greeting and Tabs */}
          <div className="flex items-center gap-6 animate-fade-in-up stagger-1">
            <p className="text-lg font-semibold text-foreground">
              Hi {userName}!
            </p>
            
            {/* Tab Buttons */}
            <div className="grid w-auto grid-cols-2 bg-muted/20 backdrop-blur-sm rounded-lg p-1">
              <button
                onClick={() => setActiveTab('expenses')}
                className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === 'expenses'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Wallet className="h-4 w-4" />
                Expenses
              </button>
              <button
                onClick={() => setActiveTab('loans')}
                className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === 'loans'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <HandCoins className="h-4 w-4" />
                Loans
              </button>
            </div>
          </div>

          {/* Right side - Action Buttons */}
          <div className="flex items-center gap-4 animate-fade-in-up stagger-4">
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
                <div className={`transition-opacity duration-100 will-change-[opacity] ${activeTab === 'expenses' ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'}`}>
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

                              <div className={`transition-opacity duration-100 will-change-[opacity] ${activeTab === 'loans' ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'}`}>
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