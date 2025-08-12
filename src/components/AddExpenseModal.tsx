import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { Expense, ExpenseType, Currency } from '@/types/expense';
import { useToast } from '@/hooks/use-toast';
import { useModal } from '@/contexts/ModalContext';

interface AddExpenseModalProps {
  onAddExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'partialPayments'>) => void;
}

export const AddExpenseModal = ({ onAddExpense }: AddExpenseModalProps) => {
  const { openModal, closeModal } = useModal();
  const [open, setOpen] = useState(false);
  type Frequency =
    | 'daily'
    | 'weekly'
    | 'fortnightly'
    | 'monthly'
    | 'half-yearly'
    | 'yearly'
    | 'custom';

  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    currency: 'INR' as Currency,
    type: 'EMI' as ExpenseType,
    deductionDay: '',
    isRecurring: false,
    frequency: 'monthly' as Frequency,
    equateMonthly: true,
    intervalDays: '30',
    totalMonths: '',
    remainingMonths: '',
    remainingAmount: '',
  });
  const [forexRate, setForexRate] = useState<number | null>(null);
  const [lockRate, setLockRate] = useState(true);
  const [forexLoading, setForexLoading] = useState(false);
  const [forexError, setForexError] = useState<string | null>(null);
  const { toast } = useToast();

  // Track modal state
  useEffect(() => {
    if (open) {
      openModal();
    } else {
      closeModal();
    }
  }, [open, openModal, closeModal]);

  const occurrencesPerYear = (frequency: Frequency): number => {
    switch (frequency) {
      case 'daily':
        return 365;
      case 'weekly':
        return 52;
      case 'fortnightly':
        return 26;
      case 'monthly':
        return 12;
      case 'half-yearly':
        return 2;
      case 'yearly':
        return 1;
      case 'custom': {
        const days = Math.max(1, parseInt(formData.intervalDays || '30'));
        return 365 / days;
      }
    }
  };

  const normalizeToMonthly = (perOccurrenceAmount: number, frequency: Frequency): number => {
    if (frequency === 'monthly') return perOccurrenceAmount;
    if (formData.equateMonthly) {
      return (perOccurrenceAmount * occurrencesPerYear(frequency)) / 12;
    }
    // Non-equated approximation per month
    switch (frequency) {
      case 'daily':
        return perOccurrenceAmount * 30;
      case 'weekly':
        return (perOccurrenceAmount * 52) / 12;
      case 'fortnightly':
        return (perOccurrenceAmount * 26) / 12;
      case 'half-yearly':
        return perOccurrenceAmount / 6;
      case 'yearly':
        return perOccurrenceAmount / 12;
      case 'custom': {
        const days = Math.max(1, parseInt(formData.intervalDays || '30'));
        return (perOccurrenceAmount * 30) / days;
      }
      default:
        return perOccurrenceAmount;
    }
  };

  // Fetch forex rate when currency changes (and not INR)
  useEffect(() => {
    async function fetchRate() {
      setForexError(null);
      setForexRate(null);
      if (formData.currency === 'INR') return;
      try {
        setForexLoading(true);
        const res = await fetch(`https://open.er-api.com/v6/latest/${formData.currency}`);
        const data = (await res.json()) as { result?: string; rates?: Record<string, number> };
        const rate = data?.rates?.INR;
        if (typeof rate === 'number') setForexRate(rate);
        else setForexError('FX rate unavailable');
      } catch (e) {
        setForexError('Failed to fetch FX rate');
      } finally {
        setForexLoading(false);
      }
    }
    fetchRate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.currency]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.amount) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.isRecurring && !formData.totalMonths) {
      toast({
        title: 'Error',
        description: 'Please specify total months for non-recurring expenses',
        variant: 'destructive',
      });
      return;
    }

    const inputAmount = parseFloat(formData.amount);
    let amount = normalizeToMonthly(inputAmount, formData.frequency);
    // Convert to INR if needed and locked
    if (formData.currency !== 'INR' && lockRate && forexRate) {
      amount = amount * forexRate;
    }
    const deductionDay = formData.deductionDay ? parseInt(formData.deductionDay) : 1; // Default to 1st if not specified

    const expenseData: Omit<Expense, 'id' | 'createdAt' | 'partialPayments'> = {
      name: formData.name,
      amount,
      currency: formData.currency === 'INR' || !forexRate || !lockRate ? formData.currency : 'INR',
      type: formData.type,
      deductionDay,
      isRecurring: formData.isRecurring,
    };

    if (!formData.isRecurring) {
      const totalMonths = parseInt(formData.totalMonths);
      const repaidMonths = formData.remainingMonths ? parseInt(formData.remainingMonths) : 0; // Repaid months (how many already paid)
      const remainingMonths = totalMonths - repaidMonths; // Calculate remaining months

      const remainingAmount = formData.remainingAmount
        ? parseFloat(formData.remainingAmount)
        : amount * remainingMonths;

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
      frequency: 'monthly',
      equateMonthly: true,
      intervalDays: '30',
      totalMonths: '',
      remainingMonths: '',
      remainingAmount: '',
    });
    setForexRate(null);
    setForexError(null);

    setOpen(false);
    toast({
      title: 'Success',
      description: 'Expense added successfully!',
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="gap-3 rounded-full px-8 w-40 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-102 backdrop-blur-sm"
          onClick={() => setOpen(true)}
        >
          <Plus className="h-5 w-5" />
          Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[50rem] w-[98vw] sm:w-[92vw] max-h-[90vh] overflow-y-auto rounded-[20px] sm:rounded-[28px] shadow-2xl border border-border/40 bg-gradient-to-br from-card to-background">
        <DialogHeader className="pb-1">
          <DialogTitle className="text-2xl sm:text-3xl font-extrabold gradient-text animate-gradient-x">
            Add New Expense
          </DialogTitle>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Track payments with flexible frequency and optional remaining balance auto-calc
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-1">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr] items-start gap-4 md:gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Recurring toggle moved to top-left */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 p-3 bg-gradient-to-r from-blue-accent/10 to-purple-accent/10 rounded-xl border border-blue-accent/20">
                  <input
                    type="checkbox"
                    id="isRecurring"
                    checked={formData.isRecurring}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, isRecurring: e.target.checked }))
                    }
                    className="h-4 w-4 rounded border-border/40 text-blue-accent focus:ring-blue-accent/20"
                  />
                  <Label htmlFor="isRecurring" className="text-xs font-semibold text-foreground">
                    Recurring
                  </Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-semibold text-foreground">
                  Expense Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Home Loan EMI"
                  className="bg-background border-border/40 rounded-xl h-10 text-base focus:ring-2 focus:ring-blue-accent/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-3">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-xs font-semibold text-foreground">
                    Amount *
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                    placeholder="50000"
                    className="bg-background border-border/40 rounded-xl h-10 text-base focus:ring-2 focus:ring-blue-accent/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency" className="text-xs font-semibold text-foreground">
                    Currency
                  </Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value: Currency) =>
                      setFormData((prev) => ({ ...prev, currency: value }))
                    }
                  >
                    <SelectTrigger className="bg-background border-border/40 rounded-xl h-10 text-base">
                      <SelectValue placeholder="Choose currency" />
                    </SelectTrigger>
                    <SelectContent className="premium-card border-border/40 radix-select-content">
                      <SelectItem value="INR">INR (₹)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="JPY">JPY (¥)</SelectItem>
                    </SelectContent>
                  </Select>
                  {/* FX lock moved to right column bottom-right for better visual balance */}
                </div>
              </div>

              {/* Frequency selector */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-foreground">Expense Frequency</Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(value: Frequency) =>
                    setFormData((prev) => ({ ...prev, frequency: value }))
                  }
                >
                  <SelectTrigger className="bg-background border-border/40 rounded-xl h-10 text-sm sm:text-base">
                    <SelectValue placeholder="Monthly" />
                  </SelectTrigger>
                  <SelectContent className="premium-card border-border/40 radix-select-content">
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="fortnightly">Fortnightly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="half-yearly">Half-yearly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                    <SelectItem value="custom">Custom…</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-muted-foreground">
                  We'll normalize this to a monthly amount for dashboards.
                </p>
                {formData.frequency === 'custom' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="intervalDays">Custom interval (days)</Label>
                      <Input
                        id="intervalDays"
                        type="number"
                        min="1"
                        value={formData.intervalDays}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, intervalDays: e.target.value }))
                        }
                        className="bg-background border-border/40 rounded-xl h-10"
                      />
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2 mt-1.5 px-0.5">
                  <input
                    id="equateMonthly"
                    type="checkbox"
                    checked={formData.equateMonthly}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, equateMonthly: e.target.checked }))
                    }
                    className="h-3.5 w-3.5 rounded border-border/40"
                  />
                  <Label htmlFor="equateMonthly" className="text-xs leading-tight">
                    Equate as monthly transaction (annualized/12)
                  </Label>
                </div>
              </div>

              {/* Expense Type removed per request (defaults to EMI under the hood) */}
            </div>

            {/* Divider */}
            <div
              className="hidden md:block w-px h-full bg-gradient-to-b from-transparent via-border/80 to-transparent"
              aria-hidden
            />

            {/* Right Column */}
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="deductionDay" className="text-xs font-semibold text-foreground">
                  Deduction Day (defaults to 1st)
                </Label>
                <Input
                  id="deductionDay"
                  type="number"
                  min="1"
                  max="31"
                  value={formData.deductionDay}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, deductionDay: e.target.value }))
                  }
                  placeholder="1 (default)"
                  className="bg-background border-border/40 rounded-xl h-10 text-base focus:ring-2 focus:ring-blue-accent/20"
                />
              </div>

              {/* (Recurring toggle moved to left column) */}

              {!formData.isRecurring && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="totalMonths" className="text-xs font-semibold text-foreground">
                      Total Months *
                    </Label>
                    <Input
                      id="totalMonths"
                      type="number"
                      value={formData.totalMonths}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, totalMonths: e.target.value }))
                      }
                      placeholder="240"
                      className="bg-background border-border/40 rounded-xl h-10 text-base focus:ring-2 focus:ring-blue-accent/20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-3">
                    <div className="space-y-2">
                      <Label
                        htmlFor="remainingMonths"
                        className="text-xs font-semibold text-foreground"
                      >
                        Repaid Months
                      </Label>
                      <Input
                        id="remainingMonths"
                        type="number"
                        value={formData.remainingMonths}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, remainingMonths: e.target.value }))
                        }
                        placeholder="0 (how many months already paid)"
                        className="bg-background border-border/40 rounded-xl h-10 text-base focus:ring-2 focus:ring-blue-accent/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="remainingAmount"
                        className="text-xs font-semibold text-foreground"
                      >
                        Remaining Amount
                      </Label>
                      <Input
                        id="remainingAmount"
                        type="number"
                        value={formData.remainingAmount}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, remainingAmount: e.target.value }))
                        }
                        placeholder="Auto calculated"
                        className="bg-background border-border/40 rounded-xl h-10 text-base focus:ring-2 focus:ring-blue-accent/20"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* FX lock summary box (bottom-right) */}
              {formData.currency !== 'INR' && (
                <div className="mt-2">
                  <div className="w-full text-[11px] text-muted-foreground rounded-xl border border-border/40 px-3 py-2 bg-secondary/40 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <label htmlFor="lockRate" className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          id="lockRate"
                          checked={lockRate}
                          onChange={(e) => setLockRate(e.target.checked)}
                          className="h-3.5 w-3.5 rounded border-border/40"
                        />
                        <span className="inline-flex items-center gap-1">
                          <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
                            ₹
                          </span>
                          <span className="font-medium leading-tight">Locked FX</span>
                        </span>
                      </label>
                      <span className="tabular-nums text-foreground/80 leading-tight">
                        {forexLoading ? (
                          <span>…</span>
                        ) : forexError ? (
                          <span className="text-destructive">N/A</span>
                        ) : forexRate ? (
                          <span>
                            1 {formData.currency} ≈ {forexRate.toFixed(2)} INR
                          </span>
                        ) : (
                          <span>N/A</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-5 border-t border-border/20">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="rounded-full px-6 h-10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-full px-6 h-10 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Save Expense
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
