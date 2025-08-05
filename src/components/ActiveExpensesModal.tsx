import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  X, 
  Wallet, 
  Edit3, 
  Trash2, 
  IndianRupee, 
  Calendar, 
  Clock, 
  TrendingDown,
  CreditCard,
  Banknote,
  Users,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Expense, ExpenseType } from "@/types/expense";
import { useToast } from "@/hooks/use-toast";

interface ActiveExpensesModalProps {
  expenses: Expense[];
  onClose: () => void;
  onUpdateExpense: (expense: Expense) => void;
  onDeleteExpense?: (expenseId: string) => void;
}

export const ActiveExpensesModal = ({ expenses, onClose, onUpdateExpense, onDeleteExpense }: ActiveExpensesModalProps) => {
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    amount: '',
    type: '' as ExpenseType,
    deductionDay: '',
    isRecurring: false,
    totalMonths: '',
    remainingMonths: ''
  });
  const { toast } = useToast();

  const activeExpenses = expenses.filter(expense => 
    expense.isRecurring || (expense.remainingMonths > 0 && (expense.remainingAmount === undefined || expense.remainingAmount > 0))
  );

  const completedExpenses = expenses.filter(expense => 
    !expense.isRecurring && (expense.remainingMonths === 0 || (expense.remainingAmount !== undefined && expense.remainingAmount <= 0))
  );

  const formatCurrency = (amount: number, currency: string = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      currencyDisplay: 'symbol'
    }).format(amount).replace(/^₹/, '₹');
  };

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
        return 'bg-gradient-to-r from-blue-accent/20 to-blue-accent/10 text-blue-accent border-blue-accent/30';
      case 'Personal Loan':
        return 'bg-gradient-to-r from-purple-accent/20 to-purple-accent/10 text-purple-accent border-purple-accent/30';
      case 'Borrowed':
        return 'bg-gradient-to-r from-emerald-accent/20 to-emerald-accent/10 text-emerald-accent border-emerald-accent/30';
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setEditForm({
      name: expense.name,
      amount: expense.amount.toString(),
      type: expense.type,
      deductionDay: expense.deductionDay.toString(),
      isRecurring: expense.isRecurring,
      totalMonths: expense.totalMonths?.toString() || '',
      remainingMonths: expense.remainingMonths?.toString() || ''
    });
  };

  const handleSaveEdit = () => {
    if (!editingExpense) return;

    const monthlyPayment = parseFloat(editForm.amount);
    const remainingMonths = parseInt(editForm.remainingMonths);
    const calculatedRemainingAmount = monthlyPayment * remainingMonths;

    console.log('Edit Debug:', {
      monthlyPayment,
      remainingMonths,
      calculatedRemainingAmount,
      editForm
    });

    const updatedExpense: Expense = {
      ...editingExpense,
      name: editForm.name,
      amount: monthlyPayment,
      type: editForm.type,
      deductionDay: parseInt(editForm.deductionDay),
      isRecurring: editForm.isRecurring,
      totalMonths: editForm.isRecurring ? undefined : parseInt(editForm.totalMonths),
      remainingMonths: editForm.isRecurring ? undefined : remainingMonths,
      remainingAmount: editForm.isRecurring ? undefined : calculatedRemainingAmount
    };

    console.log('Updated Expense:', updatedExpense);

    onUpdateExpense(updatedExpense);
    setEditingExpense(null);
    toast({
      title: "Success",
      description: "Expense updated successfully!"
    });
  };

  const handleDeleteExpense = (expenseId: string) => {
    if (onDeleteExpense) {
      // Add confirmation dialog
      if (window.confirm('Are you sure you want to delete this expense? This action cannot be undone.')) {
        onDeleteExpense(expenseId);
        toast({
          title: "Success",
          description: "Expense deleted successfully!"
        });
      }
    }
  };

  const renderExpenseCard = (expense: Expense, isCompleted = false) => {
    const progressPercentage = expense.isRecurring ? 0 : Math.round((((expense.totalMonths || 0) - (expense.remainingMonths || 0)) / (expense.totalMonths || 1)) * 100);
    
    return (
              <Card key={expense.id} className={`premium-card transition-all duration-200 hover:shadow-lg ${isCompleted ? 'opacity-75' : ''}`}>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getExpenseIcon(expense.type)}
                <div>
                  <h3 className="font-bold text-lg text-foreground">{expense.name}</h3>
                  <Badge variant="outline" className={`${getExpenseColor(expense.type)} text-xs`}>
                    {expense.type}
                  </Badge>
                </div>
              </div>
              
              {!isCompleted && (
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="rounded-full hover:bg-blue-accent/10"
                        onClick={() => handleEditExpense(expense)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto premium-card">
                      <DialogHeader>
                        <DialogTitle>Edit Expense</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Expense Name</Label>
                          <Input
                            id="name"
                            value={editForm.name}
                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                            className="rounded-xl"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                              id="amount"
                              type="number"
                              value={editForm.amount}
                              onChange={(e) => setEditForm({...editForm, amount: e.target.value})}
                              className="rounded-xl"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="deductionDay">Due Day</Label>
                            <Input
                              id="deductionDay"
                              type="number"
                              min="1"
                              max="31"
                              value={editForm.deductionDay}
                              onChange={(e) => setEditForm({...editForm, deductionDay: e.target.value})}
                              className="rounded-xl"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="type">Type</Label>
                          <Select value={editForm.type} onValueChange={(value: ExpenseType) => setEditForm({...editForm, type: value})}>
                            <SelectTrigger className="rounded-xl">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="EMI">EMI</SelectItem>
                              <SelectItem value="Personal Loan">Personal Loan</SelectItem>
                              <SelectItem value="Borrowed from Someone">Borrowed from Someone</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {!editForm.isRecurring && (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="totalMonths">Total Months</Label>
                              <Input
                                id="totalMonths"
                                type="number"
                                value={editForm.totalMonths}
                                onChange={(e) => setEditForm({...editForm, totalMonths: e.target.value})}
                                className="rounded-xl"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="remainingMonths">Remaining Months</Label>
                              <Input
                                id="remainingMonths"
                                type="number"
                                value={editForm.remainingMonths}
                                onChange={(e) => setEditForm({...editForm, remainingMonths: e.target.value})}
                                className="rounded-xl"
                              />
                            </div>
                          </div>
                        )}
                        
                        <div className="flex justify-end space-x-3 pt-6 border-t border-border/20 mt-6">
                          <Button variant="outline" onClick={() => setEditingExpense(null)}>
                            Cancel
                          </Button>
                          <Button 
                            variant="gradient" 
                            onClick={handleSaveEdit}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-102"
                          >
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="rounded-full hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleDeleteExpense(expense.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              {isCompleted && (
                <div className="flex items-center gap-2 text-emerald-accent">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">Completed</span>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="flex items-center gap-2">
                <IndianRupee className="h-4 w-4 text-blue-accent" />
                <div>
                  <p className="text-xs text-muted-foreground">Amount</p>
                  <p className="font-bold text-sm">{formatCurrency(expense.amount, expense.currency)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-emerald-accent" />
                <div>
                  <p className="text-xs text-muted-foreground">Due Day</p>
                  <p className="font-bold text-sm">{expense.deductionDay}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-accent" />
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="font-bold text-sm">
                    {expense.isRecurring ? 'Recurring' : `${expense.remainingMonths || 0} months`}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-orange-accent" />
                <div>
                  <p className="text-xs text-muted-foreground">Balance</p>
                  <p className="font-bold text-sm">
                    {expense.isRecurring ? 'N/A' : formatCurrency(expense.remainingAmount || 0, expense.currency)}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            {!expense.isRecurring && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-muted-foreground">Progress</span>
                  <span className="text-xs font-bold text-foreground">{progressPercentage}%</span>
                </div>
                <div className="w-full bg-muted/20 rounded-full h-2">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-accent to-emerald-accent rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-lg z-[100] flex items-center justify-center p-4 animate-fade-in-up">
      <Card className="w-full max-w-7xl h-[90vh] overflow-hidden premium-card border-border/40 shadow-premium animate-scale-in flex flex-col">
        <CardHeader className="flex-shrink-0 flex flex-row items-center justify-between py-6 px-8 bg-gradient-to-r from-purple-accent/5 to-blue-accent/5 border-b border-border/20">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-accent/20 to-purple-accent/10 rounded-2xl">
              <Wallet className="h-6 w-6 text-purple-accent" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold text-foreground">Expense Management</CardTitle>
              <p className="text-muted-foreground font-medium">Manage your active and completed expenses</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-12 w-12 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-8">
          <div className="space-y-8">
            {/* Active Expenses */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-accent/20 to-blue-accent/10 rounded-xl">
                  <AlertCircle className="h-5 w-5 text-blue-accent" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Active Expenses</h2>
                  <p className="text-muted-foreground">{activeExpenses.length} active expense{activeExpenses.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              
              {activeExpenses.length > 0 ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {activeExpenses.map(expense => renderExpenseCard(expense, false))}
                </div>
              ) : (
                <Card className="premium-card">
                  <CardContent className="p-12 text-center">
                    <div className="p-6 bg-gradient-to-br from-blue-accent/10 to-purple-accent/10 rounded-3xl mb-6 inline-block">
                      <Wallet className="h-12 w-12 text-blue-accent" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">No Active Expenses</h3>
                    <p className="text-muted-foreground">All your expenses have been completed!</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Completed Expenses */}
            {completedExpenses.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-emerald-accent/20 to-emerald-accent/10 rounded-xl">
                    <CheckCircle className="h-5 w-5 text-emerald-accent" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Completed Expenses</h2>
                    <p className="text-muted-foreground">{completedExpenses.length} completed expense{completedExpenses.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {completedExpenses.map(expense => renderExpenseCard(expense, true))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};