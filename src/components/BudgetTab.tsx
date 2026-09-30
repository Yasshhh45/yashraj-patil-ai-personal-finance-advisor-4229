import React, { useState } from 'react';
import { 
  PieChart, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Layers, 
  Wand2, 
  ArrowRight,
  TrendingDown,
  Info,
  Edit2
} from 'lucide-react';
import { BudgetPlan, CategorySummary, ExpenseCategory, FinancialSummary, UserProfile } from '../types/finance';

interface BudgetTabProps {
  budgets: BudgetPlan[];
  summary: FinancialSummary;
  currentUser: UserProfile;
  onApplyTemplate: (template: string) => Promise<void>;
  onGenerateAiBudget: () => Promise<void>;
  onUpdateBudget: (category: ExpenseCategory, amount: number) => Promise<void>;
  isGeneratingAi: boolean;
}

export const BudgetTab: React.FC<BudgetTabProps> = ({
  budgets,
  summary,
  currentUser,
  onApplyTemplate,
  onGenerateAiBudget,
  onUpdateBudget,
  isGeneratingAi,
}) => {
  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null);
  const [editAmount, setEditAmount] = useState<string>('');

  const sym = currentUser.currencySymbol;
  const fmt = (n: number) => `${sym}${n.toLocaleString()}`;

  const totalAllocated = budgets.reduce((sum, b) => sum + Number(b.allocatedAmount), 0);
  const totalSpent = summary.totalExpenses;
  const totalIncome = summary.totalIncome || currentUser.monthlyIncomeGoal || 5000;
  const allocationRatio = totalIncome > 0 ? Math.round((totalAllocated / totalIncome) * 100) : 0;

  const handleStartEdit = (category: ExpenseCategory, currentAllocated: number) => {
    setEditingCategory(category);
    setEditAmount(currentAllocated.toString());
  };

  const handleSaveEdit = async (category: ExpenseCategory) => {
    const val = parseFloat(editAmount);
    if (!isNaN(val) && val >= 0) {
      await onUpdateBudget(category, val);
    }
    setEditingCategory(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner & Generation Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Intelligent Budget Planning Engine</h2>
          <p className="text-xs text-slate-400">
            Set and monitor category thresholds powered by the 50/30/20 rule and Yashraj Patil AI allocations
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Apply 50/30/20 Template */}
          <button
            onClick={() => onApplyTemplate('50_30_20')}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 transition cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Apply 50/30/20 Rule</span>
          </button>

          {/* AI Smart Budget Generator */}
          <button
            onClick={onGenerateAiBudget}
            disabled={isGeneratingAi}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 transition shadow-lg shadow-emerald-500/20 disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isGeneratingAi ? 'Yashraj Patil Calculating...' : 'AI Smart Budget'}</span>
          </button>
        </div>
      </div>

      {/* Allocation Overview Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-4">
          <span className="text-xs text-slate-400 font-medium">Monthly Income Baseline</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <h4 className="text-xl font-bold text-white font-mono">{fmt(totalIncome)}</h4>
            <span className="text-[11px] text-emerald-400">available capital</span>
          </div>
        </div>

        <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-4">
          <span className="text-xs text-slate-400 font-medium">Total Planned Allocations</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <h4 className="text-xl font-bold text-white font-mono">{fmt(totalAllocated)}</h4>
            <span className="text-[11px] text-slate-400 font-mono">({allocationRatio}% of income)</span>
          </div>
        </div>

        <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-4">
          <span className="text-xs text-slate-400 font-medium">Unallocated Surplus for Wealth</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <h4 className="text-xl font-bold text-emerald-400 font-mono">
              {fmt(Math.max(0, totalIncome - totalAllocated))}
            </h4>
            <span className="text-[11px] text-slate-400">compounding margin</span>
          </div>
        </div>
      </div>

      {/* Category Budgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {summary.categorySummaries.map((cat) => {
          const isOver = cat.isOverBudget;
          const isNear = !isOver && cat.percentageUsed >= 80;
          const isEditing = editingCategory === cat.category;

          return (
            <div
              key={cat.category}
              className={`rounded-2xl p-5 border transition shadow-sm space-y-3 ${
                isOver
                  ? 'bg-rose-950/20 border-rose-500/40'
                  : isNear
                  ? 'bg-amber-950/20 border-amber-500/40'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Category Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }}></span>
                  <h4 className="text-sm font-bold text-white tracking-tight">{cat.label}</h4>
                </div>

                <div className="flex items-center space-x-1.5">
                  {isOver && (
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                      <AlertTriangle className="w-2.5 h-2.5" /> Exceeded
                    </span>
                  )}
                  {isNear && (
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      Caution ({cat.percentageUsed}%)
                    </span>
                  )}
                  {!isOver && !isNear && cat.allocated > 0 && (
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      On Track
                    </span>
                  )}
                </div>
              </div>

              {/* Numbers Row */}
              <div className="flex items-baseline justify-between text-xs pt-1">
                <div>
                  <span className="text-[11px] text-slate-400 block">Spent This Cycle</span>
                  <span className="font-bold text-base font-mono text-white">{fmt(cat.spent)}</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">Budget Ceiling</span>
                  {isEditing ? (
                    <div className="flex items-center space-x-1 mt-0.5">
                      <input
                        type="number"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        className="w-20 bg-slate-950 border border-emerald-500 rounded px-1.5 py-0.5 text-xs text-white font-mono focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveEdit(cat.category)}
                        className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 text-[10px] font-bold"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1.5 justify-end">
                      <span className="font-bold text-sm font-mono text-slate-300">
                        {cat.allocated > 0 ? fmt(cat.allocated) : 'Unset'}
                      </span>
                      <button
                        onClick={() => handleStartEdit(cat.category, cat.allocated)}
                        className="text-slate-400 hover:text-emerald-400 transition cursor-pointer"
                        title="Edit allocated budget"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Visual */}
              <div className="space-y-1">
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, cat.percentageUsed)}%`,
                      backgroundColor: isOver ? '#f43f5e' : isNear ? '#f59e0b' : cat.color,
                    }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>{cat.percentageUsed}% consumed</span>
                  <span>
                    {cat.allocated > 0
                      ? isOver
                        ? `Over by ${fmt(cat.spent - cat.allocated)}`
                        : `${fmt(cat.allocated - cat.spent)} left`
                      : 'No ceiling'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 50/30/20 Strategy Educational Callout */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/30 border border-slate-800 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Info className="w-4 h-4 text-indigo-400" />
            Yashraj Patil's Golden Rule: The 50/30/20 Framework
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Dedicate <strong>50%</strong> of income to baseline needs (rent, groceries, utilities),{' '}
            <strong>30%</strong> to personal wants (dining, recreation), and <strong>20%</strong> exclusively to
            emergency cushions and compounding investment vehicles.
          </p>
        </div>
        <button
          onClick={() => onApplyTemplate('50_30_20')}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition cursor-pointer shrink-0"
        >
          Rebalance to 50/30/20
        </button>
      </div>
    </div>
  );
};
