import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { X, HandCoins, Calendar, Users, TrendingUp, TrendingDown, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { Loan } from "@/types/loan";

interface LoanDetailedViewProps {
  loans: Loan[];
  onClose: () => void;
  onUpdateLoan?: (loan: Loan) => void;
}

export const LoanDetailedView = ({ loans, onClose }: LoanDetailedViewProps) => {
  const [selectedYear] = useState(new Date().getFullYear());

  // Prevent body scrolling when modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const formatCurrency = (amount: number, currency: string = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      currencyDisplay: 'symbol'
    }).format(amount).replace(/^₹/, '₹');
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const activeLoans = loans.filter(loan => loan.status === 'active');
  const completedLoans = loans.filter(loan => loan.status === 'completed');
  const writtenOffLoans = loans.filter(loan => loan.status === 'written-off');

  const totalLoaned = loans.reduce((sum, loan) => sum + loan.amount, 0);
  const totalReceived = loans.reduce((sum, loan) => sum + loan.totalReceived, 0);
  const totalPending = activeLoans.reduce((sum, loan) => sum + loan.remainingAmount, 0);
  const totalWrittenOff = writtenOffLoans.reduce((sum, loan) => sum + loan.remainingAmount, 0);

  const getStatusColor = (status: Loan['status']) => {
    switch (status) {
      case 'active':
        return 'bg-gradient-to-r from-blue-500/20 to-blue-600/10 text-blue-600 border-blue-500/30';
      case 'completed':
        return 'bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 text-emerald-600 border-emerald-500/30';
      case 'written-off':
        return 'bg-gradient-to-r from-red-500/20 to-red-600/10 text-red-600 border-red-500/30';
    }
  };

  const getStatusIcon = (status: Loan['status']) => {
    switch (status) {
      case 'active':
        return <Clock className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'written-off':
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  // Group loans by person for summary
  const loansByPerson = loans.reduce((acc, loan) => {
    if (!acc[loan.personName]) {
      acc[loan.personName] = [];
    }
    acc[loan.personName].push(loan);
    return acc;
  }, {} as Record<string, Loan[]>);

  // Get monthly loan activity (simplified for demonstration)
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const getMonthlyLoanActivity = (monthIndex: number) => {
    const targetMonth = new Date(selectedYear, monthIndex);
    return loans.filter(loan => {
      const loanDate = new Date(loan.dateGiven);
      return loanDate.getMonth() === monthIndex && loanDate.getFullYear() === selectedYear;
    });
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-md z-50 animate-fade-in-up">
      <Card className="w-full h-full overflow-hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-0 shadow-2xl rounded-none animate-scale-in flex flex-col">
        <CardHeader className="flex-shrink-0 flex flex-row items-center justify-between py-4 px-6 bg-gradient-to-br from-emerald-50/80 to-teal-50/60 dark:from-emerald-900/80 dark:to-teal-900/60 border-b border-emerald-200/50 dark:border-emerald-700/50">
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
                <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">{selectedYear}</p>
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
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Loaned</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalLoaned)}</p>
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
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Amount Received</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalReceived)}</p>
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
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Amount Pending</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalPending)}</p>
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
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Active Loans</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{activeLoans.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Monthly Loan Activity */}
              <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl border border-emerald-200/50 dark:border-emerald-700/50 shadow-lg">
                <div className="p-4 border-b border-emerald-200/50 dark:border-emerald-700/50">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Loan Activity - {selectedYear}</h3>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-emerald-50/80 to-teal-50/60 dark:from-emerald-900/80 dark:to-teal-900/60">
                      {months.map((month) => (
                        <TableHead key={month} className="text-center font-semibold py-3 px-2">
                          <div className="text-gray-700 dark:text-gray-200 text-sm font-medium">{month}</div>
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
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Loan Status Overview</h3>
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
                        <TableHead>Status</TableHead>
                        <TableHead>Progress</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loans.map((loan) => {
                        const progress = loan.amount > 0 ? Math.round((loan.totalReceived / loan.amount) * 100) : 0;
                        
                        return (
                          <TableRow key={loan.id} className="hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20">
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
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{progress}%</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Person-wise Summary */}
              <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl border border-emerald-200/50 dark:border-emerald-700/50 shadow-lg">
                <div className="p-4 border-b border-emerald-200/50 dark:border-emerald-700/50">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Person-wise Summary</h3>
                </div>
                <div className="p-4 space-y-4">
                  {Object.entries(loansByPerson).map(([personName, personLoans]) => {
                    const totalLoanedToPerson = personLoans.reduce((sum, loan) => sum + loan.amount, 0);
                    const totalReceivedFromPerson = personLoans.reduce((sum, loan) => sum + loan.totalReceived, 0);
                    const totalPendingFromPerson = personLoans.filter(l => l.status === 'active').reduce((sum, loan) => sum + loan.remainingAmount, 0);
                    
                    return (
                      <div key={personName} className="p-4 bg-emerald-50/50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200/30 dark:border-emerald-700/30">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Users className="h-4 w-4 text-emerald-600" />
                            {personName}
                          </h4>
                          <div className="text-right">
                            <p className="text-xs text-gray-500 dark:text-gray-400">Net Pending</p>
                            <p className="text-sm font-bold text-orange-600 dark:text-orange-400">{formatCurrency(totalPendingFromPerson)}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="text-center p-2 bg-blue-500/10 rounded-lg">
                            <p className="text-xs text-gray-600 dark:text-gray-300">Loaned</p>
                            <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{formatCurrency(totalLoanedToPerson)}</p>
                          </div>
                          <div className="text-center p-2 bg-emerald-500/10 rounded-lg">
                            <p className="text-xs text-gray-600 dark:text-gray-300">Received</p>
                            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(totalReceivedFromPerson)}</p>
                          </div>
                          <div className="text-center p-2 bg-orange-500/10 rounded-lg">
                            <p className="text-xs text-gray-600 dark:text-gray-300">Pending</p>
                            <p className="text-sm font-bold text-orange-600 dark:text-orange-400">{formatCurrency(totalPendingFromPerson)}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};