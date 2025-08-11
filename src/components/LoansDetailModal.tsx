import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
  X,
  HandCoins,
  Calendar,
  IndianRupee,
  Users,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingDown,
  AlertCircle,
  Send,
} from 'lucide-react';
import { Loan } from '@/types/loan';
import { useModal } from '@/contexts/ModalContext';

interface LoansDetailModalProps {
  loans: Loan[];
  onClose: () => void;
  onUpdateLoan: (loan: Loan) => void;
}

export const LoansDetailModal = ({ loans, onClose, onUpdateLoan }: LoansDetailModalProps) => {
  const { openModal, closeModal } = useModal();
  const [activeTab, setActiveTab] = useState('overview');

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

  const handleWriteOff = (loan: Loan) => {
    const updatedLoan: Loan = {
      ...loan,
      status: 'written-off',
      writeOffDate: new Date(),
    };
    onUpdateLoan(updatedLoan);
  };

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
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const activeLoans = loans.filter((loan) => loan.status === 'active');
  const completedLoans = loans.filter((loan) => loan.status === 'completed');
  const writtenOffLoans = loans.filter((loan) => loan.status === 'written-off');

  const totalLoaned = loans.reduce((sum, loan) => sum + loan.amount, 0);
  const totalReceived = loans.reduce((sum, loan) => sum + loan.totalReceived, 0);
  const totalPending = activeLoans.reduce((sum, loan) => sum + loan.remainingAmount, 0);
  const totalWrittenOff = writtenOffLoans.reduce((sum, loan) => sum + loan.remainingAmount, 0);

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
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-background animate-fade-in-up overscroll-none">
      <Card className="w-screen h-screen rounded-none border-0 shadow-none premium-card animate-scale-in flex flex-col">
        <CardHeader className="flex-shrink-0 flex flex-row items-center justify-between py-6 px-8 bg-gradient-to-r from-emerald-accent/5 to-teal-accent/5 border-b border-border/20">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-emerald-accent/20 to-emerald-accent/10 rounded-2xl">
              <HandCoins className="h-6 w-6 text-emerald-accent" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold text-foreground">Loans Management</CardTitle>
              <p className="text-muted-foreground font-medium">
                Track money you've lent and received
              </p>
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

        <CardContent className="flex-1 overflow-hidden p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="flex-shrink-0 px-8 pt-6">
              <TabsList className="grid w-full grid-cols-4 bg-muted/20">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="active">Active ({activeLoans.length})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({completedLoans.length})</TabsTrigger>
                <TabsTrigger value="by-person">By Person</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-auto">
              <TabsContent value="overview" className="p-8 space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="premium-card border-emerald-accent/20">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-accent/10 rounded-xl">
                          <HandCoins className="h-5 w-5 text-emerald-accent" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total Loaned</p>
                          <p className="text-2xl font-bold text-foreground">
                            {formatCurrency(totalLoaned)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="premium-card border-blue-accent/20">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-accent/10 rounded-xl">
                          <IndianRupee className="h-5 w-5 text-blue-accent" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Amount Received
                          </p>
                          <p className="text-2xl font-bold text-foreground">
                            {formatCurrency(totalReceived)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="premium-card border-orange-500/20">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-500/10 rounded-xl">
                          <TrendingDown className="h-5 w-5 text-orange-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Amount Pending
                          </p>
                          <p className="text-2xl font-bold text-foreground">
                            {formatCurrency(totalPending)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="premium-card border-purple-accent/20">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-accent/10 rounded-xl">
                          <Clock className="h-5 w-5 text-purple-accent" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Active Loans</p>
                          <p className="text-2xl font-bold text-foreground">{activeLoans.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card className="premium-card">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {loans.slice(0, 5).map((loan) => (
                        <div
                          key={loan.id}
                          className="flex items-center justify-between p-4 bg-muted/10 rounded-xl"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-accent/10 rounded-lg">
                              <HandCoins className="h-4 w-4 text-emerald-accent" />
                            </div>
                            <div>
                              <p className="font-semibold">{loan.personName}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(loan.dateGiven)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">
                              {formatCurrency(loan.amount, loan.currency)}
                            </p>
                            <Badge variant="outline" className={getStatusColor(loan.status)}>
                              {getStatusIcon(loan.status)}
                              {loan.status === 'written-off' ? 'Bad Debt' : loan.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="active" className="p-8">
                <div className="space-y-4">
                  {activeLoans.length === 0 ? (
                    <div className="text-center py-12">
                      <HandCoins className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-lg font-semibold text-muted-foreground">No active loans</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Person</TableHead>
                          <TableHead>Amount Loaned</TableHead>
                          <TableHead>Received</TableHead>
                          <TableHead>Pending</TableHead>
                          <TableHead>Date Given</TableHead>
                          <TableHead>Progress</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activeLoans.map((loan) => {
                          const progress = Math.round((loan.totalReceived / loan.amount) * 100);
                          return (
                            <TableRow key={loan.id}>
                              <TableCell className="font-medium">{loan.personName}</TableCell>
                              <TableCell>{formatCurrency(loan.amount, loan.currency)}</TableCell>
                              <TableCell className="text-emerald-600">
                                {formatCurrency(loan.totalReceived, loan.currency)}
                              </TableCell>
                              <TableCell className="text-orange-600">
                                {formatCurrency(loan.remainingAmount, loan.currency)}
                              </TableCell>
                              <TableCell>{formatDate(loan.dateGiven)}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="w-20 bg-muted/20 rounded-full h-2">
                                    <div
                                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-300"
                                      style={{ width: `${progress}%` }}
                                    />
                                  </div>
                                  <span className="text-xs font-medium">{progress}%</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleWriteOff(loan)}
                                  className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 hover:border-red-300"
                                >
                                  <AlertCircle className="h-3 w-3" />
                                  Write Off
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="completed" className="p-8">
                <div className="space-y-4">
                  {[...completedLoans, ...writtenOffLoans].length === 0 ? (
                    <div className="text-center py-12">
                      <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-lg font-semibold text-muted-foreground">
                        No completed loans
                      </p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Person</TableHead>
                          <TableHead>Amount Loaned</TableHead>
                          <TableHead>Amount Received</TableHead>
                          <TableHead>Date Given</TableHead>
                          <TableHead>Date Completed/Written Off</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[...completedLoans, ...writtenOffLoans].map((loan) => (
                          <TableRow key={loan.id}>
                            <TableCell className="font-medium">{loan.personName}</TableCell>
                            <TableCell>{formatCurrency(loan.amount, loan.currency)}</TableCell>
                            <TableCell
                              className={
                                loan.status === 'completed' ? 'text-emerald-600' : 'text-red-600'
                              }
                            >
                              {formatCurrency(loan.totalReceived, loan.currency)}
                            </TableCell>
                            <TableCell>{formatDate(loan.dateGiven)}</TableCell>
                            <TableCell>
                              {loan.status === 'written-off' && loan.writeOffDate ? (
                                <span className="text-red-600 font-medium">
                                  {formatDate(loan.writeOffDate)}
                                </span>
                              ) : loan.status === 'completed' ? (
                                <span className="text-emerald-600 font-medium">—</span>
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getStatusColor(loan.status)}>
                                {getStatusIcon(loan.status)}
                                {loan.status === 'written-off' ? 'Bad Debt' : 'Completed'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="by-person" className="p-8">
                <div className="space-y-6">
                  {Object.entries(loansByPerson).map(([personName, personLoans]) => {
                    const totalLoanedToPerson = personLoans.reduce(
                      (sum, loan) => sum + loan.amount,
                      0,
                    );
                    const totalReceivedFromPerson = personLoans.reduce(
                      (sum, loan) => sum + loan.totalReceived,
                      0,
                    );
                    const totalPendingFromPerson = personLoans
                      .filter((l) => l.status === 'active')
                      .reduce((sum, loan) => sum + loan.remainingAmount, 0);

                    return (
                      <Card key={personName} className="premium-card">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-3">
                              <div className="p-2 bg-emerald-accent/10 rounded-xl">
                                <Users className="h-5 w-5 text-emerald-accent" />
                              </div>
                              {personName}
                            </CardTitle>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Net Pending</p>
                              <p className="text-lg font-bold text-foreground">
                                {formatCurrency(totalPendingFromPerson)}
                              </p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="text-center p-3 bg-blue-accent/10 rounded-xl">
                              <p className="text-sm text-muted-foreground">Total Loaned</p>
                              <p className="font-bold text-blue-accent">
                                {formatCurrency(totalLoanedToPerson)}
                              </p>
                            </div>
                            <div className="text-center p-3 bg-emerald-accent/10 rounded-xl">
                              <p className="text-sm text-muted-foreground">Total Received</p>
                              <p className="font-bold text-emerald-accent">
                                {formatCurrency(totalReceivedFromPerson)}
                              </p>
                            </div>
                            <div className="text-center p-3 bg-orange-500/10 rounded-xl">
                              <p className="text-sm text-muted-foreground">Pending</p>
                              <p className="font-bold text-orange-600">
                                {formatCurrency(totalPendingFromPerson)}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            {personLoans.map((loan) => (
                              <div
                                key={loan.id}
                                className="flex items-center justify-between p-3 bg-muted/10 rounded-lg"
                              >
                                <div>
                                  <p className="font-medium">
                                    {formatCurrency(loan.amount, loan.currency)}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatDate(loan.dateGiven)}
                                  </p>
                                </div>
                                <Badge variant="outline" className={getStatusColor(loan.status)}>
                                  {getStatusIcon(loan.status)}
                                  {loan.status === 'written-off' ? 'Bad Debt' : loan.status}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>,
    document.body,
  );
};
