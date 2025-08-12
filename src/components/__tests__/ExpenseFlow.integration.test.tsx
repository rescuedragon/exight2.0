import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExpenseDashboard } from '../ExpenseDashboard';
import type { Expense } from '@/types/expense';

// Simplify Dialog for deterministic testing
vi.mock('@/components/ui/dialog', async () => {
  const React = await import('react');
  type CtxType = { open: boolean; setOpen: (v: boolean) => void };
  const Ctx = (React as unknown as typeof import('react')).createContext<CtxType>({
    open: false,
    setOpen: () => {},
  });
  const Dialog = ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = (React as unknown as typeof import('react')).useState<boolean>(false);
    return <Ctx.Provider value={{ open, setOpen }}>{children}</Ctx.Provider>;
  };
  const DialogTrigger = ({ children }: { children: React.ReactElement }) => {
    const { setOpen } = (React as unknown as typeof import('react')).useContext(Ctx);
    return (React as unknown as typeof import('react')).cloneElement(children, {
      ...children.props,
      onClick: (...args: unknown[]) => {
        // forward original handler if present
        if (typeof children.props?.onClick === 'function') {
          (children.props.onClick as (...a: unknown[]) => unknown)(...args);
        }
        setOpen(true);
      },
    });
  };
  const DialogContent = ({ children }: { children: React.ReactNode }) => {
    const { open } = (React as unknown as typeof import('react')).useContext(Ctx);
    if (!open) return null;
    return <div role="dialog">{children}</div>;
  };
  const Simple = ({ children }: { children: React.ReactNode }) => <>{children}</>;
  const DialogTitle = ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>;
  return { Dialog, DialogTrigger, DialogContent, DialogHeader: Simple, DialogTitle };
});

function setup(expenseOverrides: Partial<Expense> = {}) {
  const expense: Expense = {
    id: 'e1',
    name: 'Laptop EMI',
    amount: 2000,
    currency: 'INR',
    type: 'EMI',
    deductionDay: 1,
    isRecurring: false,
    totalMonths: 10,
    remainingMonths: 10,
    remainingAmount: 2000,
    createdAt: new Date(),
    partialPayments: [],
    ...expenseOverrides,
  } as Expense;

  const updated: Expense[] = [];
  const onUpdateExpense = (e: Expense) => updated.push(e);

  render(<ExpenseDashboard expenses={[expense]} onUpdateExpense={onUpdateExpense} />);
  return { updated };
}

describe('Expense flow integration', () => {
  it('records a partial payment and reduces remaining amount', async () => {
    const { updated } = setup();

    // Open actions menu, click Record part payment
    const user = userEvent.setup();
    const moreBtn = await screen.findByRole('button', { name: /more options/i });
    await user.click(moreBtn);

    const recordItem = await screen.findByText((t) => /Record part payment/i.test(t));
    await user.click(recordItem);

    const input = await screen.findByLabelText(/Payment Amount/i);
    fireEvent.change(input, { target: { value: '500' } });

    const submit = await screen.findByText(/Record Payment/i);
    fireEvent.click(submit);

    expect(updated.length).toBe(1);
    expect(updated[0].remainingAmount).toBe(1500);
  });
});
