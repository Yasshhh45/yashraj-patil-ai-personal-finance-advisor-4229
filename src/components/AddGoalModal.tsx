import React, { useState } from 'react';
import { X, Target, Calendar, DollarSign, Palette } from 'lucide-react';
import { SavingsGoalCategory, UserProfile } from '../types/finance';

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onAddGoal: (data: any) => Promise<void>;
}

export const AddGoalModal: React.FC<AddGoalModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAddGoal,
}) => {
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('0');
  const [category, setCategory] = useState<SavingsGoalCategory>('emergency_fund');
  const [targetDate, setTargetDate] = useState(`${new Date().getFullYear() + 1}-12-31`);
  const [color, setColor] = useState('#10b981');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const sym = currentUser.currencySymbol;

  const colorOptions = [
    '#10b981', // emerald
    '#3b82f6', // blue
    '#8b5cf6', // purple
    '#f59e0b', // amber
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#f43f5e', // rose
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !targetAmount || parseFloat(targetAmount) <= 0) return;

    setIsSubmitting(true);
    try {
      await onAddGoal({
        userId: currentUser.id,
        title: title.trim(),
        targetAmount: parseFloat(targetAmount),
        currentAmount: parseFloat(currentAmount) || 0,
        category,
        targetDate,
        color,
      });
      onClose();
    } catch (err) {
      console.error('Failed to create savings goal:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Create Savings Vault Goal</h3>
              <p className="text-xs text-slate-400">Establish a milestone for wealth accumulation</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold block">Goal Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 6-Month Emergency Vault, S&P 500 Index Fund, Japan Trip"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">Target Amount ({sym})</label>
              <input
                type="number"
                step="0.01"
                required
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="25000"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">Initial Balance ({sym})</label>
              <input
                type="number"
                step="0.01"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                placeholder="0"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">Goal Category</label>
              <select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="emergency_fund">Emergency Fund</option>
                <option value="investment">Equities & ETFs</option>
                <option value="retirement">Retirement Vault</option>
                <option value="travel">Travel & Vacation</option>
                <option value="home">Real Estate Downpayment</option>
                <option value="gadget">Tech Hardware</option>
                <option value="vehicle">Vehicle Fund</option>
                <option value="other">Other Goal</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">Target Milestone Date</label>
              <input
                type="date"
                required
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Color theme */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold block">Visual Accent Color</label>
            <div className="flex items-center space-x-2">
              {colorOptions.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full transition ${
                    color === c ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c }}
                ></button>
              ))}
            </div>
          </div>

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
              className="px-5 py-2 rounded-xl font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition shadow-md shadow-emerald-400/20 cursor-pointer"
            >
              {isSubmitting ? 'Creating...' : 'Establish Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
