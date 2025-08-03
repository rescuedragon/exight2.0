import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { InfoBar } from "@/components/InfoBar";
import { AddExpenseModal } from "@/components/AddExpenseModal";
import { ExpenseDashboard } from "@/components/ExpenseDashboard";
import { DetailedView } from "@/components/DetailedView";
import { ExpenseHistory } from "@/components/ExpenseHistory";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Expense } from "@/types/expense";
import { BarChart3, History, LogIn, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { expensesAPI, authAPI, actionLogsAPI } from "@/services/api";

interface ActionLog {
  id: string;
  action: string;
  details: string;
  timestamp: Date;
  type: 'add' | 'update' | 'payment' | 'delete';
}

const Index = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [actionLogs, setActionLogs] = useState<ActionLog[]>([]);
  const [userProfile, setUserProfile] = useState<{ firstName?: string; lastName?: string } | null>(null);
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const [isPrivacyMode, setIsPrivacyMode] = useState(false);

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

  // Load user profile and expenses from API on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load user profile
        console.log('Loading user profile...');
        const profileResponse = await authAPI.getProfile();
        console.log('Profile response:', profileResponse);
        if (profileResponse.user && profileResponse.user.firstName) {
          setUserProfile(profileResponse.user);
        }
        
        // Load expenses
        console.log('Loading expenses from API...');
        const response = await expensesAPI.getAll();
        console.log('API response:', response);
        
        const expensesWithDates = response.expenses.map((expense: any) => ({
          id: expense.id.toString(),
          name: expense.name,
          amount: parseFloat(expense.amount),
          currency: expense.currency,
          type: expense.type,
          deductionDay: expense.deduction_day,
          isRecurring: expense.is_recurring,
          totalMonths: expense.total_months,
          remainingMonths: expense.remaining_months,
          remainingAmount: expense.remaining_amount ? parseFloat(expense.remaining_amount) : undefined,
          createdAt: new Date(expense.created_at),
          partialPayments: expense.partial_payments?.map((payment: any) => ({
            id: payment.id.toString(),
            amount: parseFloat(payment.amount),
            date: new Date(payment.paymentDate),
            description: payment.description
          })) || []
        }));
        console.log('Processed expenses:', expensesWithDates);
        setExpenses(expensesWithDates);
      } catch (error) {
        console.error('Failed to load data:', error);
        setExpenses([]);
        setUserProfile(null);
      }
    };

    loadData();
  }, []);

  // Load action logs from database
  const loadActionLogs = async () => {
    try {
      const logs = await actionLogsAPI.getAll();
      const logsWithDates = logs.map((log: any) => ({
        ...log,
        timestamp: new Date(log.timestamp)
      }));
      setActionLogs(logsWithDates);
    } catch (error) {
      console.error('Failed to load action logs:', error);
      // Fallback to localStorage for backward compatibility
      const savedLogs = localStorage.getItem('action-logs');
      if (savedLogs) {
        const parsed = JSON.parse(savedLogs);
        const logsWithDates = parsed.map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp)
        }));
        setActionLogs(logsWithDates);
      }
    }
  };

  useEffect(() => {
    loadActionLogs();
  }, []);

  const addActionLog = async (action: string, details: string, type: ActionLog['type']) => {
    try {
      const newLog = await actionLogsAPI.create({
        action,
        details,
        type
      });
      
      const logWithDate: ActionLog = {
        ...newLog,
        timestamp: new Date(newLog.timestamp)
      };
      
      setActionLogs(prev => [logWithDate, ...prev]);
    } catch (error) {
      console.error('Failed to save action log:', error);
      // Fallback to localStorage
      const newLog: ActionLog = {
        id: Date.now().toString(),
        action,
        details,
        timestamp: new Date(),
        type
      };
      setActionLogs(prev => [newLog, ...prev]);
      // Also save to localStorage as backup
      localStorage.setItem('action-logs', JSON.stringify([newLog, ...actionLogs]));
    }
  };

  const handleAddExpense = async (newExpenseData: Omit<Expense, 'id' | 'createdAt' | 'partialPayments'>) => {
    try {
      const response = await expensesAPI.create({
        name: newExpenseData.name,
        amount: newExpenseData.amount,
        currency: newExpenseData.currency,
        type: newExpenseData.type,
        deductionDay: newExpenseData.deductionDay,
        isRecurring: newExpenseData.isRecurring,
        totalMonths: newExpenseData.totalMonths,
        remainingMonths: newExpenseData.remainingMonths,
        remainingAmount: newExpenseData.remainingAmount
      });

      const newExpense: Expense = {
        ...newExpenseData,
        id: response.expense.id.toString(),
        createdAt: new Date(response.expense.created_at),
        partialPayments: []
      };
      
      setExpenses(prev => [...prev, newExpense]);
      await addActionLog(
        'Added New Expense',
        `Created ${newExpenseData.type}: ${newExpenseData.name} - ₹${newExpenseData.amount}/month`,
        'add'
      );
    } catch (error) {
      console.error('Failed to add expense:', error);
      // You might want to show a toast notification here
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      await expensesAPI.delete(expenseId);
      setExpenses(prev => prev.filter(expense => expense.id !== expenseId));
      await addActionLog(
        'Deleted Expense',
        'Expense removed from tracking',
        'delete'
      );
    } catch (error) {
      console.error('Failed to delete expense:', error);
    }
  };

  const handleUpdateExpense = async (updatedExpense: Expense) => {
    try {
      console.log('Updating expense:', updatedExpense);
      const originalExpense = expenses.find(e => e.id === updatedExpense.id);
      console.log('Original expense:', originalExpense);
      
      // Update in database
      const updateData = {
        name: updatedExpense.name,
        amount: updatedExpense.amount,
        currency: updatedExpense.currency,
        type: updatedExpense.type,
        deductionDay: updatedExpense.deductionDay,
        isRecurring: updatedExpense.isRecurring,
        totalMonths: updatedExpense.totalMonths,
        remainingMonths: updatedExpense.remainingMonths,
        remainingAmount: updatedExpense.remainingAmount
      };
      console.log('Update data being sent:', updateData);
      
      await expensesAPI.update(updatedExpense.id, updateData);

      // Update local state
      setExpenses(prev => {
        const updated = prev.map(expense => 
          expense.id === updatedExpense.id ? updatedExpense : expense
        );
        console.log('Updated expenses state:', updated);
        return updated;
      });
      
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
    } catch (error) {
      console.error('Failed to update expense:', error);
    }
  };

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

      {/* History Button - Below Theme Toggle */}
      <div 
        className="fixed top-20 right-6 z-40 transition-opacity duration-300 ease-out"
        style={{ opacity: scrollOpacity }}
      >
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowHistory(true)}
          className="h-12 w-12 rounded-full bg-gradient-card border-border/40 shadow-card hover:shadow-elevated transition-all duration-300 hover:scale-105"
        >
          <History className="h-5 w-5" />
          <span className="sr-only">History</span>
        </Button>
      </div>

      {/* Login Button - Below History Button */}
      <div 
        className="fixed top-32 right-6 z-40 transition-opacity duration-300 ease-out"
        style={{ opacity: scrollOpacity }}
      >
        <Link to="/login">
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full bg-gradient-card border-border/40 shadow-card hover:shadow-elevated transition-all duration-300 hover:scale-105"
          >
            <LogIn className="h-5 w-5" />
            <span className="sr-only">Login</span>
          </Button>
        </Link>
      </div>

              <div className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Header - Greeting positioned above InfoBar on left */}
        <div className="flex justify-between items-center mb-6 animate-fade-in-up pt-24">
          {/* Greeting - Left side */}
          {userProfile?.firstName && (
            <div className="animate-fade-in-up stagger-3">
              <p className="text-2xl font-bold text-foreground">
                Hi, {userProfile.firstName}!
              </p>
            </div>
          )}
          
          {/* Navigation Buttons - Positioned on the right, aligned with greeting */}
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
            <div className="animate-fade-in-up stagger-5">
              <AddExpenseModal onAddExpense={handleAddExpense} />
            </div>
          </div>
        </div>



        {/* Info Bar */}
        <div className="space-y-4">
          <InfoBar expenses={expenses} onUpdateExpense={handleUpdateExpense} onDeleteExpense={handleDeleteExpense} isPrivacyMode={isPrivacyMode} />
        </div>

        {/* Dashboard */}
        <div className="animate-fade-in-up stagger-5">
          <ExpenseDashboard 
            expenses={expenses} 
            onUpdateExpense={handleUpdateExpense}
            isPrivacyMode={isPrivacyMode}
          />
        </div>

        {/* Detailed View Modal */}
        {showDetailedView && (
          <DetailedView 
            expenses={expenses} 
            onClose={() => setShowDetailedView(false)} 
          />
        )}

        {/* History Modal */}
        {showHistory && (
          <ExpenseHistory 
            expenses={expenses} 
            actionLogs={actionLogs}
            onClose={() => setShowHistory(false)} 
          />
        )}
      </div>
    </div>
  );
};

export default Index;
