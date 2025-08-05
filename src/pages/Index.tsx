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


interface ActionLog {
  id: string;
  action: string;
  details: string;
  timestamp: Date;
  type: 'add' | 'update' | 'payment' | 'delete';
}

const Index = () => {
  const navigate = useNavigate();
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
      console.log("No expenses found in localStorage");
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
      console.log("No loans found in localStorage");
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
    localStorage.removeItem('lastLoginDate');
    navigate('/login');
  };

    const addDemoData = () => {
    // Generate random number of entries (10-20 for each section)
    const numExpenses = Math.floor(Math.random() * 11) + 10; // 10-20
    const numLoans = Math.floor(Math.random() * 11) + 10; // 10-20

    // Sample data arrays for random generation
    const expenseNames = [
      "Home Loan EMI", "Car Loan EMI", "Personal Loan EMI", "Education Loan EMI",
      "Netflix Subscription", "Amazon Prime", "Spotify Premium", "Disney+ Hotstar",
      "Internet Bill", "Mobile Bill", "Electricity Bill", "Water Bill", "Gas Bill",
      "Gym Membership", "Insurance Premium", "Credit Card Payment", "Rent",
      "Grocery Shopping", "Fuel Expenses", "Medical Insurance", "Travel Insurance",
      "Magazine Subscription", "Cloud Storage", "Software License", "Domain Renewal"
    ];

    const personNames = [
      "Rahul Sharma", "Priya Patel", "Amit Kumar", "Sneha Singh", "Vikram Gupta",
      "Kavya Reddy", "Arjun Nair", "Meera Joshi", "Ravi Agarwal", "Pooja Mehta",
      "Sanjay Verma", "Anita Desai", "Kiran Rao", "Deepak Shah", "Sunita Iyer",
      "Manoj Tiwari", "Rekha Bansal", "Ashish Khanna", "Nidhi Saxena", "Rohit Malhotra"
    ];

    const loanStatuses: ("active" | "completed" | "written-off")[] = ["active", "completed", "written-off"];

    // Generate random expenses
    const testExpenses: Expense[] = [];
    for (let i = 0; i < numExpenses; i++) {
      const isRecurring = Math.random() > 0.3; // 70% chance of recurring
      const amount = Math.floor(Math.random() * 50000) + 500; // 500-50500
      const totalMonths = isRecurring ? (Math.random() > 0.5 ? null : Math.floor(Math.random() * 60) + 12) : Math.floor(Math.random() * 60) + 12;
      const remainingMonths = totalMonths ? Math.floor(Math.random() * totalMonths) : null;
      
      testExpenses.push({
        id: `exp_${i + 1}`,
        name: expenseNames[Math.floor(Math.random() * expenseNames.length)],
        amount,
        currency: "INR" as const,
        type: "EMI" as const,
        deductionDay: Math.floor(Math.random() * 28) + 1, // 1-28
        isRecurring,
        totalMonths,
        remainingMonths,
        remainingAmount: remainingMonths ? remainingMonths * amount : null,
        createdAt: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        partialPayments: []
      });
    }

    // Generate random loans
    const testLoans: Loan[] = [];
    for (let i = 0; i < numLoans; i++) {
      const amount = Math.floor(Math.random() * 100000) + 5000; // 5000-105000
      const status = loanStatuses[Math.floor(Math.random() * loanStatuses.length)];
      const totalReceived = status === "completed" ? amount : Math.floor(Math.random() * amount);
      const remainingAmount = amount - totalReceived;
      const numPayments = Math.floor(Math.random() * 5); // 0-4 payments
      
      const payments = [];
      let runningTotal = 0;
      for (let j = 0; j < numPayments && runningTotal < totalReceived; j++) {
        const paymentAmount = Math.min(
          Math.floor(Math.random() * (totalReceived - runningTotal)) + 1000,
          totalReceived - runningTotal
        );
        runningTotal += paymentAmount;
        payments.push({
          id: `payment_${i}_${j}`,
          amount: paymentAmount,
          date: new Date(2023 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
          type: "payment" as const,
          description: `Payment ${j + 1}`
        });
      }

      testLoans.push({
        id: `loan_${i + 1}`,
        personName: personNames[Math.floor(Math.random() * personNames.length)],
        amount,
        currency: "INR",
        dateGiven: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        status,
        totalReceived,
        remainingAmount,
        writeOffDate: status === "written-off" ? new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1) : undefined,
        createdAt: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        payments
      });
    }

    localStorage.setItem('expenses', JSON.stringify(testExpenses));
    localStorage.setItem('loans', JSON.stringify(testLoans));
    
    // Reload the data
    setExpenses(testExpenses);
    setLoans(testLoans);
    
    console.log(`Demo data generated: ${numExpenses} expenses, ${numLoans} loans`);
  };

      return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      {/* Title - Top Left */}
      <div 
        className="fixed top-6 left-6 z-30 space-y-2 transition-opacity duration-200 ease-out"
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

              {/* Top Right Controls */}
        <div 
          className="fixed top-6 right-6 z-40 flex flex-col gap-2 transition-opacity duration-200 ease-out"
          style={{ opacity: scrollOpacity }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={addDemoData}
            className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm border border-border/40 hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-all duration-200 hover:scale-102 shadow-sm hover:shadow-md"
            title="Add Demo Data"
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm border border-border/40 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-all duration-200 hover:scale-102 shadow-sm hover:shadow-md"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>

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