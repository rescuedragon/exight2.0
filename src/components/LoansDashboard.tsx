import { useState, useMemo, useCallback, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  HandCoins,
  Calendar,
  IndianRupee,
  Clock,
  TrendingDown,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import { Loan, LoanPayment } from '@/types/loan';
import { useToast } from '@/hooks/use-toast';

interface LoansDashboardProps {
  loans: Loan[];
  onUpdateLoan: (loan: Loan) => void;
  isPrivacyMode?: boolean;
}

// Memoized helper functions
const getStatusColor = (status: Loan['status']) => {
  switch (status) {
    case 'active':
      return 'bg-gradient-to-r from-blue-accent/20 to-blue-accent/10 text-blue-accent border-blue-accent/30';
    case 'completed':
      return 'bg-gradient-to-r from-emerald-accent/20 to-emerald-accent/10 text-emerald-accent border-emerald-accent/30';
    case 'written-off':
      return 'bg-gradient-to-r from-red-500/20 to-red-500/10 text-red-500 border-red-500/30';
  }
};

const getStatusIcon = (status: Loan['status']) => {
  switch (status) {
    case 'active':
      return <Clock className="h-4 w-4" />;
    case 'completed':
      return <CheckCircle className="h-4 w-4" />;
    case 'written-off':
      return <XCircle className="h-4 w-4" />;
  }
};

export const LoansDashboard = memo(
  ({ loans, onUpdateLoan, isPrivacyMode = false }: LoansDashboardProps) => {
    const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentDescription, setPaymentDescription] = useState('');
    const [isActiveExpanded, setIsActiveExpanded] = useState(true);
    const [isCompletedExpanded, setIsCompletedExpanded] = useState(false);
    const { toast } = useToast();

    // Memoized data filtering and calculations
    const { activeLoans, completedLoans } = useMemo(() => {
      const activeLoans = loans.filter((loan) => loan.status === 'active');
      const completedLoans = loans.filter(
        (loan) => loan.status === 'completed' || loan.status === 'written-off',
      );
      return { activeLoans, completedLoans };
    }, [loans]);

    // Memoized currency formatter
    const formatCurrency = useCallback(
      (amount: number, currency: string = 'INR') => {
        if (isPrivacyMode) {
          return '••••••';
        }
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
          currencyDisplay: 'symbol',
        })
          .format(amount)
          .replace(/^₹/, '₹');
      },
      [isPrivacyMode],
    );

    // Memoized number formatter
    const formatNumber = useCallback(
      (num: number) => {
        return isPrivacyMode ? '••' : num.toString();
      },
      [isPrivacyMode],
    );

    // Memoized date formatter
    const formatDate = useCallback((date: Date) => {
      return new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(date);
    }, []);

    // Memoized payment handler
    const handlePayment = useCallback(
      (type: 'payment' | 'write-off') => {
        if (!selectedLoan || !paymentAmount) return;

        const payment = parseFloat(paymentAmount);
        if (payment <= 0 || payment > selectedLoan.remainingAmount) {
          toast({
            title: 'Error',
            description: 'Invalid payment amount',
            variant: 'destructive',
          });
          return;
        }

        const newPayment: LoanPayment = {
          id: Date.now().toString(),
          amount: payment,
          date: new Date(),
          type: type === 'payment' ? 'payment' : 'write-off',
          description:
            paymentDescription ||
            `${type === 'payment' ? 'Payment' : 'Write-off'} of ${formatCurrency(payment)}`,
        };

        const updatedLoan = {
          ...selectedLoan,
          payments: [...selectedLoan.payments, newPayment],
          totalReceived: selectedLoan.totalReceived + payment,
          remainingAmount: selectedLoan.remainingAmount - payment,
          status: selectedLoan.remainingAmount - payment <= 0 ? 'completed' : selectedLoan.status,
        };

        if (type === 'write-off') {
          updatedLoan.status = 'written-off';
          updatedLoan.writeOffDate = new Date();
        }

        onUpdateLoan(updatedLoan);
        setPaymentAmount('');
        setPaymentDescription('');
        setSelectedLoan(null);

        toast({
          title: 'Success',
          description: `${type === 'payment' ? 'Payment' : 'Write-off'} of ${formatCurrency(payment)} recorded successfully!`,
        });
      },
      [
        selectedLoan,
        paymentAmount,
        paymentDescription,
        formatCurrency,
        onUpdateLoan,
        toast,
        setPaymentAmount,
        setPaymentDescription,
        setSelectedLoan,
      ],
    );

    // Memoized loan card renderer
    const renderLoanCard = useCallback(
      (loan: Loan, index: number) => {
        const progressPercentage = Math.round((loan.totalReceived / loan.amount) * 100);

        return (
          <div
            key={loan.id}
            className={`relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-white/40 via-white/25 to-white/40 dark:from-gray-800/50 dark:via-gray-700/30 dark:to-gray-800/50 border border-white/40 dark:border-gray-600/40 rounded-3xl hover:shadow-2xl group transition-all duration-500 compact-loan-card hover:scale-[1.02] hover:backdrop-blur-2xl hover:border-white/60 dark:hover:border-gray-500/60`}
            style={{
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* Subtle inner glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 dark:from-gray-100/5 dark:via-transparent dark:to-gray-100/5 rounded-3xl pointer-events-none" />

            <div className="p-2.5 pb-1.5 flex-shrink-0 relative z-10">
              <div className="flex items-center justify-between min-h-[1.25rem]">
                <div className="flex items-center gap-2 text-base font-bold">
                  <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-sm" />
                  <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent font-semibold tracking-tight">
                    {loan.personName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`${getStatusColor(loan.status)} px-2.5 py-1 rounded-full font-medium text-xs backdrop-blur-md border-white/40 dark:border-gray-600/40 shadow-sm`}
                  >
                    <div className="flex items-center gap-1">
                      {getStatusIcon(loan.status)}
                      {loan.status === 'active'
                        ? 'Active'
                        : loan.status === 'completed'
                          ? 'Completed'
                          : 'Written Off'}
                    </div>
                  </Badge>
                  {loan.status === 'active' && (
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
                              onClick={() => setSelectedLoan(loan)}
                            >
                              Record payment
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent className="fixed inset-0 z-[10000] w-full h-full bg-background backdrop-blur-xl bg-gradient-to-r from-white/20 via-white/10 to-white/20 dark:from-gray-900/30 dark:via-gray-800/20 dark:to-gray-900/30 border border-white/30 dark:border-gray-600/30">
                            <DialogHeader>
                              <DialogTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                                Record Payment
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6 mt-6">
                              <div className="p-6 backdrop-blur-md bg-gradient-to-br from-blue-accent/10 to-purple-accent/10 rounded-2xl border border-blue-accent/20 dark:border-blue-accent/30">
                                <h3 className="font-bold text-lg bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                                  {selectedLoan?.personName}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  Remaining:{' '}
                                  {formatCurrency(
                                    selectedLoan?.remainingAmount || 0,
                                    selectedLoan?.currency,
                                  )}
                                </p>
                              </div>

                              <div className="space-y-3">
                                <Label
                                  htmlFor="payment"
                                  className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                                >
                                  Payment Amount
                                </Label>
                                <Input
                                  id="payment"
                                  type="number"
                                  value={paymentAmount}
                                  onChange={(e) => setPaymentAmount(e.target.value)}
                                  placeholder="Enter amount"
                                  max={selectedLoan?.remainingAmount}
                                  className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-white/30 dark:border-gray-600/30 rounded-xl h-12 text-lg focus:ring-2 focus:ring-blue-accent/20"
                                />
                              </div>

                              <div className="space-y-3">
                                <Label
                                  htmlFor="description"
                                  className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                                >
                                  Description (Optional)
                                </Label>
                                <Textarea
                                  id="description"
                                  value={paymentDescription}
                                  onChange={(e) => setPaymentDescription(e.target.value)}
                                  placeholder="Payment description..."
                                  className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-white/30 dark:border-gray-600/30 rounded-xl resize-none"
                                  rows={3}
                                />
                              </div>

                              <div className="flex justify-end space-x-3 pt-4">
                                <Button
                                  variant="outline"
                                  onClick={() => setSelectedLoan(null)}
                                  className="rounded-full px-6 backdrop-blur-sm border-white/30 dark:border-gray-600/30"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="gradient"
                                  onClick={() => handlePayment('payment')}
                                  className="rounded-full px-6 backdrop-blur-sm bg-gradient-to-r from-blue-500/90 to-purple-500/90 hover:from-blue-500 to-purple-500"
                                >
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
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-0.5">
                      Amount
                    </p>
                    <p className="text-xs font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                      {formatCurrency(loan.amount, loan.currency)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 justify-center w-full">
                  <div className="text-center p-1.5 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 dark:from-gray-800/30 dark:to-gray-700/20 backdrop-blur-sm border border-white/20 dark:border-gray-600/20 w-full">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-0.5">
                      Received
                    </p>
                    <p className="text-xs font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                      {formatCurrency(loan.totalReceived, loan.currency)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 justify-center w-full">
                  <div className="text-center p-1.5 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 dark:from-gray-800/30 dark:to-gray-700/20 backdrop-blur-sm border border-white/20 dark:border-gray-600/20 w-full">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-0.5">
                      Balance
                    </p>
                    <p className="text-xs font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                      {formatCurrency(loan.remainingAmount, loan.currency)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 justify-center w-full">
                  <div className="text-center p-1.5 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 dark:from-gray-800/30 dark:to-gray-700/20 backdrop-blur-sm border border-white/20 dark:border-gray-600/20 w-full">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-0.5">
                      Date
                    </p>
                    <p className="text-xs font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                      {formatDate(loan.dateGiven)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Section - Enhanced with Apple aesthetics */}
              <div className="text-center p-2 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 dark:from-gray-800/20 dark:to-gray-700/10 backdrop-blur-sm border border-white/20 dark:border-gray-600/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 tracking-wide">
                    Progress
                  </span>
                  <span className="text-xs font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                    {progressPercentage}%
                  </span>
                </div>
                <div className="w-full backdrop-blur-sm bg-white/30 dark:bg-gray-800/30 rounded-full h-2 overflow-hidden border border-white/40 dark:border-gray-600/40 shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-full transition-all duration-700 ease-out shadow-lg"
                    style={
                      {
                        width: `${progressPercentage}%`,
                        transitionDelay: `${index * 100 + 200}ms`,
                      } as React.CSSProperties
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        );
      },
      [formatCurrency, formatDate, handlePayment],
    );

    // Early return for empty state
    if (loans.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="p-6 bg-gradient-to-br from-blue-accent/10 to-purple-accent/10 rounded-3xl mb-6 shadow-lg">
            <HandCoins className="h-12 w-12 text-blue-accent" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-3">No loans added yet</h3>
          <p className="text-muted-foreground text-lg mb-6 max-w-md">
            Start tracking your loans and money lending to get insights into your financial
            commitments
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Header - Completed loans info only */}
        {loans.length > activeLoans.length && (
          <div className="flex justify-end">
            <p className="text-sm text-muted-foreground">
              {loans.length - activeLoans.length} completed loan
              {loans.length - activeLoans.length !== 1 ? 's' : ''} in history
            </p>
          </div>
        )}

        {/* Active Loans Section */}
        {activeLoans.length > 0 && (
          <div className="backdrop-blur-xl bg-gradient-to-r from-white/10 via-white/5 to-white/10 dark:from-gray-900/20 dark:via-gray-800/10 dark:to-gray-900/20 border border-white/20 dark:border-gray-700/30 rounded-3xl overflow-hidden shadow-2xl">
            <div
              className="flex items-center justify-between cursor-pointer p-6 hover:backdrop-blur-md hover:bg-gradient-to-r hover:from-white/20 hover:via-white/10 hover:to-white/20 dark:hover:from-gray-800/30 dark:hover:via-gray-700/20 dark:hover:to-gray-800/30 transition-all duration-500"
              onClick={() => setIsActiveExpanded(!isActiveExpanded)}
            >
              <div className="flex items-center gap-4">
                <div
                  className="p-3 rounded-3xl shadow-xl backdrop-blur-sm bg-gradient-to-br from-blue-500/90 to-blue-600/90 hover:from-blue-500 to-blue-600 transition-all duration-300"
                  style={{ backgroundColor: '#3b82f6' }}
                >
                  <HandCoins className="h-5 w-5 text-white drop-shadow-lg" />
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent tracking-tight">
                    Active Loans
                  </h3>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 tracking-wide">
                    {formatNumber(activeLoans.length)} active loan
                    {activeLoans.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 tracking-wide">
                    {formatCurrency(activeLoans.reduce((sum, loan) => sum + loan.amount, 0))} total
                  </span>
                  <div className="text-xs text-muted-foreground">
                    Received:{' '}
                    {formatCurrency(activeLoans.reduce((sum, loan) => sum + loan.totalReceived, 0))}
                  </div>
                </div>
                {isActiveExpanded ? (
                  <ChevronUp className="h-5 w-5 text-gray-600 dark:text-gray-400 transition-transform duration-300" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-400 transition-transform duration-300" />
                )}
              </div>
            </div>

            {isActiveExpanded && (
              <div className="border-t border-white/20 dark:border-gray-700/30 backdrop-blur-md bg-gradient-to-b from-white/5 to-transparent dark:from-gray-800/10 dark:to-transparent">
                <div className="p-6 space-y-4">
                  {activeLoans.map((loan, index) => renderLoanCard(loan, index))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Completed Loans Section */}
        {completedLoans.length > 0 && (
          <div className="backdrop-blur-xl bg-gradient-to-r from-white/10 via-white/5 to-white/10 dark:from-gray-900/20 dark:via-gray-800/10 dark:to-gray-900/20 border border-white/20 dark:border-gray-700/30 rounded-3xl overflow-hidden shadow-2xl">
            <div
              className="flex items-center justify-between cursor-pointer p-6 hover:backdrop-blur-md hover:bg-gradient-to-r hover:from-white/20 hover:via-white/10 hover:to-white/20 dark:hover:from-gray-800/30 dark:hover:via-gray-700/20 dark:hover:to-gray-800/30 transition-all duration-500"
              onClick={() => setIsCompletedExpanded(!isCompletedExpanded)}
            >
              <div className="flex items-center gap-4">
                <div
                  className="p-3 rounded-3xl shadow-xl backdrop-blur-sm bg-gradient-to-br from-emerald-500/90 to-emerald-600/90 hover:from-emerald-500 to-emerald-600 transition-all duration-300"
                  style={{ backgroundColor: '#10b981' }}
                >
                  <CheckCircle className="h-5 w-5 text-white drop-shadow-lg" />
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent tracking-tight">
                    Completed Loans
                  </h3>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 tracking-wide">
                    {formatNumber(completedLoans.length)} completed loan
                    {completedLoans.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 tracking-wide">
                    {formatCurrency(completedLoans.reduce((sum, loan) => sum + loan.amount, 0))}{' '}
                    total
                  </span>
                  <div className="text-xs text-muted-foreground">
                    Received:{' '}
                    {formatCurrency(
                      completedLoans.reduce((sum, loan) => sum + loan.totalReceived, 0),
                    )}
                  </div>
                </div>
                {isCompletedExpanded ? (
                  <ChevronUp className="h-5 w-5 text-gray-600 dark:text-gray-400 transition-transform duration-300" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-400 transition-transform duration-300" />
                )}
              </div>
            </div>

            {isCompletedExpanded && (
              <div className="border-t border-white/20 dark:border-gray-700/30 backdrop-blur-md bg-gradient-to-b from-white/5 to-transparent dark:from-gray-800/10 dark:to-transparent">
                <div className="p-6 space-y-4">
                  {completedLoans.map((loan, index) => renderLoanCard(loan, index))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {activeLoans.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-6 bg-gradient-to-br from-blue-accent/10 to-purple-accent/10 rounded-3xl mb-6 shadow-lg">
              <HandCoins className="h-12 w-12 text-blue-accent" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">No active loans</h3>
            <p className="text-muted-foreground text-lg mb-6 max-w-md">
              Start tracking your loans and money lending to get insights into your financial
              commitments
            </p>
          </div>
        )}
      </div>
    );
  },
);

LoansDashboard.displayName = 'LoansDashboard';
