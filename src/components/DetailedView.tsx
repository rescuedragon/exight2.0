import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { X, IndianRupee } from "lucide-react";
import { Expense } from "@/types/expense";
import { ExpenseChart } from "@/components/ExpenseChart";

interface DetailedViewProps {
  expenses: Expense[];
  onClose: () => void;
}

export const DetailedView = ({ expenses, onClose }: DetailedViewProps) => {
  const [selectedYear] = useState(new Date().getFullYear());

  // Filter to show only active expenses
  const activeExpenses = expenses.filter(expense =>
    expense.isRecurring || (expense.remainingMonths > 0 && (expense.remainingAmount === undefined || expense.remainingAmount > 0))
  );

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const formatCurrency = (amount: number, currency: string = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      currencyDisplay: 'symbol'
    }).format(amount).replace(/^₹/, '₹');
  };

  const getMonthlyExpenseForItem = (expense: Expense, monthIndex: number) => {
    const targetDate = new Date(selectedYear, monthIndex, expense.deductionDay);

    // For recurring expenses, show amount every month
    if (expense.isRecurring) {
      return expense.amount;
    }

    // For non-recurring (EMI/Loan), check if still paying
    if (expense.remainingMonths && expense.remainingMonths > 0) {
      const monthsFromCreation = Math.floor((targetDate.getTime() - expense.createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30));
      if (monthsFromCreation >= 0 && monthsFromCreation < (expense.totalMonths || 0) - (expense.remainingMonths || 0) + (expense.remainingMonths || 0)) {
        return expense.amount;
      }
    }

    return 0;
  };

  const getMonthlyTotal = (monthIndex: number) => {
    return activeExpenses.reduce((total, expense) => {
      return total + getMonthlyExpenseForItem(expense, monthIndex);
    }, 0);
  };

  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-xl z-50 flex items-center justify-center p-4 animate-fade-in-up">
      <Card className="w-full max-w-7xl max-h-[90vh] overflow-hidden premium-card border-border/40 shadow-premium animate-scale-in">
        <CardHeader className="flex flex-row items-center justify-between py-6 px-8 bg-gradient-to-r from-blue-accent/5 to-purple-accent/5 border-b border-border/20">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-accent/20 to-blue-accent/10 rounded-2xl">
              <IndianRupee className="h-6 w-6 text-blue-accent" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold text-foreground">Detailed Monthly View</CardTitle>
              <p className="text-muted-foreground font-medium">{selectedYear}</p>
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
        <CardContent className="overflow-auto p-0">
          <div className="space-y-8">
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-muted/20 to-muted/10 border-b border-border/20">
                    <TableHead className="sticky left-0 bg-muted/20 font-bold text-foreground py-3 px-4 min-w-[160px] max-w-[160px]">
                      <div className="text-xs">Expense</div>
                    </TableHead>
                    {months.map((month) => (
                      <TableHead key={month} className="text-center font-bold py-3 px-1 min-w-[60px] max-w-[60px]">
                        <div className="text-foreground text-xs">
                          {month.substring(0, 3)}
                        </div>
                      </TableHead>
                    ))}
                    <TableHead className="text-center font-bold bg-gradient-to-r from-blue-accent/10 to-emerald-accent/10 py-3 px-2 min-w-[80px] max-w-[80px]">
                      <div className="text-foreground text-xs">Total</div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeExpenses.map((expense) => (
                    <TableRow key={expense.id} className="hover:bg-gradient-to-r hover:from-blue-accent/5 hover:to-transparent transition-all duration-200 border-b border-border/10">
                      <TableCell className="sticky left-0 bg-background font-bold text-foreground py-3 px-4 min-w-[160px] max-w-[160px]">
                        <div className="space-y-1">
                          <div className="font-bold text-foreground text-sm truncate" title={expense.name}>
                            {expense.name}
                          </div>
                          <div className="text-xs text-muted-foreground font-medium px-2 py-0.5 bg-muted/20 rounded-full inline-block">
                            {expense.type}
                          </div>
                        </div>
                      </TableCell>
                      {months.map((month, monthIndex) => {
                        const amount = getMonthlyExpenseForItem(expense, monthIndex);
                        return (
                          <TableCell key={month} className="text-center py-3 px-1 min-w-[60px] max-w-[60px]">
                            {amount > 0 ? (
                              <div className="font-bold text-foreground bg-gradient-to-r from-blue-accent/10 to-emerald-accent/10 px-1 py-1 rounded text-xs">
                                ₹{(amount / 1000).toFixed(0)}k
                              </div>
                            ) : (
                              <span className="text-muted-foreground font-medium text-xs">-</span>
                            )}
                          </TableCell>
                        );
                      })}
                      <TableCell className="text-center font-bold bg-gradient-to-r from-blue-accent/10 to-emerald-accent/10 py-3 px-2 min-w-[80px] max-w-[80px]">
                        <div className="text-foreground bg-gradient-to-r from-blue-accent/20 to-emerald-accent/20 px-2 py-1 rounded text-xs">
                          {formatCurrency(
                            months.reduce((total, _, monthIndex) => {
                              return total + getMonthlyExpenseForItem(expense, monthIndex);
                            }, 0),
                            expense.currency
                          ).replace('₹', '₹')}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="border-t-2 border-blue-accent/20 bg-gradient-to-r from-blue-accent/10 to-emerald-accent/10">
                    <TableCell className="sticky left-0 bg-blue-accent/10 font-bold text-foreground py-4 px-4 min-w-[160px] max-w-[160px]">
                      <div className="text-sm">Monthly Total</div>
                    </TableCell>
                    {months.map((month, monthIndex) => (
                      <TableCell key={month} className="text-center font-bold py-4 px-1 min-w-[60px] max-w-[60px]">
                        <div className="text-foreground bg-gradient-to-r from-blue-accent/20 to-emerald-accent/20 px-1 py-1 rounded text-xs">
                          ₹{(getMonthlyTotal(monthIndex) / 1000).toFixed(0)}k
                        </div>
                      </TableCell>
                    ))}
                    <TableCell className="text-center font-bold py-4 px-2 min-w-[80px] max-w-[80px]">
                      <div className="text-sm font-bold text-foreground bg-gradient-primary text-white px-2 py-1 rounded shadow-premium">
                        {formatCurrency(
                          months.reduce((total, _, monthIndex) => total + getMonthlyTotal(monthIndex), 0)
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Expense Chart below the table */}
            <div className="p-8 pt-0">
              <ExpenseChart expenses={expenses} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};