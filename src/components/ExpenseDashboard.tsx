import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  CreditCard, 
  Banknote, 
  Users, 
  Calendar,
  IndianRupee,
  Clock,
  Coins,
  TrendingDown,
  ChevronDown,
  ChevronUp,
  Repeat,
  Timer,
  MoreVertical
} from "lucide-react";
import { Expense, ExpenseType } from "@/types/expense";
import { useToast } from "@/hooks/use-toast";

interface ExpenseDashboardProps {
  expenses: Expense[];
  onUpdateExpense: (expense: Expense) => void;
  isPrivacyMode?: boolean;
}

export const ExpenseDashboard = ({ expenses, onUpdateExpense, isPrivacyMode = false }: ExpenseDashboardProps) => {
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [partialPayment, setPartialPayment] = useState('');
  const [isRecurringExpanded, setIsRecurringExpanded] = useState(true);
  const [isFixedTimeExpanded, setIsFixedTimeExpanded] = useState(true);
  const { toast } = useToast();

  const getExpenseIcon = (type: ExpenseType) => {
    switch (type) {
      case 'EMI':
        return <div className="h-1 w-1 rounded-full bg-green-600" />;
      case 'Personal Loan':
        return <div className="h-1 w-1 rounded-full bg-green-600" />;
      case 'Borrowed from Someone':
        return <div className="h-1 w-1 rounded-full bg-green-600" />;
    }
  };

  const getExpenseColor = (type: ExpenseType) => {
    switch (type) {
      case 'EMI':
        return 'bg-gradient-to-r from-blue-accent/20 to-blue-accent/10 text-blue-accent border-blue-accent/30 shadow-sm';
      case 'Personal Loan':
        return 'bg-gradient-to-r from-purple-accent/20 to-purple-accent/10 text-purple-accent border-purple-accent/30 shadow-sm';
      case 'Borrowed from Someone':
        return 'bg-gradient-to-r from-emerald-accent/20 to-emerald-accent/10 text-emerald-accent border-emerald-accent/30 shadow-sm';
    }
  };

  const formatCurrency = (amount: number, currency: string = 'INR') => {
    if (isPrivacyMode) {
      return '••••••';
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      currencyDisplay: 'symbol'
    }).format(amount).replace(/^₹/, '₹');
  };

  const formatNumber = (num: number) => {
    return isPrivacyMode ? '••' : num.toString();
  };

  const handlePartialPayment = () => {
    if (!selectedExpense || !partialPayment) return;

    const payment = parseFloat(partialPayment);
    if (payment <= 0 || payment > selectedExpense.remainingAmount) {
      toast({
        title: "Error",
        description: "Invalid payment amount",
        variant: "destructive"
      });
      return;
    }

    const updatedExpense = {
      ...selectedExpense,
      remainingAmount: selectedExpense.remainingAmount - payment,
      partialPayments: [
        ...selectedExpense.partialPayments,
        {
          id: Date.now().toString(),
          amount: payment,
          date: new Date(),
          description: `Partial payment of ${formatCurrency(payment)}`
        }
      ]
    };

    // Update remaining months proportionally
    const paymentRatio = payment / selectedExpense.amount;
    const monthsReduced = Math.floor(paymentRatio);
    updatedExpense.remainingMonths = Math.max(0, updatedExpense.remainingMonths - monthsReduced);
    
    // If remaining amount is 0 or less, mark as completed
    if (updatedExpense.remainingAmount <= 0) {
      updatedExpense.remainingMonths = 0;
    }

    onUpdateExpense(updatedExpense);
    setPartialPayment('');
    setSelectedExpense(null);
    
    toast({
      title: "Success",
      description: `Partial payment of ${formatCurrency(payment)} recorded successfully!`
    });
  };

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="p-6 bg-gradient-to-br from-blue-accent/10 to-purple-accent/10 rounded-3xl mb-6 shadow-lg">
          <Coins className="h-12 w-12 text-blue-accent" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-3">No expenses added yet</h3>
        <p className="text-muted-foreground text-lg mb-6 max-w-md">Start tracking your EMIs and recurring expenses to get insights into your financial commitments</p>
      </div>
    );
  }

  // Filter to show only active expenses (not completed)
  console.log('ExpenseDashboard - All expenses:', expenses);
  console.log('ExpenseDashboard - Expenses length:', expenses.length);
  
  if (expenses.length === 0) {
    console.log('ExpenseDashboard - No expenses found, showing empty state');
  }
  
  const activeExpenses = expenses.filter(expense => {
    console.log('ExpenseDashboard - Processing expense:', expense);
    
    // Show recurring expenses always
    if (expense.isRecurring) {
      console.log(`ExpenseDashboard - Expense ${expense.name}: isRecurring=true, showing`);
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

    console.log(`ExpenseDashboard - Expense ${expense.name}: remainingMonths=${expense.remainingMonths}, remainingAmount=${expense.remainingAmount}, totalMonths=${expense.totalMonths}, isActive=${isActive}`);
    return isActive;
  });
  
  console.log('ExpenseDashboard - Active expenses:', activeExpenses);
  console.log('ExpenseDashboard - Active expenses length:', activeExpenses.length);

  // Separate recurring and fixed-time expenses
  const recurringExpenses = activeExpenses.filter(expense => expense.isRecurring);
  const fixedTimeExpenses = activeExpenses.filter(expense => !expense.isRecurring);
  
  console.log('Active expenses:', activeExpenses);
  console.log('Recurring expenses:', recurringExpenses);
  console.log('Fixed time expenses:', fixedTimeExpenses);

  const renderExpenseCard = (expense: Expense, index: number) => {
    const progressPercentage = expense.isRecurring ? 0 : Math.round((((expense.totalMonths || 0) - (expense.remainingMonths || 0)) / (expense.totalMonths || 1)) * 100);
    const staggerClass = `stagger-${Math.min(index + 1, 6)}`;
    
    return (
      <div 
        key={expense.id} 
        className={`relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-white/40 via-white/25 to-white/40 dark:from-gray-800/50 dark:via-gray-700/30 dark:to-gray-800/50 border border-white/40 dark:border-gray-600/40 rounded-3xl hover:shadow-2xl group transition-all duration-500 compact-expense-card hover:scale-[1.02] hover:backdrop-blur-2xl hover:border-white/60 dark:hover:border-gray-500/60`}
        style={{
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Subtle inner glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 dark:from-gray-100/5 dark:via-transparent dark:to-gray-100/5 rounded-3xl pointer-events-none" />
        
        <div className="p-2.5 pb-1.5 flex-shrink-0 relative z-10">
          <div className="flex items-center justify-between min-h-[1.25rem]">
            <div className="flex items-center gap-2 text-base font-bold">
              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 shadow-sm" />
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent font-semibold tracking-tight">{expense.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`${getExpenseColor(expense.type)} px-2.5 py-1 rounded-full font-medium text-xs backdrop-blur-md border-white/40 dark:border-gray-600/40 shadow-sm`}>
                {expense.type}
              </Badge>
              {!expense.isRecurring && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-6 w-6 p-0 rounded-full hover:bg-white/30 dark:hover:bg-gray-800/40 transition-all duration-200 hover:scale-105"
                    >
                      <MoreVertical className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <Dialog>
                      <DialogTrigger asChild>
                        <DropdownMenuItem 
                          className="cursor-pointer"
                          onClick={() => setSelectedExpense(expense)}
                        >
                          Record part payment
                        </DropdownMenuItem>
                      </DialogTrigger>
                  <DialogContent className="fixed inset-0 z-[10000] w-full h-full bg-background backdrop-blur-xl bg-gradient-to-r from-white/20 via-white/10 to-white/20 dark:from-gray-900/30 dark:via-gray-800/20 dark:to-gray-900/30 border border-white/30 dark:border-gray-600/30">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">Make Partial Payment</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 mt-6">
                      <div className="p-6 backdrop-blur-md bg-gradient-to-br from-blue-accent/10 to-purple-accent/10 rounded-2xl border border-blue-accent/20 dark:border-blue-accent/30">
                        <h3 className="font-bold text-lg bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">{selectedExpense?.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Remaining: {formatCurrency(selectedExpense?.remainingAmount || 0, selectedExpense?.currency)}
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="payment" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Payment Amount</Label>
                        <Input
                          id="payment"
                          type="number"
                          value={partialPayment}
                          onChange={(e) => setPartialPayment(e.target.value)}
                          placeholder="Enter amount"
                          max={selectedExpense?.remainingAmount}
                          className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-white/30 dark:border-gray-600/30 rounded-xl h-12 text-lg focus:ring-2 focus:ring-blue-accent/20"
                        />
                      </div>
                      
                      <div className="flex justify-end space-x-3 pt-4">
                        <Button variant="outline" onClick={() => setSelectedExpense(null)} className="rounded-full px-6 backdrop-blur-sm border-white/30 dark:border-gray-600/30">
                          Cancel
                        </Button>
                        <Button variant="gradient" onClick={handlePartialPayment} className="rounded-full px-6 backdrop-blur-sm bg-gradient-to-r from-blue-500/90 to-purple-500/90 hover:from-blue-500 to-purple-500">
                          Record Payment
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                    </Dialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col h-full px-2.5 pb-2.5 pt-0 relative z-10">
          {/* Stats Grid - Enhanced with Apple aesthetics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2 justify-items-center">
            <div className="flex items-center gap-1.5 justify-center w-full">
              <div className="text-center p-1.5 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 dark:from-gray-800/30 dark:to-gray-700/20 backdrop-blur-sm border border-white/20 dark:border-gray-600/20 w-full">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-0.5">Amount</p>
                <p className="text-xs font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">{formatCurrency(expense.amount, expense.currency)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 justify-center w-full">
              <div className="text-center p-1.5 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 dark:from-gray-800/30 dark:to-gray-700/20 backdrop-blur-sm border border-white/20 dark:border-gray-600/20 w-full">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-0.5">Due Day</p>
                <p className="text-xs font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">{expense.deductionDay}{getOrdinalSuffix(expense.deductionDay)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 justify-center w-full">
              <div className="text-center p-1.5 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 dark:from-gray-800/30 dark:to-gray-700/20 backdrop-blur-sm border border-white/20 dark:border-gray-600/20 w-full">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-0.5">
                  {expense.isRecurring ? 'Paid YTD' : 'Remaining'}
                </p>
                <p className="text-xs font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                  {expense.isRecurring 
                    ? formatCurrency(expense.amount * Math.min(new Date().getMonth() + 1, 12), expense.currency)
                    : `${formatNumber(expense.remainingMonths)} months`
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 justify-center w-full">
              <div className="text-center p-1.5 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 dark:from-gray-800/30 dark:to-gray-700/20 backdrop-blur-sm border border-white/20 dark:border-gray-600/20 w-full">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-0.5">
                  {expense.isRecurring ? 'Avg/Month' : 'Balance'}
                </p>
                <p className="text-xs font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                  {expense.isRecurring 
                    ? formatCurrency(expense.amount, expense.currency)
                    : formatCurrency(expense.remainingAmount || 0, expense.currency)
                  }
                </p>
              </div>
            </div>
          </div>
          
          {/* Progress Section - Enhanced with Apple aesthetics */}
          {!expense.isRecurring && (
            <div className="text-center p-2 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 dark:from-gray-800/20 dark:to-gray-700/10 backdrop-blur-sm border border-white/20 dark:border-gray-600/20">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 tracking-wide">Progress</span>
                <span className="text-xs font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">{progressPercentage}%</span>
              </div>
              <div className="w-full backdrop-blur-sm bg-white/30 dark:bg-gray-800/30 rounded-full h-2 overflow-hidden border border-white/40 dark:border-gray-600/40 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-full transition-all duration-700 ease-out shadow-lg"
                  style={{ 
                    width: `${progressPercentage}%`,
                    transitionDelay: `${index * 100 + 200}ms`
                  } as React.CSSProperties}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header - Completed expenses info only */}
      {expenses.length > activeExpenses.length && (
        <div className="flex justify-end">
          <p className="text-sm text-muted-foreground">
            {expenses.length - activeExpenses.length} completed expense{expenses.length - activeExpenses.length !== 1 ? 's' : ''} in history
          </p>
        </div>
      )}
      
      {/* Recurring Expenses Section */}
      {recurringExpenses.length > 0 && (
        <div className="backdrop-blur-xl bg-gradient-to-r from-white/10 via-white/5 to-white/10 dark:from-gray-900/20 dark:via-gray-800/10 dark:to-gray-900/20 border border-white/20 dark:border-gray-700/30 rounded-3xl overflow-hidden shadow-2xl">
          <div 
            className="flex items-center justify-between cursor-pointer p-6 hover:backdrop-blur-md hover:bg-gradient-to-r hover:from-white/20 hover:via-white/10 hover:to-white/20 dark:hover:from-gray-800/30 dark:hover:via-gray-700/20 dark:hover:to-gray-800/30 transition-all duration-500"
            onClick={() => setIsRecurringExpanded(!isRecurringExpanded)}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-3xl shadow-xl backdrop-blur-sm bg-gradient-to-br from-amber-500/90 to-amber-600/90 hover:from-amber-500 to-amber-600 transition-all duration-300" style={{ backgroundColor: '#f59e0b' }}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 text-white drop-shadow-lg"
                >
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                  <path d="M2 17L12 22L22 17" />
                  <path d="M2 12L12 17L22 12" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent tracking-tight">Recurring Expenses</h3>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 tracking-wide">{formatNumber(recurringExpenses.length)} active recurring payment{recurringExpenses.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 tracking-wide">
                {formatCurrency(recurringExpenses.reduce((sum, exp) => sum + exp.amount, 0))} / month
              </span>
              {isRecurringExpanded ? (
                <ChevronUp className="h-5 w-5 text-gray-600 dark:text-gray-400 transition-transform duration-300" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-400 transition-transform duration-300" />
              )}
            </div>
          </div>
          
          {isRecurringExpanded && (
            <div className="border-t border-white/20 dark:border-gray-700/30 backdrop-blur-md bg-gradient-to-b from-white/5 to-transparent dark:from-gray-800/10 dark:to-transparent">
              <div className="p-6 space-y-4">
                {recurringExpenses.map((expense, index) => renderExpenseCard(expense, index))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Fixed-Time Expenses Section */}
      {fixedTimeExpenses.length > 0 && (
        <div className="backdrop-blur-xl bg-gradient-to-r from-white/10 via-white/5 to-white/10 dark:from-gray-900/20 dark:via-gray-800/10 dark:to-gray-900/20 border border-white/20 dark:border-gray-700/30 rounded-3xl overflow-hidden shadow-2xl">
          <div 
            className="flex items-center justify-between cursor-pointer p-6 hover:backdrop-blur-md hover:bg-gradient-to-r hover:from-white/20 hover:via-white/10 hover:to-white/20 dark:hover:from-gray-800/30 dark:hover:via-gray-700/20 dark:hover:to-gray-800/30 transition-all duration-500"
            onClick={() => setIsFixedTimeExpanded(!isFixedTimeExpanded)}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-3xl shadow-xl backdrop-blur-sm bg-gradient-to-br from-pink-500/90 to-pink-600/90 hover:from-pink-500 to-pink-600 transition-all duration-300" style={{ backgroundColor: '#ec4899' }}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 text-white drop-shadow-lg"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12,6 12,12 16,14" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent tracking-tight">Fixed-Term Expenses</h3>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 tracking-wide">{formatNumber(fixedTimeExpenses.length)} active EMI{fixedTimeExpenses.length !== 1 ? 's' : ''} & loan{fixedTimeExpenses.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 tracking-wide">
                  {formatCurrency(fixedTimeExpenses.reduce((sum, exp) => sum + exp.amount, 0))} / month
                </span>
                <div className="text-xs text-muted-foreground">
                  Total due: {formatCurrency(fixedTimeExpenses.reduce((sum, exp) => sum + (exp.remainingAmount || 0), 0))}
                </div>
              </div>
              {isFixedTimeExpanded ? (
                <ChevronUp className="h-5 w-5 text-gray-600 dark:text-gray-400 transition-transform duration-300" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-400 transition-transform duration-300" />
              )}
            </div>
          </div>
          
          {isFixedTimeExpanded && (
            <div className="border-t border-white/20 dark:border-gray-700/30 backdrop-blur-md bg-gradient-to-b from-white/5 to-transparent dark:from-gray-800/10 dark:to-transparent">
              <div className="p-6 space-y-4">
                {fixedTimeExpenses.map((expense, index) => renderExpenseCard(expense, index))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Empty State */}
      {activeExpenses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="p-6 bg-gradient-to-br from-blue-accent/10 to-purple-accent/10 rounded-3xl mb-6 shadow-lg">
            <Coins className="h-12 w-12 text-blue-accent" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-3">No expenses added yet</h3>
          <p className="text-muted-foreground text-lg mb-6 max-w-md">Start tracking your EMIs and recurring expenses to get insights into your financial commitments</p>
        </div>
      )}
    </div>
  );
};

function getOrdinalSuffix(day: number): string {
  const remainder = day % 10;
  const teens = Math.floor(day / 10) % 10 === 1;
  
  if (teens) return 'th';
  
  switch (remainder) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}