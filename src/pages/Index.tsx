import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { InfoBar } from "@/components/InfoBar";
import { LoansInfoBar } from "@/components/LoansInfoBar";
import { AddExpenseModal } from "@/components/AddExpenseModal";
import { AddLoanModal } from "@/components/AddLoanModal";
import { ExpenseDashboard } from "@/components/ExpenseDashboard";
import { LoansDashboard } from "@/components/LoansDashboard";
import { DetailedView } from "@/components/DetailedView";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Expense } from "@/types/expense";
import { Loan } from "@/types/loan";
import { BarChart3, Eye, EyeOff, HandCoins, Wallet } from "lucide-react";

interface ActionLog {
  id: string;
  action: string;
  details: string;
  timestamp: Date;
  type: 'add' | 'update' | 'payment' | 'delete';
}

const Index = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [actionLogs, setActionLogs] = useState<ActionLog[]>([]);
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const [isPrivacyMode, setIsPrivacyMode] = useState(false);
  const [activeTab, setActiveTab] = useState('expenses');

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
    // Load expenses from localStorage
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
      const parsed = JSON.parse(savedExpenses);
      const expensesWithDates = parsed.map((expense: any) => ({
        ...expense,
        createdAt: new Date(expense.createdAt),
        partialPayments: expense.partialPayments?.map((payment: any) => ({
          ...payment,
          date: new Date(payment.date)
        })) || []
      }));
      setExpenses(expensesWithDates);
    }

    // Load loans from localStorage
    const savedLoans = localStorage.getItem('loans');
    if (savedLoans) {
      const parsed = JSON.parse(savedLoans);
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

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Title - Top Left */}
      <div 
        className="fixed top-6 left-6 z-30 space-y-2 transition-opacity duration-300 ease-out"
        style={{ opacity: scrollOpacity }}
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-foreground tracking-tight leading-tight animate-fade-in-up stagger-1">
          <span className="bg-gradient-to-r from-blue-accent via-purple-accent to-emerald-accent bg-clip-text text-transparent animate-gradient-x">
            Exight
          </span>
        </h1>
        <div className="h-1 w-24 bg-gradient-to-r from-blue-accent to-purple-accent rounded-full animate-fade-in-up stagger-2"></div>
        <p className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-accent via-purple-accent to-emerald-accent bg-clip-text text-transparent animate-fade-in-up stagger-3 tracking-wide">
          Insights for your expenses.
        </p>
      </div>

      {/* Theme Toggle - Top Right */}
      <div 
        className="fixed top-6 right-6 z-40 transition-opacity duration-300 ease-out"
        style={{ opacity: scrollOpacity }}
      >
        <ThemeToggle />
      </div>

      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Spacer for layout */}
        <div className="pt-24 mb-4"></div>

        {/* Greeting and Navigation Buttons - Horizontally Aligned */}
        <div className="flex justify-between items-center mb-4">
          {/* Greeting - Left side */}
          <div className="animate-fade-in-up stagger-1">
            <p className="text-lg font-semibold text-foreground">
              Welcome back!
            </p>
          </div>

          {/* Navigation Buttons - Right side */}
          <div className="flex flex-wrap gap-4 animate-fade-in-up stagger-4">
            {/* Privacy Toggle */}
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setIsPrivacyMode(!isPrivacyMode)}
              className="gap-3 rounded-full px-6 text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105 backdrop-blur-sm bg-white/10 dark:bg-gray-800/20 hover:bg-white/20 dark:hover:bg-gray-800/30 border border-white/20 dark:border-gray-700/30"
            >
              {isPrivacyMode ? (
                <>
                  <EyeOff className="h-5 w-5" />
                  Show Data
                </>
              ) : (
                <>
                  <Eye className="h-5 w-5" />
                  Hide Data
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="gap-3 rounded-full px-6 hover:shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-purple-accent/20 border-border/40 backdrop-blur-sm"
              onClick={() => setShowDetailedView(true)}
            >
              <BarChart3 className="h-5 w-5" />
              Analytics
            </Button>
          </div>
        </div>

        {/* Main Content with Tabs */}
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-between items-center mb-6">
              <TabsList className="grid w-auto grid-cols-2 bg-muted/20 backdrop-blur-sm">
                <TabsTrigger value="expenses" className="flex items-center gap-2 px-6">
                  <Wallet className="h-4 w-4" />
                  Expenses
                </TabsTrigger>
                <TabsTrigger value="loans" className="flex items-center gap-2 px-6">
                  <HandCoins className="h-4 w-4" />
                  Loans Given
                </TabsTrigger>
              </TabsList>
              
              <div className="animate-fade-in-up stagger-5">
                {activeTab === 'expenses' ? (
                  <AddExpenseModal onAddExpense={handleAddExpense} />
                ) : (
                  <AddLoanModal onAddLoan={handleAddLoan} existingPersons={existingPersons} />
                )}
              </div>
            </div>

            <TabsContent value="expenses" className="space-y-6">
              {/* Info Bar */}
              <InfoBar 
                expenses={expenses} 
                onUpdateExpense={handleUpdateExpense} 
                onDeleteExpense={handleDeleteExpense} 
                isPrivacyMode={isPrivacyMode} 
              />

              {/* Dashboard */}
              <div className="animate-fade-in-up stagger-5">
                <ExpenseDashboard 
                  expenses={expenses} 
                  onUpdateExpense={handleUpdateExpense}
                  isPrivacyMode={isPrivacyMode}
                />
              </div>
            </TabsContent>

            <TabsContent value="loans" className="space-y-6">
              {/* Loans Info Bar */}
              <LoansInfoBar 
                loans={loans} 
                onUpdateLoan={handleUpdateLoan} 
                isPrivacyMode={isPrivacyMode} 
              />

              {/* Loans Dashboard */}
              <div className="animate-fade-in-up stagger-5">
                <LoansDashboard 
                  loans={loans} 
                  onUpdateLoan={handleUpdateLoan}
                  isPrivacyMode={isPrivacyMode}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Detailed View Modal */}
        {showDetailedView && (
          <DetailedView 
            expenses={expenses} 
            onClose={() => setShowDetailedView(false)} 
          />
        )}
      </div>
    </div>
  );
};

export default Index;