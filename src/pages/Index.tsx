import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { InfoBar } from "@/components/InfoBar";
import { AddExpenseModal } from "@/components/AddExpenseModal";
import { ExpenseDashboard } from "@/components/ExpenseDashboard";
import { DetailedView } from "@/components/DetailedView";
import { ExpenseHistory } from "@/components/ExpenseHistory";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Expense } from "@/types/expense";
import { BarChart3, History } from "lucide-react";

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

  // Load expenses and action logs from localStorage on component mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem('emi-expenses');
    if (savedExpenses) {
      const parsed = JSON.parse(savedExpenses);
      // Convert date strings back to Date objects
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

    const savedLogs = localStorage.getItem('action-logs');
    if (savedLogs) {
      const parsed = JSON.parse(savedLogs);
      const logsWithDates = parsed.map((log: any) => ({
        ...log,
        timestamp: new Date(log.timestamp)
      }));
      setActionLogs(logsWithDates);
    }
  }, []);

  // Save expenses to localStorage whenever expenses change
  useEffect(() => {
    localStorage.setItem('emi-expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Save action logs to localStorage whenever logs change
  useEffect(() => {
    localStorage.setItem('action-logs', JSON.stringify(actionLogs));
  }, [actionLogs]);

  const addActionLog = (action: string, details: string, type: ActionLog['type']) => {
    const newLog: ActionLog = {
      id: Date.now().toString(),
      action,
      details,
      timestamp: new Date(),
      type
    };
    setActionLogs(prev => [newLog, ...prev]);
  };

  const handleAddExpense = (newExpenseData: Omit<Expense, 'id' | 'createdAt' | 'partialPayments'>) => {
    const newExpense: Expense = {
      ...newExpenseData,
      id: Date.now().toString(),
      createdAt: new Date(),
      partialPayments: []
    };
    setExpenses(prev => [...prev, newExpense]);
    addActionLog(
      'Added New Expense',
      `Created ${newExpenseData.type}: ${newExpenseData.name} - ₹${newExpenseData.amount}/month`,
      'add'
    );
  };

  const handleUpdateExpense = (updatedExpense: Expense) => {
    const originalExpense = expenses.find(e => e.id === updatedExpense.id);
    setExpenses(prev => 
      prev.map(expense => 
        expense.id === updatedExpense.id ? updatedExpense : expense
      )
    );
    
    if (originalExpense) {
      // Check if it's a partial payment
      if (updatedExpense.partialPayments.length > originalExpense.partialPayments.length) {
        const latestPayment = updatedExpense.partialPayments[updatedExpense.partialPayments.length - 1];
        addActionLog(
          'Partial Payment Made',
          `Paid ₹${latestPayment.amount} towards ${updatedExpense.name}`,
          'payment'
        );
      } else {
        addActionLog(
          'Updated Expense',
          `Modified ${updatedExpense.name}`,
          'update'
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Title - Top Left with Padding */}
      <div className="fixed top-6 left-6 z-30 space-y-2">
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
      <div className="fixed top-6 right-6 z-40">
        <ThemeToggle />
      </div>

      {/* History Button - Below Theme Toggle */}
      <div className="fixed top-20 right-6 z-40">
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

      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-center md:justify-end items-center mb-6 gap-8 animate-fade-in-up pt-16">
          
          <div className="flex flex-wrap gap-4 animate-fade-in-up stagger-4">
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
        <InfoBar expenses={expenses} onUpdateExpense={handleUpdateExpense} />

        {/* Dashboard */}
        <div className="animate-fade-in-up stagger-5">
          <ExpenseDashboard 
            expenses={expenses} 
            onUpdateExpense={handleUpdateExpense}
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
