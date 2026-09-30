import React from 'react';
import { 
  Printer, 
  Download, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  ShieldCheck, 
  Calendar,
  Bot
} from 'lucide-react';
import { FinancialSummary, UserProfile, ExpenseRecord, IncomeRecord, SavingsGoal } from '../types/finance';

interface MonthlyReportTabProps {
  summary: FinancialSummary;
  currentUser: UserProfile;
  expenses: ExpenseRecord[];
  incomes: IncomeRecord[];
  savingsGoals: SavingsGoal[];
  onOpenAdvisor: (prompt: string) => void;
}

export const MonthlyReportTab: React.FC<MonthlyReportTabProps> = ({
  summary,
  currentUser,
  expenses,
  incomes,
  savingsGoals,
  onOpenAdvisor,
}) => {
  const sym = currentUser.currencySymbol;
  const fmt = (n: number) => `${sym}${n.toLocaleString()}`;

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  const overspentCats = summary.categorySummaries.filter((c) => c.isOverBudget);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Controls Bar (Hidden during print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Structured Monthly Financial Statement</h2>
          <p className="text-xs text-slate-400">
            Official monthly audit and executive breakdown prepared by Yashraj Patil AI Planning Engine
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition shadow-md shadow-emerald-400/20 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Official Formatted Financial Statement Card */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-10 shadow-xl space-y-8 card-print text-slate-100">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 p-0.5 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Bot className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                PERSONAL FINANCE AUDIT & PERFORMANCE STATEMENT
              </h1>
              <p className="text-xs text-slate-400 font-mono">
                Prepared by Yashraj Patil AI Personal Finance Advisor Engine
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs space-y-1">
            <div className="font-semibold text-white">Statement Period: {currentDate}</div>
            <div className="text-slate-400">Client: {currentUser.name}</div>
            <div className="text-slate-400 font-mono">Currency: {currentUser.currency} ({currentUser.currencySymbol})</div>
            <div className="text-[11px] text-emerald-400 font-medium">Status: Certified Autonomous Analysis</div>
          </div>
        </div>

        {/* Executive Summary Metrics Box */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-xl bg-slate-950/80 border border-slate-800">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">Total Inflow</span>
            <span className="text-lg font-bold font-mono text-emerald-400">{fmt(summary.totalIncome)}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">{incomes.length} revenue sources</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">Total Outflow</span>
            <span className="text-lg font-bold font-mono text-rose-300">{fmt(summary.totalExpenses)}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">{expenses.length} disbursements</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">Net Capital Retained</span>
            <span className="text-lg font-bold font-mono text-emerald-400">+{fmt(summary.netSavings)}</span>
            <span className="text-[10px] text-emerald-400 block mt-0.5 font-bold">{summary.savingsRate}% Savings Rate</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">Yashraj Health Score</span>
            <span className="text-lg font-bold font-mono text-white">{summary.healthScore} / 100</span>
            <span className="text-[10px] text-teal-400 block mt-0.5">{summary.healthRating} Condition</span>
          </div>
        </div>

        {/* Yashraj Patil Executive Commentary */}
        <div className="space-y-2 p-5 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
            <Sparkles className="w-4 h-4" />
            <span>Yashraj Patil Advisor Commentary</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            During this billing cycle, {currentUser.name} generated a healthy positive free cash flow of{' '}
            <strong className="text-white">{fmt(summary.netSavings)}</strong>, representing a disciplined{' '}
            <strong className="text-emerald-400">{summary.savingsRate}% capital accumulation rate</strong>. 
            Your liquid emergency reserves cover <strong className="text-white">{summary.runwayMonths} months</strong> of baseline operational expenditure. 
            {overspentCats.length > 0 ? (
              <span className="text-rose-300 font-medium">
                {' '}Special oversight is requested on {overspentCats.map((o) => o.label).join(', ')}, which surpassed defined ceilings.
              </span>
            ) : (
              <span className="text-emerald-300 font-medium">
                {' '}All active cost categories operated strictly within planned allocations.
              </span>
            )}
          </p>
        </div>

        {/* Category-Wise Expense Analytics Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Category-Wise Breakdown & Variance Analysis
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 uppercase text-[10px] font-semibold tracking-wider">
                  <th className="py-2.5 px-3">Expense Category</th>
                  <th className="py-2.5 px-3 text-right">Actual Spent</th>
                  <th className="py-2.5 px-3 text-right">Budget Ceiling</th>
                  <th className="py-2.5 px-3 text-right">Utilization</th>
                  <th className="py-2.5 px-3 text-right">Variance</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {summary.categorySummaries.map((cat) => {
                  const variance = cat.allocated > 0 ? cat.allocated - cat.spent : 0;
                  return (
                    <tr key={cat.category} className="hover:bg-slate-800/20">
                      <td className="py-2.5 px-3 font-medium text-white flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></span>
                        <span>{cat.label}</span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-200">{fmt(cat.spent)}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-400">
                        {cat.allocated > 0 ? fmt(cat.allocated) : '—'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono">
                        <span className={cat.isOverBudget ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                          {cat.percentageUsed}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono">
                        {cat.allocated > 0 ? (
                          <span className={variance < 0 ? 'text-rose-400' : 'text-emerald-400'}>
                            {variance >= 0 ? '+' : ''}{fmt(variance)}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          cat.isOverBudget
                            ? 'bg-rose-500/20 text-rose-300'
                            : cat.percentageUsed >= 80
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          {cat.isOverBudget ? 'Over Budget' : cat.percentageUsed >= 80 ? 'Caution' : 'Optimal'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Savings Goals Status */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Savings Vaults & Milestone Performance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {savingsGoals.map((goal) => {
              const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
              return (
                <div key={goal.id} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{goal.title}</span>
                    <span className="font-mono text-emerald-400 font-bold">{pct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, backgroundColor: goal.color || '#10b981' }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{fmt(goal.currentAmount)}</span>
                    <span>Target: {fmt(goal.targetAmount)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Official Certification Footer */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <p className="font-bold text-white">Yashraj Patil</p>
            <p className="text-slate-400 text-[11px]">Certified Autonomous AI Financial Planning Engine</p>
            <p className="text-[10px] text-slate-400 font-mono">Hash ID: YP-FIN-{(Math.random() * 1000000).toFixed(0)}</p>
          </div>

          <div className="no-print">
            <button
              onClick={() => onOpenAdvisor('Yashraj, based on my latest monthly statement, what strategic tweaks should I make for next month?')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
            >
              Discuss Next Month's Strategy with Yashraj Patil →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
