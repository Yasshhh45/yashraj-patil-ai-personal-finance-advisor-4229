import React, { useState } from 'react';
import { 
  ShieldCheck, 
  PiggyBank, 
  Plus, 
  Sparkles, 
  Target, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  AlertCircle,
  CheckCircle2,
  Trash2,
  ArrowUpRight
} from 'lucide-react';
import { FinancialSummary, SavingsGoal, UserProfile } from '../types/finance';

interface SavingsTabProps {
  savingsGoals: SavingsGoal[];
  summary: FinancialSummary;
  currentUser: UserProfile;
  onOpenAddGoalModal: () => void;
  onContributeGoal: (goalId: string, amount: number) => Promise<void>;
  onDeleteGoal: (goalId: string) => Promise<void>;
  onOpenAdvisor: (prompt: string) => void;
}

export const SavingsTab: React.FC<SavingsTabProps> = ({
  savingsGoals,
  summary,
  currentUser,
  onOpenAddGoalModal,
  onContributeGoal,
  onDeleteGoal,
  onOpenAdvisor,
}) => {
  const [contributeGoalId, setContributeGoalId] = useState<string | null>(null);
  const [contributionAmount, setContributionAmount] = useState<string>('');

  const sym = currentUser.currencySymbol;
  const fmt = (n: number) => `${sym}${n.toLocaleString()}`;

  const monthlyBurn = summary.totalExpenses > 0 ? summary.totalExpenses : 3000;
  const targetEmergencyRunway = currentUser.emergencyFundMonths || 6;
  const calculatedEmergencyTarget = monthlyBurn * targetEmergencyRunway;
  const emergencyGoal = savingsGoals.find((g) => g.category === 'emergency_fund');
  const currentEmergencyFund = emergencyGoal ? emergencyGoal.currentAmount : 0;
  const emergencyProgressPct = Math.min(100, Math.round((currentEmergencyFund / calculatedEmergencyTarget) * 100));
  const emergencyRunwayMonths = monthlyBurn > 0 ? (currentEmergencyFund / monthlyBurn).toFixed(1) : '0';

  const totalVaultSavings = savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalVaultTargets = savingsGoals.reduce((sum, g) => sum + g.targetAmount, 0);

  const handleQuickContribute = async (goalId: string) => {
    const val = parseFloat(contributionAmount);
    if (!isNaN(val) && val > 0) {
      await onContributeGoal(goalId, val);
      setContributeGoalId(null);
      setContributionAmount('');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header & New Goal Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Savings & Wealth Accumulation Vault</h2>
          <p className="text-xs text-slate-400">
            Emergency capital protection, goal milestones, and compounding investment reserves
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onOpenAdvisor(`Yashraj, analyze my savings goals. My emergency fund is at ${fmt(currentEmergencyFund)} with a target of ${fmt(calculatedEmergencyTarget)}. What is the fastest path to achieve this?`)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Savings Guidance</span>
          </button>
          <button
            onClick={onOpenAddGoalModal}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition shadow-md shadow-emerald-400/20 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Savings Goal</span>
          </button>
        </div>
      </div>

      {/* Flagship Emergency Cushion Assessment Card */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-teal-950/40 border border-teal-500/30 p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Emergency Liquidity Fortress (Yashraj Patil Assessment)
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Based on your monthly expenditure baseline of <strong className="text-white">{fmt(monthlyBurn)}</strong>,
              your recommended <strong>{targetEmergencyRunway}-month liquidity target</strong> is{' '}
              <strong className="text-teal-300">{fmt(calculatedEmergencyTarget)}</strong>. 
              You currently hold <strong className="text-emerald-400">{fmt(currentEmergencyFund)}</strong> ({emergencyRunwayMonths} months of living runway).
            </p>
          </div>

          {/* Runway Metric Box */}
          <div className="flex items-center space-x-4 bg-slate-950/70 border border-slate-800 p-4 rounded-xl shrink-0">
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">Current Buffer</span>
              <span className="text-2xl font-bold text-teal-400 font-mono">{emergencyRunwayMonths} / {targetEmergencyRunway}</span>
              <span className="text-xs text-slate-400 block">Months Runway</span>
            </div>
            <div className="h-10 w-px bg-slate-800"></div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">Fortress Health</span>
              <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${
                parseFloat(emergencyRunwayMonths) >= targetEmergencyRunway
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : parseFloat(emergencyRunwayMonths) >= 3
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'bg-rose-500/20 text-rose-300'
              }`}>
                {parseFloat(emergencyRunwayMonths) >= targetEmergencyRunway ? 'Optimal' : parseFloat(emergencyRunwayMonths) >= 3 ? 'Building' : 'Critical'}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 pt-4 border-t border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300 font-medium">Fund Progress: {emergencyProgressPct}% Achieved</span>
            <span className="text-teal-400">{fmt(currentEmergencyFund)} / {fmt(calculatedEmergencyTarget)}</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${emergencyProgressPct}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Aggregate Vault Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-4">
          <span className="text-xs text-slate-400 font-medium">Total Vault Holdings</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <h4 className="text-xl font-bold text-white font-mono">{fmt(totalVaultSavings)}</h4>
            <span className="text-[11px] text-emerald-400">across {savingsGoals.length} goals</span>
          </div>
        </div>

        <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-4">
          <span className="text-xs text-slate-400 font-medium">Aggregate Target Milestones</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <h4 className="text-xl font-bold text-white font-mono">{fmt(totalVaultTargets)}</h4>
            <span className="text-[11px] text-slate-400">
              ({totalVaultTargets > 0 ? Math.round((totalVaultSavings / totalVaultTargets) * 100) : 0}% achieved)
            </span>
          </div>
        </div>

        <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-4">
          <span className="text-xs text-slate-400 font-medium">Monthly Compounding Margin</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <h4 className="text-xl font-bold text-emerald-400 font-mono">+{fmt(summary.netSavings)}</h4>
            <span className="text-[11px] text-slate-400">available to allocate</span>
          </div>
        </div>
      </div>

      {/* All Savings Goals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {savingsGoals.map((goal) => {
          const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
          const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
          const isContributing = contributeGoalId === goal.id;

          return (
            <div
              key={goal.id}
              className="rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 p-5 shadow-sm space-y-4 transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {goal.category.replace('_', ' ')}
                    </span>
                    <h4 className="text-sm font-bold text-white tracking-tight mt-1.5">{goal.title}</h4>
                  </div>
                  <button
                    onClick={() => onDeleteGoal(goal.id)}
                    className="text-slate-400 hover:text-rose-400 p-1 rounded transition cursor-pointer"
                    title="Remove goal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Numbers */}
                <div className="flex items-baseline justify-between text-xs">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Accumulated</span>
                    <span className="text-lg font-bold font-mono text-emerald-400">{fmt(goal.currentAmount)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block">Target</span>
                    <span className="text-sm font-bold font-mono text-white">{fmt(goal.targetAmount)}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: goal.color || '#10b981' }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{pct}% funded</span>
                    <span>{remaining > 0 ? `${fmt(remaining)} to go` : 'Goal Fulfilled!'}</span>
                  </div>
                </div>

                {goal.targetDate && (
                  <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
                    <Calendar className="w-3 h-3" />
                    <span>Target Date: {goal.targetDate}</span>
                  </div>
                )}
              </div>

              {/* Bottom Quick Contribution Form */}
              <div className="pt-3 border-t border-slate-800">
                {isContributing ? (
                  <div className="flex items-center space-x-1.5">
                    <div className="relative flex-1">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">{sym}</span>
                      <input
                        type="number"
                        value={contributionAmount}
                        onChange={(e) => setContributionAmount(e.target.value)}
                        placeholder="Amount"
                        className="w-full bg-slate-950 border border-emerald-500 rounded-lg pl-6 pr-2 py-1 text-xs text-white font-mono focus:outline-none"
                        autoFocus
                      />
                    </div>
                    <button
                      onClick={() => handleQuickContribute(goal.id)}
                      className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition cursor-pointer"
                    >
                      Deposit
                    </button>
                    <button
                      onClick={() => setContributeGoalId(null)}
                      className="px-2 py-1 text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setContributeGoalId(goal.id);
                      setContributionAmount('250');
                    }}
                    className="w-full py-1.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Deposit Capital</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
