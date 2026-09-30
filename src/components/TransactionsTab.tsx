import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Edit3, 
  ArrowDownRight, 
  ArrowUpRight,
  Calendar,
  CreditCard,
  Building,
  DollarSign,
  FileSpreadsheet
} from 'lucide-react';
import { ExpenseRecord, IncomeRecord, UserProfile, ExpenseCategory, IncomeCategory } from '../types/finance';

interface TransactionsTabProps {
  expenses: ExpenseRecord[];
  incomes: IncomeRecord[];
  currentUser: UserProfile;
  onOpenAddModal: (type: 'expense' | 'income') => void;
  onDeleteExpense: (id: string) => void;
  onDeleteIncome: (id: string) => void;
}

export const TransactionsTab: React.FC<TransactionsTabProps> = ({
  expenses,
  incomes,
  currentUser,
  onOpenAddModal,
  onDeleteExpense,
  onDeleteIncome,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'expense' | 'income'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');

  const sym = currentUser.currencySymbol;
  const fmt = (n: number) => `${sym}${n.toLocaleString()}`;

  // Combine and normalize items
  const allItems = useMemo(() => {
    const list: any[] = [];
    if (filterType === 'all' || filterType === 'income') {
      incomes.forEach((i) => list.push({ ...i, transactionType: 'income' }));
    }
    if (filterType === 'all' || filterType === 'expense') {
      expenses.forEach((e) => list.push({ ...e, transactionType: 'expense' }));
    }

    // Filter by category
    let filtered = list;
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          (item.notes && item.notes.toLowerCase().includes(q)) ||
          item.category.toLowerCase().includes(q)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'amount-desc') return b.amount - a.amount;
      if (sortBy === 'amount-asc') return a.amount - b.amount;
      return 0;
    });

    return filtered;
  }, [incomes, expenses, filterType, selectedCategory, searchQuery, sortBy]);

  // Aggregate stats
  const totalInflow = incomes.reduce((s, i) => s + i.amount, 0);
  const totalOutflow = expenses.reduce((s, e) => s + e.amount, 0);
  const netMargin = totalInflow - totalOutflow;

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Type', 'Title', 'Amount', 'Currency', 'Category', 'Date', 'PaymentMethod', 'Recurring', 'Notes'];
    const rows = allItems.map((item) => [
      item.transactionType,
      `"${item.title.replace(/"/g, '""')}"`,
      item.amount,
      currentUser.currency,
      item.category,
      item.date,
      item.paymentMethod || 'direct',
      item.isRecurring ? 'Yes' : 'No',
      `"${(item.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `financial_ledger_${currentUser.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Ledger Headline & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Financial Ledger & Transactions</h2>
          <p className="text-xs text-slate-400">Track and categorize every income source and expense outflow</p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => onOpenAddModal('expense')}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 transition shadow-md shadow-rose-600/20 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Expense</span>
          </button>
          <button
            onClick={() => onOpenAddModal('income')}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition shadow-md shadow-emerald-400/20 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Income</span>
          </button>
        </div>
      </div>

      {/* Quick Cash Flow Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-4">
          <span className="text-xs text-slate-400 font-medium">Filtered Cash Inflow</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <h4 className="text-xl font-bold text-emerald-400 font-mono">+{fmt(totalInflow)}</h4>
            <span className="text-[11px] text-slate-400">({incomes.length} deposits)</span>
          </div>
        </div>

        <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-4">
          <span className="text-xs text-slate-400 font-medium">Filtered Cash Outflow</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <h4 className="text-xl font-bold text-rose-400 font-mono">-{fmt(totalOutflow)}</h4>
            <span className="text-[11px] text-slate-400">({expenses.length} payments)</span>
          </div>
        </div>

        <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-4">
          <span className="text-xs text-slate-400 font-medium">Net Ledger Balance</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <h4 className={`text-xl font-bold font-mono ${netMargin >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {netMargin >= 0 ? '+' : ''}{fmt(netMargin)}
            </h4>
            <span className="text-[11px] text-slate-400">retained liquidity</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Segmented Type Toggle */}
          <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 shrink-0">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filterType === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Records ({incomes.length + expenses.length})
            </button>
            <button
              onClick={() => setFilterType('expense')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filterType === 'expense' ? 'bg-rose-500/20 text-rose-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Expenses ({expenses.length})
            </button>
            <button
              onClick={() => setFilterType('income')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filterType === 'income' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Incomes ({incomes.length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, notes, or category..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2 shrink-0">
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table / List */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-sm">
        {allItems.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-white">No transactions found</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No entries matched your search query or selected filter criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase text-[10px] font-semibold tracking-wider">
                  <th className="py-3 px-4">Transaction</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {allItems.map((item) => {
                  const isIncome = item.transactionType === 'income';
                  return (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition">
                      {/* Title & Notes */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                              isIncome ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                            }`}
                          >
                            {isIncome ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{item.title}</span>
                              {item.isRecurring && (
                                <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                                  Recurring
                                </span>
                              )}
                            </div>
                            {item.notes && <p className="text-[11px] text-slate-400 line-clamp-1">{item.notes}</p>}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-[11px] capitalize font-medium">
                          {item.category.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 text-slate-400 font-mono whitespace-nowrap">
                        {item.date}
                      </td>

                      {/* Payment Method */}
                      <td className="py-3 px-4 text-slate-400 capitalize">
                        {item.paymentMethod ? item.paymentMethod.replace('_', ' ') : 'Bank Transfer'}
                      </td>

                      {/* Amount */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <span
                          className={`font-bold font-mono text-sm ${
                            isIncome ? 'text-emerald-400' : 'text-slate-100'
                          }`}
                        >
                          {isIncome ? '+' : '-'}{fmt(item.amount)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => (isIncome ? onDeleteIncome(item.id) : onDeleteExpense(item.id))}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                          title="Delete entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
