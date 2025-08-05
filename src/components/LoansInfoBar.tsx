import { useState } from "react";
import { IndianRupee, HandCoins, TrendingDown, Users } from "lucide-react";
import { Loan } from "@/types/loan";
import { LoansDetailModal } from "@/components/LoansDetailModal";

interface LoansInfoBarProps {
  loans: Loan[];
  onUpdateLoan: (loan: Loan) => void;
  isPrivacyMode?: boolean;
}

export const LoansInfoBar = ({ loans, onUpdateLoan, isPrivacyMode = false }: LoansInfoBarProps) => {
  const [showDetailModal, setShowDetailModal] = useState(false);

  const activeLoans = loans.filter(loan => loan.status === 'active');
  const totalLoaned = loans.reduce((sum, loan) => sum + loan.amount, 0);
  const totalPending = activeLoans.reduce((sum, loan) => sum + loan.remainingAmount, 0);
  const totalReceived = loans.reduce((sum, loan) => sum + loan.totalReceived, 0);
  const uniquePersons = new Set(loans.map(loan => loan.personName)).size;

  const formatCurrency = (amount: number) => {
    if (isPrivacyMode) {
      return '••••••';
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      currencyDisplay: 'symbol'
    }).format(amount).replace(/^₹/, '₹');
  };

  const formatCount = (count: number) => {
    return isPrivacyMode ? '••' : count.toString();
  };

  return (
    <>
      <div className="w-full backdrop-blur-xl bg-gradient-to-r from-white/10 via-white/5 to-white/10 dark:from-gray-900/20 dark:via-gray-800/10 dark:to-gray-900/20 rounded-3xl p-6 animate-fade-in-up stagger-1 shadow-2xl border border-white/20 infobar-container">
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
          <div
            className="flex items-center justify-center space-x-5 animate-fade-in-up stagger-2 cursor-pointer backdrop-blur-md hover:bg-white/20 dark:hover:bg-gray-800/20 rounded-2xl p-4 -m-4 transition-all duration-200 hover:scale-[1.01] hover:shadow-md w-full max-w-xs group"
            onClick={() => setShowDetailModal(true)}
          >
            <div className="p-4 rounded-3xl shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-110" style={{ backgroundColor: '#10b981' }}>
              <HandCoins className="h-7 w-7 text-white drop-shadow-lg" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 tracking-wide">Total Loaned</p>
              <div className="flex items-center gap-2">
                <IndianRupee className="h-5 w-5 text-gray-800 dark:text-gray-200" />
                <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent tracking-tight">{formatCurrency(totalLoaned).replace('₹', '')}</p>
              </div>
            </div>
          </div>

          <div
            className="flex items-center justify-center space-x-5 animate-fade-in-up stagger-3 cursor-pointer backdrop-blur-md hover:bg-white/20 dark:hover:bg-gray-800/20 rounded-2xl p-4 -m-4 transition-all duration-200 hover:scale-[1.01] hover:shadow-md w-full max-w-xs group"
            onClick={() => setShowDetailModal(true)}
          >
            <div className="p-4 rounded-3xl shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-110" style={{ backgroundColor: '#f59e0b' }}>
              <TrendingDown className="h-7 w-7 text-white drop-shadow-lg" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 tracking-wide">Amount Pending</p>
              <div className="flex items-center gap-2">
                <IndianRupee className="h-5 w-5 text-gray-800 dark:text-gray-200" />
                <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent tracking-tight">{formatCurrency(totalPending).replace('₹', '')}</p>
              </div>
            </div>
          </div>

          <div
            className="flex items-center justify-center space-x-5 animate-fade-in-up stagger-4 cursor-pointer backdrop-blur-md hover:bg-white/20 dark:hover:bg-gray-800/20 rounded-2xl p-4 -m-4 transition-all duration-200 hover:scale-[1.01] hover:shadow-md w-full max-w-xs group"
            onClick={() => setShowDetailModal(true)}
          >
            <div className="p-4 rounded-3xl shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-110" style={{ backgroundColor: '#3b82f6' }}>
              <IndianRupee className="h-7 w-7 text-white drop-shadow-lg" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 tracking-wide">Amount Received</p>
              <div className="flex items-center gap-2">
                <IndianRupee className="h-5 w-5 text-gray-800 dark:text-gray-200" />
                <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent tracking-tight">{formatCurrency(totalReceived).replace('₹', '')}</p>
              </div>
            </div>
          </div>

          <div
            className="flex items-center justify-center space-x-5 animate-fade-in-up stagger-5 cursor-pointer backdrop-blur-md hover:bg-white/20 dark:hover:bg-gray-800/20 rounded-2xl p-4 -m-4 transition-all duration-200 hover:scale-[1.01] hover:shadow-md w-full max-w-xs group"
            onClick={() => setShowDetailModal(true)}
          >
            <div className="p-4 rounded-3xl shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-110" style={{ backgroundColor: '#8b5cf6' }}>
              <Users className="h-7 w-7 text-white drop-shadow-lg" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 tracking-wide">People</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent tracking-tight">{formatCount(uniquePersons)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && (
        <LoansDetailModal
          loans={loans}
          onClose={() => setShowDetailModal(false)}
          onUpdateLoan={onUpdateLoan}
        />
      )}
    </>
  );
};