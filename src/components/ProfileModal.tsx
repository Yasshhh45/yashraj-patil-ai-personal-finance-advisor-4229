import React, { useState } from 'react';
import { X, User, DollarSign, Shield, Settings, RotateCcw } from 'lucide-react';
import { CurrencyCode, RiskTolerance, UserProfile } from '../types/finance';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpdateProfile: (data: Partial<UserProfile>) => Promise<void>;
  onResetSeedData: () => Promise<void>;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateProfile,
  onResetSeedData,
}) => {
  const [name, setName] = useState(currentUser.name);
  const [currency, setCurrency] = useState<CurrencyCode>(currentUser.currency);
  const [monthlyIncomeGoal, setMonthlyIncomeGoal] = useState(currentUser.monthlyIncomeGoal.toString());
  const [emergencyFundMonths, setEmergencyFundMonths] = useState(currentUser.emergencyFundMonths.toString());
  const [riskTolerance, setRiskTolerance] = useState<RiskTolerance>(currentUser.riskTolerance);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onUpdateProfile({
        name: name.trim(),
        currency,
        monthlyIncomeGoal: parseFloat(monthlyIncomeGoal) || 5000,
        emergencyFundMonths: parseInt(emergencyFundMonths, 10) || 6,
        riskTolerance,
        bio: bio.trim(),
      });
      onClose();
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Reset all financial records, budgets, and vaults back to default seed state?')) {
      setIsResetting(true);
      try {
        await onResetSeedData();
        onClose();
      } catch (err) {
        console.error('Reset failed:', err);
      } finally {
        setIsResetting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-slate-800 text-slate-300">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Financial Profile & Parameters</h3>
              <p className="text-xs text-slate-400">Configure financial goals and baseline metrics</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* User Name */}
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold block">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Currency Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">Primary Currency</label>
              <select
                value={currency}
                onChange={(e: any) => setCurrency(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-mono"
              >
                <option value="USD">USD ($) - US Dollar</option>
                <option value="INR">INR (₹) - Indian Rupee</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="GBP">GBP (£) - British Pound</option>
                <option value="CAD">CAD ($) - Canadian Dollar</option>
                <option value="AUD">AUD ($) - Australian Dollar</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">Target Monthly Income</label>
              <input
                type="number"
                value={monthlyIncomeGoal}
                onChange={(e) => setMonthlyIncomeGoal(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Emergency Fund Months & Risk Tolerance */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">Emergency Cushion Target</label>
              <select
                value={emergencyFundMonths}
                onChange={(e) => setEmergencyFundMonths(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="3">3 Months (Aggressive Growth)</option>
                <option value="6">6 Months (Standard Safe Fortress)</option>
                <option value="9">9 Months (High Protection)</option>
                <option value="12">12 Months (Maximum Resilience)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">Investment Risk Appetite</label>
              <select
                value={riskTolerance}
                onChange={(e: any) => setRiskTolerance(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="conservative">Conservative (Capital Defense)</option>
                <option value="balanced">Balanced (Index & Growth)</option>
                <option value="aggressive">Aggressive (High-Yield Tech & Equities)</option>
              </select>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold block">Financial Goals & Bio</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. Saving for house downpayment while paying down debt..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          {/* Reset Demo Data Button */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              disabled={isResetting}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center space-x-1.5 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isResetting ? 'Resetting...' : 'Reset Default Demo Data'}</span>
            </button>
          </div>

          {/* Action Buttons */}
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
              {isSubmitting ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
