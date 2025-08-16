import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Expense, ExpenseType, Currency } from "@/types/expense";
import { useToast } from "@/hooks/use-toast";

interface AddExpenseModalProps {
  onAddExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'partialPayments'>) => void;
}

export const AddExpenseModal = ({ onAddExpense }: AddExpenseModalProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    currency: 'INR' as Currency,
    type: 'EMI' as ExpenseType,
    deductionDay: '',
    isRecurring: false,
    totalMonths: '',
    remainingMonths: '',
    remainingAmount: ''
  });
  const { toast } = useToast();



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.amount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (!formData.isRecurring && !formData.totalMonths) {
      toast({
        title: "Error",
        description: "Please specify total months for non-recurring expenses",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(formData.amount);
    const deductionDay = formData.deductionDay ? parseInt(formData.deductionDay) : 1; // Default to 1st if not specified
    
    const expenseData: any = {
      name: formData.name,
      amount,
      currency: formData.currency,
      type: formData.type,
      deductionDay,
      isRecurring: formData.isRecurring
    };

    if (!formData.isRecurring) {
      const totalMonths = parseInt(formData.totalMonths);
      const repaidMonths = formData.remainingMonths ? parseInt(formData.remainingMonths) : 0; // Repaid months (how many already paid)
      const remainingMonths = totalMonths - repaidMonths; // Calculate remaining months
      
      const remainingAmount = formData.remainingAmount ? parseFloat(formData.remainingAmount) : amount * remainingMonths;
      
      expenseData.totalMonths = totalMonths;
      expenseData.remainingMonths = remainingMonths; // Store the calculated remaining months
      expenseData.remainingAmount = remainingAmount;
    }

    onAddExpense(expenseData);

    setFormData({
      name: '',
      amount: '',
      currency: 'INR',
      type: 'EMI',
      deductionDay: '',
      isRecurring: false,
      totalMonths: '',
      remainingMonths: '',
      remainingAmount: ''
    });
    
    setOpen(false);
    toast({
      title: "Success",
      description: "Expense added successfully!"
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          size="lg" 
          className="gap-3 rounded-full px-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm"
          onClick={() => setOpen(true)}
        >
          <Plus className="h-5 w-5" />
          Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[900px] w-[90vw] max-h-[90vh] overflow-y-auto premium-card border-border/40 shadow-premium">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-bold text-foreground">Add New Expense</DialogTitle>
          <p className="text-muted-foreground">Create a new EMI or recurring expense to track</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-8 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-sm font-semibold text-foreground">Expense Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Home Loan EMI"
                  className="bg-background border-border/40 rounded-xl h-12 text-lg focus:ring-2 focus:ring-blue-accent/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="amount" className="text-sm font-semibold text-foreground">Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="50000"
                    className="bg-background border-border/40 rounded-xl h-12 text-lg focus:ring-2 focus:ring-blue-accent/20"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="currency" className="text-sm font-semibold text-foreground">Currency</Label>
                  <Select value={formData.currency} onValueChange={(value: Currency) => setFormData(prev => ({ ...prev, currency: value }))}>
                    <SelectTrigger className="bg-background border-border/40 rounded-xl h-12 text-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="premium-card border-border/40">
                      <SelectItem value="INR">INR (₹)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="JPY">JPY (¥)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="type" className="text-sm font-semibold text-foreground">Expense Type</Label>
                <Select value={formData.type} onValueChange={(value: ExpenseType) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger className="bg-background border-border/40 rounded-xl h-12 text-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="premium-card border-border/40">
                    <SelectItem value="EMI">EMI</SelectItem>
                    <SelectItem value="Personal Loan">Personal Loan</SelectItem>
                    <SelectItem value="Borrowed from Someone">Borrowed from Someone</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="deductionDay" className="text-sm font-semibold text-foreground">Deduction Day (defaults to 1st)</Label>
                <Input
                  id="deductionDay"
                  type="number"
                  min="1"
                  max="31"
                  value={formData.deductionDay}
                  onChange={(e) => setFormData(prev => ({ ...prev, deductionDay: e.target.value }))}
                  placeholder="1 (default)"
                  className="bg-background border-border/40 rounded-xl h-12 text-lg focus:ring-2 focus:ring-blue-accent/20"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-accent/10 to-purple-accent/10 rounded-xl border border-blue-accent/20">
                  <input
                    type="checkbox"
                    id="isRecurring"
                    checked={formData.isRecurring}
                    onChange={(e) => setFormData(prev => ({ ...prev, isRecurring: e.target.checked }))}
                    className="h-5 w-5 rounded border-border/40 text-blue-accent focus:ring-blue-accent/20"
                  />
                  <Label htmlFor="isRecurring" className="text-sm font-semibold text-foreground">Recurring</Label>
                </div>
              </div>

              {!formData.isRecurring && (
                <>
                  <div className="space-y-3">
                    <Label htmlFor="totalMonths" className="text-sm font-semibold text-foreground">Total Months *</Label>
                    <Input
                      id="totalMonths"
                      type="number"
                      value={formData.totalMonths}
                      onChange={(e) => setFormData(prev => ({ ...prev, totalMonths: e.target.value }))}
                      placeholder="240"
                      className="bg-background border-border/40 rounded-xl h-12 text-lg focus:ring-2 focus:ring-blue-accent/20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="remainingMonths" className="text-sm font-semibold text-foreground">Repaid Months</Label>
                      <Input
                        id="remainingMonths"
                        type="number"
                        value={formData.remainingMonths}
                        onChange={(e) => setFormData(prev => ({ ...prev, remainingMonths: e.target.value }))}
                        placeholder="0 (how many months already paid)"
                        className="bg-background border-border/40 rounded-xl h-12 text-lg focus:ring-2 focus:ring-blue-accent/20"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="remainingAmount" className="text-sm font-semibold text-foreground">Remaining Amount</Label>
                      <Input
                        id="remainingAmount"
                        type="number"
                        value={formData.remainingAmount}
                        onChange={(e) => setFormData(prev => ({ ...prev, remainingAmount: e.target.value }))}
                        placeholder="Auto calculated"
                        className="bg-background border-border/40 rounded-xl h-12 text-lg focus:ring-2 focus:ring-blue-accent/20"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-border/20">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-full px-8 h-12">
              Cancel
            </Button>
            <Button type="submit" className="rounded-full px-8 h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              Save Expense
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};