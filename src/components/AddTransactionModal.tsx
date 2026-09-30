import React, { useState } from 'react';
import { X, ArrowDownRight, ArrowUpRight, DollarSign, Calendar, Tag, CreditCard, Repeat } from 'lucide-react';
import { ExpenseCategory, IncomeCategory, UserProfile } from '../types/finance';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType: 'expense' | 'income';
  currentUser: UserProfile;
  onAddExpense: (data: any) => Promise<void>;
  onAddIncome: (data: any) => Promise<void>;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  initialType,
  currentUser,
  onAddExpense,
  onAddIncome,
}) => {
  const [type, setType] = useState<'expense' | 'income'>(initialType);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<string>(initialType === 'expense' ? 'groceries' : 'salary');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'debit_card' | 'bank_transfer' | 'cash' | 'upi'>('credit_card');
  const [frequency, setFrequency] = useState<'monthly' | 'biweekly' | 'weekly' | 'one-time'>('monthly');
  const [isRecurring, setIsRecurring] = useState(false);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const sym = currentUser.currencySymbol;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount || parseFloat(amount) <= 0) return;

    setIsSubmitting(true);
    try {
      if (type === 'expense') {
        await onAddExpense({
          userId: currentUser.id,
          title: title.trim(),
          amount: parseFloat(amount),
          category: category as ExpenseCategory,
          date,
          paymentMethod,
          notes: notes.trim(),
          isRecurring,
        });
      } else {
        await onAddIncome({
          userId: currentUser.id,
          title: title.trim(),
          amount: parseFloat(amount),
          category: category as IncomeCategory,
          date,
          frequency,
          notes: notes.trim(),
          isRecurring,
        });
      }
      onClose();
    } catch (err) {
      console.error('Failed to add transaction:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const expenseCategories = [
    { id: 'housing', label: 'Housing & Rent' },
    { id: 'groceries', label: 'Groceries & Food' },
    { id: 'dining', label: 'Dining & Takeout' },
    { id: 'utilities', label: 'Bills & Utilities' },
    { id: 'transport', label: 'Transit & Fuel' },
    { id: 'entertainment', label: 'Entertainment' },
    { id: 'health', label: 'Healthcare & Fitness' },
    { id: 'shopping', label: 'Shopping & Retail' },
    { id: 'debt', label: 'Debt & Loan Repayment' },
    { id: 'subscriptions', label: 'Streaming & Software' },
    { id: 'education', label: 'Courses & Books' },
    { id: 'personal', label: 'Personal Care' },
    { id: 'other', label: 'Other Miscellaneous' },
  ];

  const incomeCategories = [
    { id: 'salary', label: 'Salary / Employment' },
    { id: 'freelance', label: 'Freelance & Consulting' },
    { id: 'investment', label: 'Investment Dividends / Yield' },
    { id: 'rental', label: 'Rental Property Income' },
    { id: 'business', label: 'Business Enterprise' },
    { id: 'side_hustle', label: 'Side Hustle / Digital Products' },
    { id: 'bonus', label: 'Bonus / Equity Grant' },
    { id: 'other', label: 'Other Cash Inflow' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-xl ${type === 'expense' ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
              {type === 'expense' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Record Financial Transaction</h3>
              <p className="text-xs text-slate-400">Add an inflow or outflow to your active ledger</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch: Expense vs Income */}
        <div className="p-5 pb-0">
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-950 border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setType('expense');
                setCategory('groceries');
              }}
              className={`py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center space-x-2 ${
                type === 'expense' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Expense Outflow</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setType('income');
                setCategory('salary');
              }}
              className={`py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center space-x-2 ${
                type === 'income' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ArrowDownRight className="w-4 h-4" />
              <span>Income Inflow</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Title */}
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold block">Description / Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={type === 'expense' ? 'e.g. Whole Foods Groceries, Electric Bill' : 'e.g. Biweekly Paycheck, Freelance Client'}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Amount & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">Amount ({sym})</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-slate-400 font-bold">{sym}</span>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Category Picker */}
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold block">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 capitalize"
            >
              {(type === 'expense' ? expenseCategories : incomeCategories).map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method (Expense) or Frequency (Income) */}
          {type === 'expense' ? (
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e: any) => setPaymentMethod(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="credit_card">Credit Card</option>
                <option value="debit_card">Debit Card</option>
                <option value="bank_transfer">Bank Wire / ACH</option>
                <option value="upi">UPI / Instant Transfer</option>
                <option value="cash">Cash</option>
              </select>
            </div>
          ) : (
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">Deposit Frequency</label>
              <select
                value={frequency}
                onChange={(e: any) => setFrequency(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="monthly">Monthly Recurring</option>
                <option value="biweekly">Bi-Weekly</option>
                <option value="weekly">Weekly</option>
                <option value="one-time">One-Time Lump Sum</option>
              </select>
            </div>
          )}

          {/* Recurring Toggle */}
          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="isRecurringCheck"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="rounded border-slate-800 bg-slate-950 text-emerald-500 focus:ring-0"
            />
            <label htmlFor="isRecurringCheck" className="text-slate-300 font-medium cursor-pointer">
              Mark as repeating monthly budget commitment
            </label>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold block">Notes (Optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Split with roomate, business receipt"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-2.5 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-5 py-2 rounded-xl font-bold text-white transition cursor-pointer ${
                type === 'expense'
                  ? 'bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/20'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
              }`}
            >
              {isSubmitting ? 'Recording...' : `Record ${type === 'expense' ? 'Expense' : 'Income'}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
