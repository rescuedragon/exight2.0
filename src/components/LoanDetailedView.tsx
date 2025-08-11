import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  X,
  HandCoins,
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
  CheckCircle,
  AlertTriangle,
  Clock,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { Loan } from '@/types/loan';
import { useModal } from '@/contexts/ModalContext';

interface LoanDetailedViewProps {
  loans: Loan[];
  onClose: () => void;
  onUpdateLoan?: (loan: Loan) => void;
}

export const LoanDetailedView = ({ loans, onClose, onUpdateLoan }: LoanDetailedViewProps) => {
  const { openModal, closeModal } = useModal();
  const [selectedYear] = useState(new Date().getFullYear());
  const [expandedPersons, setExpandedPersons] = useState<Set<string>>(new Set());

  // Register modal when component mounts
  useEffect(() => {
    openModal();
    return () => {
      closeModal();
    };
  }, [openModal, closeModal]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);
  const [isPersonSummaryExpanded, setIsPersonSummaryExpanded] = useState(false);

  const formatCurrency = (amount: number, currency: string = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      currencyDisplay: 'symbol',
    })
      .format(amount)
      .replace(/^₹/, '₹');
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  const handleWriteOff = (loan: Loan) => {
    if (onUpdateLoan) {
      onUpdateLoan({ ...loan, status: 'written-off' });
    }
  };

  const togglePersonExpansion = (personName: string) => {
    const newExpanded = new Set(expandedPersons);
    if (newExpanded.has(personName)) {
      newExpanded.delete(personName);
    } else {
      newExpanded.add(personName);
    }
    setExpandedPersons(newExpanded);
  };

  const getStatusColor = (status: Loan['status']) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-300 dark:border-blue-600';
      case 'completed':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-300 dark:border-emerald-600';
      case 'written-off':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-300 dark:border-red-600';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400 border-gray-300 dark:border-gray-600';
    }
  };

  const getStatusIcon = (status: Loan['status']) => {
    switch (status) {
      case 'active':
        return <Clock className="h-3 w-3" />;
      case 'completed':
        return <CheckCircle className="h-3 w-3" />;
      case 'written-off':
        return <AlertTriangle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const getPersonAnalytics = (personName: string, personLoans: Loan[]) => {
    const totalLoaned = personLoans.reduce((sum, loan) => sum + loan.amount, 0);
    const totalReceived = personLoans.reduce((sum, loan) => sum + loan.totalReceived, 0);
    const totalPending = totalLoaned - totalReceived;
    const recoveryRate = totalLoaned > 0 ? Math.round((totalReceived / totalLoaned) * 100) : 0;
    const percentageOfTotal =
      loans.length > 0 ? Math.round((personLoans.length / loans.length) * 100) : 0;

    const completedLoans = personLoans.filter((loan) => loan.status === 'completed').length;
    const activeLoans = personLoans.filter((loan) => loan.status === 'active').length;
    const writtenOffLoans = personLoans.filter((loan) => loan.status === 'written-off').length;

    const totalPayments = personLoans.reduce((sum, loan) => sum + loan.payments.length, 0);
    const avgPaymentsPerLoan =
      personLoans.length > 0 ? Math.round(totalPayments / personLoans.length) : 0;

    const reliabilityScore =
      personLoans.length > 0
        ? Math.round(((completedLoans + activeLoans * 0.5) / personLoans.length) * 100)
        : 0;

    return {
      totalLoanedToPerson: totalLoaned,
      totalReceivedFromPerson: totalReceived,
      totalPendingFromPerson: totalPending,
      recoveryRate,
      percentageOfTotal,
      totalLoansGiven: personLoans.length,
      completedLoans,
      activeLoans,
      writtenOffLoans,
      totalPayments,
      avgPaymentsPerLoan,
      reliabilityScore,
    };
  };

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const getMonthlyLoanActivity = (monthIndex: number) => {
    const targetMonth = new Date(selectedYear, monthIndex);
    return loans.filter((loan) => {
      const loanDate = new Date(loan.dateGiven);
      return loanDate.getMonth() === monthIndex && loanDate.getFullYear() === selectedYear;
    });
  };

  // Calculate totals
  const totalLoaned = loans.reduce((sum, loan) => sum + loan.amount, 0);
  const totalReceived = loans.reduce((sum, loan) => sum + loan.totalReceived, 0);
  const totalPending = totalLoaned - totalReceived;
  const activeLoans = loans.filter((loan) => loan.status === 'active');

  // Group loans by person
  const loansByPerson = loans.reduce(
    (acc, loan) => {
      if (!acc[loan.personName]) {
        acc[loan.personName] = [];
      }
      acc[loan.personName].push(loan);
      return acc;
    },
    {} as Record<string, Loan[]>,
  );

  return (
    <div
      className="fixed inset-0 bg-background z-[9999] flex items-center justify-center p-4 animate-fade-in-up"
      role="dialog"
      aria-modal="true"
      aria-label="Detailed loan view"
    >
      <Card className="w-full h-full overflow-hidden premium-card border-0 shadow-premium rounded-none animate-scale-in flex flex-col">
        <CardHeader className="flex-shrink-0 flex flex-row items-center justify-between py-6 px-8 bg-gradient-to-r from-emerald-accent/5 to-teal-accent/5 border-b border-border/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 rounded-xl backdrop-blur-sm">
              <HandCoins className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
                Loan Analytics Dashboard
              </CardTitle>
              <div className="flex items-center gap-1 mt-1">
                <Calendar className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                  {selectedYear}
                </p>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-10 w-10 rounded-full hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-200 group"
          >
            <X className="h-4 w-4 text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden p-0 bg-gradient-to-br from-emerald-50/30 to-teal-50/30 dark:from-emerald-900/30 dark:to-teal-900/30">
          <div className="h-full overflow-y-auto">
            <div className="space-y-6 p-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-emerald-200/50 dark:border-emerald-700/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-500/10 rounded-xl">
                        <HandCoins className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          Total Loaned
                        </p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                          {formatCurrency(totalLoaned)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-blue-200/50 dark:border-blue-700/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-xl">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          Amount Received
                        </p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                          {formatCurrency(totalReceived)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-orange-200/50 dark:border-orange-700/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-500/10 rounded-xl">
                        <TrendingDown className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          Amount Pending
                        </p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                          {formatCurrency(totalPending)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-purple-200/50 dark:border-purple-700/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/10 rounded-xl">
                        <Users className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          Active Loans
                        </p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                          {activeLoans.length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Monthly Loan Activity */}
              <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl border border-emerald-200/50 dark:border-emerald-700/50 shadow-lg">
                <div className="p-4 border-b border-emerald-200/50 dark:border-emerald-700/50">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Monthly Loan Activity - {selectedYear}
                  </h3>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-emerald-50/80 to-teal-50/60 dark:from-emerald-900/80 dark:to-teal-900/60">
                      {months.map((month) => (
                        <TableHead key={month} className="text-center font-semibold py-3 px-2">
                          <div className="text-gray-700 dark:text-gray-200 text-sm font-medium">
                            {month}
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20">
                      {months.map((month, monthIndex) => {
                        const monthLoans = getMonthlyLoanActivity(monthIndex);
                        const monthTotal = monthLoans.reduce((sum, loan) => sum + loan.amount, 0);

                        return (
                          <TableCell key={month} className="text-center py-3 px-2">
                            {monthLoans.length > 0 ? (
                              <div className="space-y-1">
                                <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                  {formatCurrency(monthTotal)}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {monthLoans.length} loan{monthLoans.length !== 1 ? 's' : ''}
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400 dark:text-gray-500 text-sm">—</span>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Loan Status Breakdown */}
              <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl border border-emerald-200/50 dark:border-emerald-700/50 shadow-lg">
                <div className="p-4 border-b border-emerald-200/50 dark:border-emerald-700/50">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Loan Status Overview
                  </h3>
                </div>
                <div className="p-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Person</TableHead>
                        <TableHead>Amount Loaned</TableHead>
                        <TableHead>Amount Received</TableHead>
                        <TableHead>Pending</TableHead>
                        <TableHead>Date Given</TableHead>
                        <TableHead>Write-off Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loans.map((loan) => {
                        const progress =
                          loan.amount > 0
                            ? Math.round((loan.totalReceived / loan.amount) * 100)
                            : 0;

                        return (
                          <TableRow
                            key={loan.id}
                            className="hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20"
                          >
                            <TableCell className="font-medium">{loan.personName}</TableCell>
                            <TableCell>{formatCurrency(loan.amount, loan.currency)}</TableCell>
                            <TableCell className="text-emerald-600 dark:text-emerald-400 font-medium">
                              {formatCurrency(loan.totalReceived, loan.currency)}
                            </TableCell>
                            <TableCell className="text-orange-600 dark:text-orange-400 font-medium">
                              {formatCurrency(loan.remainingAmount, loan.currency)}
                            </TableCell>
                            <TableCell>{formatDate(loan.dateGiven)}</TableCell>
                            <TableCell>
                              {loan.status === 'written-off' && loan.writeOffDate ? (
                                <span className="text-red-600 dark:text-red-400 font-medium text-sm">
                                  {formatDate(loan.writeOffDate)}
                                </span>
                              ) : (
                                <span className="text-gray-400 dark:text-gray-500 text-sm">—</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getStatusColor(loan.status)}>
                                {getStatusIcon(loan.status)}
                                {loan.status === 'written-off' ? 'Bad Debt' : loan.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-2">
                                  <div
                                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                                  {progress}%
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {loan.status === 'active' && onUpdateLoan ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleWriteOff(loan)}
                                  className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 hover:border-red-300"
                                >
                                  <AlertTriangle className="h-3 w-3" />
                                  Write Off
                                </Button>
                              ) : (
                                <span className="text-gray-400 dark:text-gray-500 text-sm">—</span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Person Summary */}
              <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl border border-emerald-200/50 dark:border-emerald-700/50 shadow-lg">
                <div
                  className="p-4 border-b border-emerald-200/50 dark:border-emerald-700/50 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors"
                  onClick={() => setIsPersonSummaryExpanded(!isPersonSummaryExpanded)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-500/10 rounded-xl">
                        <Users className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Person-wise Summary
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {Object.keys(loansByPerson).length} people
                        </p>
                      </div>
                    </div>
                    {isPersonSummaryExpanded ? (
                      <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    )}
                  </div>
                </div>
                {isPersonSummaryExpanded && (
                  <div className="p-4 space-y-6 animate-in slide-in-from-top duration-200">
                    {Object.entries(loansByPerson).map(([personName, personLoans]) => {
                      const analytics = getPersonAnalytics(personName, personLoans);

                      return (
                        <div
                          key={personName}
                          className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-emerald-200/50 dark:border-emerald-700/30 shadow-lg"
                        >
                          <div
                            className="flex items-center justify-between mb-4 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-700/20 rounded-lg p-2 -m-2 transition-colors"
                            onClick={() => togglePersonExpansion(personName)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-emerald-500/10 rounded-xl">
                                <Users className="h-5 w-5 text-emerald-600" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                                    {personName}
                                  </h4>
                                  {expandedPersons.has(personName) ? (
                                    <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                  )}
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {analytics.percentageOfTotal}% of total loans •{' '}
                                  {analytics.totalLoansGiven} loan
                                  {analytics.totalLoansGiven !== 1 ? 's' : ''}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  Reliability Score
                                </span>
                                <div
                                  className={`px-2 py-1 rounded-full text-xs font-bold ${
                                    analytics.reliabilityScore >= 80
                                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                      : analytics.reliabilityScore >= 60
                                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                  }`}
                                >
                                  {analytics.reliabilityScore}%
                                </div>
                              </div>
                            </div>
                          </div>

                          {expandedPersons.has(personName) && (
                            <div className="space-y-4 animate-in slide-in-from-top duration-200">
                              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                                <div className="text-center p-3 bg-blue-500/10 rounded-lg">
                                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">
                                    Total Loaned
                                  </p>
                                  <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                    {formatCurrency(analytics.totalLoanedToPerson)}
                                  </p>
                                </div>
                                <div className="text-center p-3 bg-emerald-500/10 rounded-lg">
                                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">
                                    Received
                                  </p>
                                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                    {formatCurrency(analytics.totalReceivedFromPerson)}
                                  </p>
                                </div>
                                <div className="text-center p-3 bg-orange-500/10 rounded-lg">
                                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">
                                    Pending
                                  </p>
                                  <p className="text-sm font-bold text-orange-600 dark:text-orange-400">
                                    {formatCurrency(analytics.totalPendingFromPerson)}
                                  </p>
                                </div>
                                <div className="text-center p-3 bg-purple-500/10 rounded-lg">
                                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">
                                    Recovery Rate
                                  </p>
                                  <p className="text-sm font-bold text-purple-600 dark:text-purple-400">
                                    {analytics.recoveryRate}%
                                  </p>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                                <div className="p-3 bg-gray-50/50 dark:bg-gray-700/30 rounded-lg">
                                  <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Loan History
                                  </h5>
                                  <div className="grid grid-cols-3 gap-2 text-xs">
                                    <div className="text-center">
                                      <div className="flex items-center justify-center gap-1 mb-1">
                                        <CheckCircle className="h-3 w-3 text-emerald-500" />
                                        <span className="font-medium text-gray-600 dark:text-gray-300">
                                          Completed
                                        </span>
                                      </div>
                                      <p className="font-bold text-emerald-600 dark:text-emerald-400">
                                        {analytics.completedLoans}
                                      </p>
                                    </div>
                                    <div className="text-center">
                                      <div className="flex items-center justify-center gap-1 mb-1">
                                        <Clock className="h-3 w-3 text-blue-500" />
                                        <span className="font-medium text-gray-600 dark:text-gray-300">
                                          Active
                                        </span>
                                      </div>
                                      <p className="font-bold text-blue-600 dark:text-blue-400">
                                        {analytics.activeLoans}
                                      </p>
                                    </div>
                                    <div className="text-center">
                                      <div className="flex items-center justify-center gap-1 mb-1">
                                        <AlertTriangle className="h-3 w-3 text-red-500" />
                                        <span className="font-medium text-gray-600 dark:text-gray-300">
                                          Written Off
                                        </span>
                                      </div>
                                      <p className="font-bold text-red-600 dark:text-red-400">
                                        {analytics.writtenOffLoans}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="p-3 bg-gray-50/50 dark:bg-gray-700/30 rounded-lg">
                                  <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Payment Behavior
                                  </h5>
                                  <div className="space-y-2 text-xs">
                                    <div className="flex justify-between">
                                      <span className="text-gray-600 dark:text-gray-300">
                                        Total Payments Made:
                                      </span>
                                      <span className="font-bold text-gray-900 dark:text-white">
                                        {analytics.totalPayments}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600 dark:text-gray-300">
                                        Avg Payments/Loan:
                                      </span>
                                      <span className="font-bold text-gray-900 dark:text-white">
                                        {analytics.avgPaymentsPerLoan}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600 dark:text-gray-300">
                                        Loan Requests:
                                      </span>
                                      <span className="font-bold text-gray-900 dark:text-white">
                                        {analytics.totalLoansGiven}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                  Individual Loans
                                </h5>
                                {personLoans.map((loan) => (
                                  <div
                                    key={loan.id}
                                    className="flex items-center justify-between p-2 bg-gray-50/30 dark:bg-gray-700/20 rounded-lg text-xs"
                                  >
                                    <div className="flex items-center gap-2">
                                      <Badge
                                        variant="outline"
                                        className={getStatusColor(loan.status)}
                                      >
                                        {getStatusIcon(loan.status)}
                                        {loan.status === 'written-off' ? 'Bad Debt' : loan.status}
                                      </Badge>
                                      <span className="font-medium text-gray-700 dark:text-gray-300">
                                        {formatCurrency(loan.amount, loan.currency)}
                                      </span>
                                      <span className="text-gray-500 dark:text-gray-400">
                                        ({formatDate(loan.dateGiven)})
                                      </span>
                                    </div>
                                    <div className="text-right">
                                      <div className="font-medium text-gray-700 dark:text-gray-300">
                                        {loan.payments.length} payment
                                        {loan.payments.length !== 1 ? 's' : ''}
                                      </div>
                                      <div className="text-gray-500 dark:text-gray-400">
                                        {formatCurrency(loan.totalReceived, loan.currency)} received
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
