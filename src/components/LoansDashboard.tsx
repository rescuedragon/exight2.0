import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  AlertTriangle
} from "lucide-react";
import { Loan, LoanPayment } from "@/types/loan";
import { useToast } from "@/hooks/use-toast";

interface LoansDashboardProps {
  loans: Loan[];
  onUpdateLoan: (loan: Loan) => void;
  isPrivacyMode?: boolean;
}

export const LoansDashboard = ({ loans, onUpdateLoan, isPrivacyMode = false }: LoansDashboardProps) => {
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDescription, setPaymentDescription] = useState('');
  const [isActiveExpanded, setIsActiveExpanded] = useState(true);
  const [isCompletedExpanded, setIsCompletedExpanded] = useState(false);
  const { toast } = useToast();

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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

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

  const handlePayment = (type: 'payment' | 'write-off') => {
    if (!selectedLoan || !paymentAmount) return;

    const payment = parseFloat(paymentAmount);
    if (payment <= 0 || payment > selectedLoan.remainingAmount) {
      toast({
        title: "Error",
        description: "Invalid payment amount",
        variant: "destructive"
      });
      return;
    }

    const newPayment: LoanPayment = {
      id: Date.now().toString(),
      amount: payment,
      date: new Date(),
      description: paymentDescription.trim() || undefined,
      type
    };

    const updatedLoan: Loan = {
      ...selectedLoan,
      totalReceived: selectedLoan.totalReceived + payment,
      remainingAmount: selectedLoan.remainingAmount - payment,
      payments: [...selectedLoan.payments, newPayment],
      status: type === 'write-off' ? 'written-off' : 
              (selectedLoan.remainingAmount - payment <= 0 ? 'completed' : 'active')
    };

    onUpdateLoan(updatedLoan);
    setPaymentAmount('');
    setPaymentDescription('');
    setSelectedLoan(null);
    
    const actionType = type === 'write-off' ? 'written off' : 'received';
    toast({
      title: "Success",
      description: `${formatCurrency(payment)} ${actionType} from ${selectedLoan.personName}`
    });
  };

  const activeLoans = loans.filter(loan => loan.status === 'active');
  const completedLoans = loans.filter(loan => loan.status === 'completed');
  const writtenOffLoans = loans.filter(loan => loan.status === 'written-off');

  const renderLoanCard = (loan: Loan, index: number) => {
    const progressPercentage = Math.round((loan.totalReceived / loan.amount) * 100);
    const staggerClass = `stagger-${Math.min(index + 1, 6)}`;
    
    return (
      <div 
        key={loan.id} 
        className={`backdrop-blur-md bg-gradient-to-r from-white/20 via-white/10 to-white/20 dark:from-gray-800/30 dark:via-gray-700/20 dark:to-gray-800/30 border border-white/30 dark:border-gray-600/30 rounded-2xl hover:shadow-xl group transition-all duration-500 compact-expense-card animate-fade-in-up ${staggerClass} hover:scale-[1.02] hover:backdrop-blur-lg`}
      >
        <div className="p-3 pb-2 flex-shrink-0">
          <div className="flex items-center justify-between min-h-[1.5rem]">
            <div className="flex items-center gap-2 text-base font-bold">
              <HandCoins className="h-4 w-4 text-emerald-accent" />
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">{loan.personName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`${getStatusColor(loan.status)} px-2 py-1 rounded-full font-semibold text-xs backdrop-blur-sm border-white/30 dark:border-gray-600/30`}>
                {getStatusIcon(loan.status)}
                {loan.status === 'written-off' ? 'Bad Debt' : loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
              </Badge>
              {loan.status === 'active' && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-6 w-6 p-0 rounded-full hover:bg-white/20 dark:hover:bg-gray-800/30 transition-colors duration-200"
                    >
                      <MoreVertical className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <Dialog>
                      <DialogTrigger asChild>
                        <DropdownMenuItem 
                          className="cursor-pointer"
                          onClick={() => setSelectedLoan(loan)}
                        >
                          Record payment received
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DialogContent className="fixed inset-0 z-[10000] w-full h-full bg-background backdrop-blur-xl bg-gradient-to-r from-white/20 via-white/10 to-white/20 dark:from-gray-900/30 dark:via-gray-800/20 dark:to-gray-900/30 border border-white/30 dark:border-gray-600/30">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">Record Payment</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6 mt-6">
                          <div className="p-6 backdrop-blur-md bg-gradient-to-br from-emerald-accent/10 to-teal-accent/10 rounded-2xl border border-emerald-accent/20 dark:border-emerald-accent/30">
                            <h3 className="font-bold text-lg bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">{selectedLoan?.personName}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              Remaining: {formatCurrency(selectedLoan?.remainingAmount || 0, selectedLoan?.currency)}
                            </p>
                          </div>
                          
                          <div className="space-y-3">
                            <Label htmlFor="payment" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Payment Amount</Label>
                            <Input
                              id="payment"
                              type="number"
                              step="0.01"
                              value={paymentAmount}
                              onChange={(e) => setPaymentAmount(e.target.value)}
                              placeholder="Enter amount received"
                              max={selectedLoan?.remainingAmount}
                              className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-white/30 dark:border-gray-600/30 rounded-xl h-12 text-lg focus:ring-2 focus:ring-emerald-accent/20"
                            />
                          </div>

                          <div className="space-y-3">
                            <Label htmlFor="paymentDescription" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Description (Optional)</Label>
                            <Textarea
                              id="paymentDescription"
                              value={paymentDescription}
                              onChange={(e) => setPaymentDescription(e.target.value)}
                              placeholder="Payment method, notes..."
                              className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-white/30 dark:border-gray-600/30 rounded-xl focus:ring-2 focus:ring-emerald-accent/20"
                              rows={3}
                            />
                          </div>
                          
                          <div className="flex justify-end space-x-3 pt-4">
                            <Button variant="outline" onClick={() => setSelectedLoan(null)} className="rounded-full px-6 backdrop-blur-sm border-white/30 dark:border-gray-600/30">
                              Cancel
                            </Button>
                            <Button 
                              onClick={() => handlePayment('write-off')} 
                              variant="outline"
                              className="rounded-full px-6 backdrop-blur-sm border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                            >
                              <AlertTriangle className="h-4 w-4 mr-2" />
                              Mark as Bad Debt
                            </Button>
                            <Button 
                              onClick={() => handlePayment('payment')} 
                              className="rounded-full px-6 backdrop-blur-sm bg-gradient-to-r from-emerald-500/90 to-teal-500/90 hover:from-emerald-500 hover:to-teal-500"
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
        
        <div className="flex flex-col h-full px-3 pb-3 pt-0">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2 justify-items-center">
            <div className="flex items-center gap-1.5 justify-center w-full">
              <div className="text-center">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Amount</p>
                <p className="text-xs font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">{formatCurrency(loan.amount, loan.currency)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 justify-center w-full">
              <div className="text-center">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Date Given</p>
                <p className="text-xs font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">{formatDate(loan.dateGiven)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 justify-center w-full">
              <div className="text-center">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Received</p>
                <p className="text-xs font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                  {formatCurrency(loan.totalReceived, loan.currency)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 justify-center w-full">
              <div className="text-center">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Pending</p>
                <p className="text-xs font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                  {formatCurrency(loan.remainingAmount, loan.currency)}
                </p>
              </div>
            </div>
          </div>
          
          {/* Progress Section */}
          {loan.status === 'active' && (
            <div className="text-center">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Recovery Progress</span>
                <span className="text-xs font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">{progressPercentage}%</span>
              </div>
              <div className="w-full backdrop-blur-sm bg-white/20 dark:bg-gray-800/20 rounded-full h-2 overflow-hidden border border-white/30 dark:border-gray-600/30">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-700 ease-out shadow-lg"
                  style={{ 
                    width: `${progressPercentage}%`,
                    transitionDelay: `${index * 100 + 200}ms`
                  } as React.CSSProperties}
                />
              </div>
            </div>
          )}

          {/* Description */}
          {loan.description && (
            <div className="mt-2 text-center">
              <p className="text-xs text-gray-600 dark:text-gray-400 italic truncate" title={loan.description}>
                {loan.description}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in-up">
        <div className="p-6 bg-gradient-to-br from-emerald-accent/10 to-teal-accent/10 rounded-3xl mb-6 shadow-lg">
          <HandCoins className="h-12 w-12 text-emerald-accent" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-3">No loans recorded yet</h3>
        <p className="text-muted-foreground text-lg mb-6 max-w-md">Start tracking money you've lent to friends and family</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Active Loans Section */}
      {activeLoans.length > 0 && (
        <div className="backdrop-blur-xl bg-gradient-to-r from-white/10 via-white/5 to-white/10 dark:from-gray-900/20 dark:via-gray-800/10 dark:to-gray-900/20 border border-white/20 dark:border-gray-700/30 rounded-3xl overflow-hidden shadow-2xl">
          <div 
            className="flex items-center justify-between cursor-pointer p-6 hover:backdrop-blur-md hover:bg-gradient-to-r hover:from-white/20 hover:via-white/10 hover:to-white/20 dark:hover:from-gray-800/30 dark:hover:via-gray-700/20 dark:hover:to-gray-800/30 transition-all duration-500"
            onClick={() => setIsActiveExpanded(!isActiveExpanded)}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-3xl shadow-xl backdrop-blur-sm bg-gradient-to-br from-emerald-500/90 to-emerald-600/90 hover:from-emerald-500 hover:to-emerald-600 transition-all duration-300">
                <Clock className="h-5 w-5 text-white drop-shadow-lg" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent tracking-tight">Active Loans</h3>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 tracking-wide">{formatNumber(activeLoans.length)} pending loan{activeLoans.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 tracking-wide">
                {formatCurrency(activeLoans.reduce((sum, loan) => sum + loan.remainingAmount, 0))} pending
              </span>
              {isActiveExpanded ? (
                <ChevronUp className="h-5 w-5 text-gray-600 dark:text-gray-400 transition-transform duration-300" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-400 transition-transform duration-300" />
              )}
            </div>
          </div>
          
          {isActiveExpanded && (
            <div className="border-t border-white/20 dark:border-gray-700/30 backdrop-blur-md bg-gradient-to-b from-white/5 to-transparent dark:from-gray-800/10 dark:to-transparent">
              <div className="p-6 space-y-4 animate-fade-in-up">
                {activeLoans.map((loan, index) => renderLoanCard(loan, index))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Completed Loans Section */}
      {(completedLoans.length > 0 || writtenOffLoans.length > 0) && (
        <div className="backdrop-blur-xl bg-gradient-to-r from-white/10 via-white/5 to-white/10 dark:from-gray-900/20 dark:via-gray-800/10 dark:to-gray-900/20 border border-white/20 dark:border-gray-700/30 rounded-3xl overflow-hidden shadow-2xl">
          <div 
            className="flex items-center justify-between cursor-pointer p-6 hover:backdrop-blur-md hover:bg-gradient-to-r hover:from-white/20 hover:via-white/10 hover:to-white/20 dark:hover:from-gray-800/30 dark:hover:via-gray-700/20 dark:hover:to-gray-800/30 transition-all duration-500"
            onClick={() => setIsCompletedExpanded(!isCompletedExpanded)}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-3xl shadow-xl backdrop-blur-sm bg-gradient-to-br from-gray-500/90 to-gray-600/90 hover:from-gray-500 hover:to-gray-600 transition-all duration-300">
                <CheckCircle className="h-5 w-5 text-white drop-shadow-lg" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent tracking-tight">Completed & Written Off</h3>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 tracking-wide">
                  {formatNumber(completedLoans.length)} completed, {formatNumber(writtenOffLoans.length)} written off
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isCompletedExpanded ? (
                <ChevronUp className="h-5 w-5 text-gray-600 dark:text-gray-400 transition-transform duration-300" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-400 transition-transform duration-300" />
              )}
            </div>
          </div>
          
          {isCompletedExpanded && (
            <div className="border-t border-white/20 dark:border-gray-700/30 backdrop-blur-md bg-gradient-to-b from-white/5 to-transparent dark:from-gray-800/10 dark:to-transparent">
              <div className="p-6 space-y-4 animate-fade-in-up">
                {[...completedLoans, ...writtenOffLoans].map((loan, index) => renderLoanCard(loan, index))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Empty State */}
      {activeLoans.length === 0 && completedLoans.length === 0 && writtenOffLoans.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in-up">
          <div className="p-6 bg-gradient-to-br from-emerald-accent/10 to-teal-accent/10 rounded-3xl mb-6 shadow-lg">
            <HandCoins className="h-12 w-12 text-emerald-accent" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-3">No loans recorded yet</h3>
          <p className="text-muted-foreground text-lg mb-6 max-w-md">Start tracking money you've lent to friends and family</p>
        </div>
      )}
    </div>
  );
};