import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  Timer
} from "lucide-react";
import { Expense, ExpenseType } from "@/types/expense";
import { useToast } from "@/hooks/use-toast";

interface ExpenseDashboardProps {
  expenses: Expense[];
  onUpdateExpense: (expense: Expense) => void;
}

export const ExpenseDashboard = ({ expenses, onUpdateExpense }: ExpenseDashboardProps) => {
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [partialPayment, setPartialPayment] = useState('');
  const [isRecurringExpanded, setIsRecurringExpanded] = useState(true);
  const [isFixedTimeExpanded, setIsFixedTimeExpanded] = useState(true);
  const { toast } = useToast();

  const getExpenseIcon = (type: ExpenseType) => {
    switch (type) {
      case 'EMI':
        return <CreditCard className="h-4 w-4" />;
      case 'Personal Loan':
        return <Banknote className="h-4 w-4" />;
      case 'Borrowed from Someone':
        return <Users className="h-4 w-4" />;
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
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      currencyDisplay: 'symbol'
    }).format(amount).replace(/^₹/, '₹');
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
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in-up">
        <div className="p-6 bg-gradient-to-br from-blue-accent/10 to-purple-accent/10 rounded-3xl mb-6 shadow-lg">
          <Coins className="h-12 w-12 text-blue-accent" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-3">No expenses added yet</h3>
        <p className="text-muted-foreground text-lg mb-6 max-w-md">Start tracking your EMIs and recurring expenses to get insights into your financial commitments</p>
      </div>
    );
  }

  // Filter to show only active expenses (not completed)
  console.log('All expenses:', expenses);
  const activeExpenses = expenses.filter(expense => {
    const isActive = expense.isRecurring || (expense.remainingMonths > 0 && (expense.remainingAmount === undefined || expense.remainingAmount > 0));
    console.log(`Expense ${expense.name}: isRecurring=${expense.isRecurring}, remainingMonths=${expense.remainingMonths}, remainingAmount=${expense.remainingAmount}, isActive=${isActive}`);
    return isActive;
  });

  // Separate recurring and fixed-time expenses
  const recurringExpenses = activeExpenses.filter(expense => expense.isRecurring);
  const fixedTimeExpenses = activeExpenses.filter(expense => !expense.isRecurring);

  const renderExpenseCard = (expense: Expense, index: number) => {
    const progressPercentage = expense.isRecurring ? 0 : Math.round((((expense.totalMonths || 0) - (expense.remainingMonths || 0)) / (expense.totalMonths || 1)) * 100);
    const staggerClass = `stagger-${Math.min(index + 1, 6)}`;
    
    return (
      <div 
        key={expense.id} 
        className={`bg-background border border-border/30 rounded-xl hover:shadow-md group transition-all duration-300 compact-expense-card animate-fade-in-up ${staggerClass}`}
      >
        <div className="p-3 pb-2 flex-shrink-0">
          <div className="flex items-center justify-between min-h-[1.5rem]">
            <div className="flex items-center gap-1.5 text-base font-bold">
              <div className="p-1 bg-gradient-to-br from-blue-accent/20 to-blue-accent/10 rounded-md">
                {getExpenseIcon(expense.type)}
              </div>
              {expense.name}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`${getExpenseColor(expense.type)} px-1.5 py-0.5 rounded-full font-medium text-xs`}>
                {expense.type}
              </Badge>
              {!expense.isRecurring && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="premium" 
                      size="sm"
                      className="rounded-full px-3 py-0.5 text-xs hover:scale-105 transition-transform duration-200 h-5"
                      onClick={() => setSelectedExpense(expense)}
                    >
                      Partial Payment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] premium-card border-border/40">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold">Make Partial Payment</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 mt-6">
                      <div className="p-6 bg-gradient-to-br from-blue-accent/10 to-purple-accent/10 rounded-2xl border border-blue-accent/20">
                        <h3 className="font-bold text-lg">{selectedExpense?.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Remaining: {formatCurrency(selectedExpense?.remainingAmount || 0, selectedExpense?.currency)}
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="payment" className="text-sm font-medium">Payment Amount</Label>
                        <Input
                          id="payment"
                          type="number"
                          value={partialPayment}
                          onChange={(e) => setPartialPayment(e.target.value)}
                          placeholder="Enter amount"
                          max={selectedExpense?.remainingAmount}
                          className="bg-background border-border/40 rounded-xl h-12 text-lg"
                        />
                      </div>
                      
                      <div className="flex justify-end space-x-3 pt-4">
                        <Button variant="outline" onClick={() => setSelectedExpense(null)} className="rounded-full px-6">
                          Cancel
                        </Button>
                        <Button variant="gradient" onClick={handlePartialPayment} className="rounded-full px-6">
                          Record Payment
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col h-full px-3 pb-3 pt-0">
          {/* Stats Grid - Ultra Compact */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
            <div className="flex items-center gap-1.5">
              <div className="p-1 bg-blue-accent/10 rounded-md">
                <IndianRupee className="h-2.5 w-2.5 text-blue-accent" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Amount</p>
                <p className="text-xs font-bold text-foreground">{formatCurrency(expense.amount, expense.currency)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5">
              <div className="p-1 bg-emerald-accent/10 rounded-md">
                <Calendar className="h-2.5 w-2.5 text-emerald-accent" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Due Day</p>
                <p className="text-xs font-bold text-foreground">{expense.deductionDay}{getOrdinalSuffix(expense.deductionDay)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5">
              <div className="p-1 bg-purple-accent/10 rounded-md">
                <Clock className="h-2.5 w-2.5 text-purple-accent" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Remaining</p>
                <p className="text-xs font-bold text-foreground">
                  {expense.isRecurring ? 'Recurring' : `${expense.remainingMonths} months`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5">
              <div className="p-1 bg-orange-accent/10 rounded-md">
                <TrendingDown className="h-2.5 w-2.5 text-orange-accent" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Balance</p>
                <p className="text-xs font-bold text-foreground">
                  {expense.isRecurring ? 'N/A' : formatCurrency(expense.remainingAmount || 0, expense.currency)}
                </p>
              </div>
            </div>
          </div>
          
          {/* Progress Section - Only for fixed-time expenses */}
          {!expense.isRecurring && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-muted-foreground">Progress</span>
                <span className="text-xs font-bold text-foreground">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-muted/20 rounded-full h-1 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-accent to-emerald-accent rounded-full transition-all duration-700 ease-out"
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
        <div className="premium-card overflow-hidden">
          <div 
            className="flex items-center justify-between cursor-pointer p-4 hover:bg-muted/5 transition-all duration-300"
            onClick={() => setIsRecurringExpanded(!isRecurringExpanded)}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-emerald-accent/20 to-emerald-accent/10 rounded-xl">
                <Repeat className="h-5 w-5 text-emerald-accent" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Recurring Expenses</h3>
                <p className="text-sm text-muted-foreground">{recurringExpenses.length} active recurring payment{recurringExpenses.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                {formatCurrency(recurringExpenses.reduce((sum, exp) => sum + exp.amount, 0))} / month
              </span>
              {isRecurringExpanded ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
          </div>
          
          {isRecurringExpanded && (
            <div className="border-t border-border/20 bg-muted/5">
              <div className="p-4 space-y-3 animate-fade-in-up">
                {recurringExpenses.map((expense, index) => renderExpenseCard(expense, index))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Fixed-Time Expenses Section */}
      {fixedTimeExpenses.length > 0 && (
        <div className="premium-card overflow-hidden">
          <div 
            className="flex items-center justify-between cursor-pointer p-4 hover:bg-muted/5 transition-all duration-300"
            onClick={() => setIsFixedTimeExpanded(!isFixedTimeExpanded)}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-accent/20 to-blue-accent/10 rounded-xl">
                <Timer className="h-5 w-5 text-blue-accent" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Fixed-Term Expenses</h3>
                <p className="text-sm text-muted-foreground">{fixedTimeExpenses.length} active EMI{fixedTimeExpenses.length !== 1 ? 's' : ''} & loan{fixedTimeExpenses.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                {formatCurrency(fixedTimeExpenses.reduce((sum, exp) => sum + exp.amount, 0))} / month
              </span>
              {isFixedTimeExpanded ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
          </div>
          
          {isFixedTimeExpanded && (
            <div className="border-t border-border/20 bg-muted/5">
              <div className="p-4 space-y-3 animate-fade-in-up">
                {fixedTimeExpenses.map((expense, index) => renderExpenseCard(expense, index))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Empty State */}
      {activeExpenses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in-up">
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