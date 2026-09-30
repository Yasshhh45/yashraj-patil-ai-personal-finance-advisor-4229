import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  ShieldAlert, 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownRight,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Wallet,
  Clock,
  ArrowRight,
  Target,
  BarChart3,
  Bot
} from 'lucide-react';
import { FinancialSummary, ExpenseRecord, IncomeRecord, SavingsGoal, UserProfile } from '../types/finance';

interface DashboardTabProps {
  summary: FinancialSummary;
  expenses: ExpenseRecord[];
  incomes: IncomeRecord[];
  savingsGoals: SavingsGoal[];
  currentUser: UserProfile;
  onNavigateTab: (tab: string) => void;
  onOpenAddModal: (type: 'expense' | 'income') => void;
  onOpenAuditModal: () => void;
  onOpenAskAdvisor: (initialPrompt?: string) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  summary,
  expenses,
  incomes,
  savingsGoals,
  currentUser,
  onNavigateTab,
  onOpenAddModal,
  onOpenAuditModal,
  onOpenAskAdvisor,
}) => {
  const sym = currentUser.currencySymbol;

  // Format currency helper
  const fmt = (num: number) => {
    return `${sym}${num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const overspentCats = summary.categorySummaries.filter((c) => c.isOverBudget);

  // Compute SVG Donut Chart for categories
  const totalCategorySpent = summary.categorySummaries.reduce((sum, c) => sum + c.spent, 0);
  let cumulativeAngle = 0;
  const donutSlices = summary.categorySummaries.map((cat) => {
    const fraction = totalCategorySpent > 0 ? cat.spent / totalCategorySpent : 0;
    const angle = fraction * 360;
    const startAngle = cumulativeAngle;
    cumulativeAngle += angle;
    return {
      ...cat,
      fraction,
      startAngle,
      angle,
    };
  });

  // Recent transactions list
  const recentTransactions = [
    ...expenses.map((e) => ({ ...e, type: 'expense' as const })),
    ...incomes.map((i) => ({ ...i, type: 'income' as const })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Welcome & AI Advisor Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 border border-slate-800 p-6 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Bot className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Welcome back, {currentUser.name.split(' ')[0]}
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
                  Yashraj Patil Advisor Ready
                </span>
              </div>
              <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Your monthly financial engine is operating with a <strong className="text-emerald-400">{summary.savingsRate}%</strong> savings rate. 
                {overspentCats.length > 0 ? (
                  <span className="text-rose-300"> Attention needed in {overspentCats.length} category exceeding allocations.</span>
                ) : (
                  <span className="text-slate-300"> All category budgets are currently adhering to guidelines.</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onOpenAskAdvisor('Yashraj, analyze my spending patterns and tell me where to cut costs.')}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition cursor-pointer shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Ask Advisor</span>
            </button>
            <button
              onClick={onOpenAuditModal}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 transition cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Run Deep AI Audit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overspending Alerts Warning Bar (Conditional) */}
      {overspentCats.length > 0 && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider">Budget Overflow Alert</h4>
              <p className="text-xs text-rose-200/90 mt-0.5">
                Over-budget in: {overspentCats.map((c) => `${c.label} (excess ${fmt(c.spent - c.allocated)})`).join(', ')}
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenAskAdvisor(`Yashraj, I exceeded my budget in ${overspentCats[0]?.label}. How should I adjust my remaining monthly expenses to stay net positive?`)}
            className="text-xs font-semibold text-rose-300 hover:text-white bg-rose-500/20 hover:bg-rose-500/30 px-3 py-1.5 rounded-lg border border-rose-500/30 transition shrink-0 cursor-pointer"
          >
            Fix With Advisor →
          </button>
        </div>
      )}

      {/* Primary KPI Grid (5 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Income Card */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Income</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-bold text-white tracking-tight">{fmt(summary.totalIncome)}</h3>
            <div className="flex items-center space-x-1.5 mt-1.5 text-xs text-emerald-400 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Goal: {fmt(currentUser.monthlyIncomeGoal)}</span>
            </div>
          </div>
        </div>

        {/* Expenses Card */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Expenses</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-bold text-white tracking-tight">{fmt(summary.totalExpenses)}</h3>
            <div className="flex items-center space-x-1.5 mt-1.5 text-xs text-slate-400 font-medium">
              <span>{expenses.length} recorded payments</span>
            </div>
          </div>
        </div>

        {/* Net Monthly Savings */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Net Monthly Savings</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-bold text-white tracking-tight">{fmt(summary.netSavings)}</h3>
            <div className="flex items-center space-x-1.5 mt-1.5 text-xs text-indigo-400 font-medium">
              <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[11px]">
                {summary.savingsRate}% Rate
              </span>
              <span>of income</span>
            </div>
          </div>
        </div>

        {/* Financial Health Score */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Yashraj Health Score</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
              summary.healthScore >= 75 ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'
            }`}>
              {summary.healthScore}
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline space-x-1.5">
              <h3 className="text-2xl font-bold text-white tracking-tight">{summary.healthScore}</h3>
              <span className="text-xs text-slate-400">/ 100</span>
            </div>
            <div className="flex items-center space-x-1.5 mt-1.5 text-xs font-medium">
              <span className={`px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                summary.healthRating === 'Exceptional' ? 'bg-emerald-500/20 text-emerald-300' :
                summary.healthRating === 'Good' ? 'bg-teal-500/20 text-teal-300' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {summary.healthRating}
              </span>
            </div>
          </div>
        </div>

        {/* Emergency Runway */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Emergency Runway</span>
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline space-x-1.5">
              <h3 className="text-2xl font-bold text-white tracking-tight">{summary.runwayMonths}</h3>
              <span className="text-xs text-slate-400">Months</span>
            </div>
            <div className="flex items-center space-x-1.5 mt-1.5 text-xs text-slate-400 font-medium">
              <span>Target: {currentUser.emergencyFundMonths} months ({fmt(summary.emergencyFundCurrent)})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts & Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Breakdown (Donut Chart & List) */}
        <div className="lg:col-span-7 rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Spending by Category</h3>
              <p className="text-xs text-slate-400">Current cycle expense distribution and adherence</p>
            </div>
            <button
              onClick={() => onNavigateTab('budget')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Budgets</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* SVG Donut Visual */}
            <div className="md:col-span-5 flex flex-col items-center justify-center relative py-2">
              <svg viewBox="0 0 160 160" className="w-44 h-44 -rotate-90">
                {/* Background Ring */}
                <circle cx="80" cy="80" r="60" fill="transparent" stroke="#1e293b" strokeWidth="18" />
                {/* Slices */}
                {donutSlices.map((slice, i) => {
                  const circumference = 2 * Math.PI * 60;
                  const strokeDasharray = `${(slice.fraction * circumference)} ${circumference}`;
                  const strokeDashoffset = -((slice.startAngle / 360) * circumference);
                  return (
                    <circle
                      key={slice.category}
                      cx="80"
                      cy="80"
                      r="60"
                      fill="transparent"
                      stroke={slice.color}
                      strokeWidth="18"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-300 hover:opacity-85"
                    />
                  );
                })}
              </svg>
              {/* Donut Center Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider">Total Spent</span>
                <span className="text-lg font-bold text-white font-mono">{fmt(summary.totalExpenses)}</span>
                <span className="text-[10px] text-slate-400">{summary.categorySummaries.length} Categories</span>
              </div>
            </div>

            {/* Category breakdown bars */}
            <div className="md:col-span-7 space-y-3 max-h-72 overflow-y-auto pr-1">
              {summary.categorySummaries.slice(0, 6).map((cat) => {
                return (
                  <div key={cat.category} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></span>
                        <span className="font-semibold text-slate-200">{cat.label}</span>
                      </div>
                      <div className="flex items-center space-x-2 font-mono">
                        <span className="font-bold text-white">{fmt(cat.spent)}</span>
                        {cat.allocated > 0 && (
                          <span className={`text-[11px] ${cat.isOverBudget ? 'text-rose-400 font-bold' : 'text-slate-400'}`}>
                            / {fmt(cat.allocated)}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, cat.percentageUsed)}%`,
                          backgroundColor: cat.isOverBudget ? '#f43f5e' : cat.color,
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 6-Month Income vs Expense Trend Chart */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Financial Momentum</h3>
                <p className="text-xs text-slate-400">Income vs Expenses over the last 6 months</p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                +14.2% YoY
              </span>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="pt-4 pb-2">
              <div className="flex items-end justify-between h-44 gap-2 pt-6">
                {summary.monthlyTrend.map((item, idx) => {
                  const maxVal = Math.max(...summary.monthlyTrend.map((t) => Math.max(t.income, t.expenses))) * 1.15;
                  const incHeight = Math.round((item.income / maxVal) * 100);
                  const expHeight = Math.round((item.expenses / maxVal) * 100);

                  return (
                    <div key={item.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                      <div className="w-full flex items-end justify-center gap-1 h-32">
                        {/* Income Bar */}
                        <div
                          style={{ height: `${incHeight}%` }}
                          className="w-1/2 max-w-[14px] bg-emerald-500/80 hover:bg-emerald-400 rounded-t transition-all relative group-hover:scale-y-105"
                          title={`Income: ${fmt(item.income)}`}
                        ></div>
                        {/* Expense Bar */}
                        <div
                          style={{ height: `${expHeight}%` }}
                          className="w-1/2 max-w-[14px] bg-rose-500/70 hover:bg-rose-400 rounded-t transition-all relative group-hover:scale-y-105"
                          title={`Expenses: ${fmt(item.expenses)}`}
                        ></div>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400 group-hover:text-white transition">
                        {item.month}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Chart Legend */}
              <div className="flex items-center justify-center space-x-6 mt-4 pt-3 border-t border-slate-800/80 text-xs">
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded bg-emerald-500"></span>
                  <span className="text-slate-300 font-medium">Income</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded bg-rose-500"></span>
                  <span className="text-slate-300 font-medium">Expenses</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Average Monthly Savings</span>
            <span className="font-bold text-emerald-400 font-mono">
              {fmt(Math.round(summary.monthlyTrend.reduce((s, m) => s + m.savings, 0) / summary.monthlyTrend.length))} / mo
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Savings Goals Snapshot & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Savings Goals Preview */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Savings & Wealth Vaults</h3>
              <p className="text-xs text-slate-400">Target milestones & compounding progress</p>
            </div>
            <button
              onClick={() => onNavigateTab('savings')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {savingsGoals.slice(0, 3).map((goal) => {
              const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
              return (
                <div key={goal.id} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{goal.title}</span>
                    <span className="font-mono text-emerald-400 font-semibold">{pct}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: goal.color || '#10b981' }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>{fmt(goal.currentAmount)}</span>
                    <span>Target: {fmt(goal.targetAmount)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Transactions Feed */}
        <div className="lg:col-span-7 rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Recent Transactions</h3>
              <p className="text-xs text-slate-400">Latest cash inflows and outflows</p>
            </div>
            <button
              onClick={() => onNavigateTab('transactions')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              <span>All Transactions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-800/80">
            {recentTransactions.map((tx: any) => {
              const isIncome = tx.type === 'income';
              return (
                <div key={tx.id} className="py-2.5 flex items-center justify-between hover:bg-slate-800/20 px-2 rounded-lg transition">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isIncome ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {isIncome ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{tx.title}</h4>
                      <p className="text-[11px] text-slate-400 capitalize">
                        {tx.category.replace('_', ' ')} • {tx.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-bold font-mono ${isIncome ? 'text-emerald-400' : 'text-slate-200'}`}>
                      {isIncome ? '+' : '-'}{fmt(tx.amount)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
