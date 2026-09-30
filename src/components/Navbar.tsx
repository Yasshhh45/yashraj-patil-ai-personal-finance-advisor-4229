import React from 'react';
import { 
  Bot, 
  LayoutDashboard, 
  MessageSquareText, 
  Receipt, 
  PieChart, 
  ShieldCheck, 
  FileText, 
  Plus, 
  Sparkles,
  ChevronDown,
  User,
  Settings,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { UserProfile } from '../types/finance';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserProfile;
  allUsers: UserProfile[];
  onSwitchUser: (userId: string) => void;
  onOpenAddModal: (type: 'expense' | 'income') => void;
  onOpenAuditModal: () => void;
  onOpenProfileModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  allUsers,
  onSwitchUser,
  onOpenAddModal,
  onOpenAuditModal,
  onOpenProfileModal,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'advisor', label: 'Yashraj Patil AI', icon: Bot, badge: 'AI' },
    { id: 'transactions', label: 'Cash Flow', icon: Receipt },
    { id: 'budget', label: 'Budgets', icon: PieChart },
    { id: 'savings', label: 'Savings & Vault', icon: ShieldCheck },
    { id: 'report', label: 'Monthly Report', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                  Yashraj Patil
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                    Advisor
                  </span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Personal Finance AI Planning Engine</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-800 text-white shadow-inner border border-slate-700/80'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 text-[9px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick AI Audit Trigger */}
            <button
              onClick={onOpenAuditModal}
              title="Run AI Financial Health Audit"
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-all cursor-pointer shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AI Health Audit</span>
            </button>

            {/* Quick Add Expense */}
            <button
              onClick={() => onOpenAddModal('expense')}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 transition-all shadow-md shadow-rose-600/20 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Expense</span>
            </button>

            {/* Quick Add Income */}
            <button
              onClick={() => onOpenAddModal('income')}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-md shadow-emerald-400/20 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Income</span>
            </button>

            {/* User Profile Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2 p-1.5 pl-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition cursor-pointer"
              >
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-emerald-500/40"
                />
                <span className="hidden xl:inline text-xs font-semibold text-slate-200 truncate max-w-[110px]">
                  {currentUser.name.split(' ')[0]}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1 py-0.5 rounded border border-emerald-800/40">
                  {currentUser.currencySymbol}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {profileDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onClick={() => setProfileDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-800 mb-1">
                    <p className="text-xs font-bold text-white">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                    <div className="mt-1 flex items-center gap-1.5 text-[10px] text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Currency: {currentUser.currency} ({currentUser.currencySymbol})
                    </div>
                  </div>

                  <div className="text-[11px] font-semibold text-slate-400 px-3 py-1 uppercase tracking-wider">
                    Switch Active Profile
                  </div>
                  {allUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => onSwitchUser(u.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition cursor-pointer ${
                        u.id === currentUser.id
                          ? 'bg-emerald-500/15 text-emerald-300 font-semibold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <img src={u.avatar} alt={u.name} className="w-5 h-5 rounded-full object-cover" />
                        <span>{u.name}</span>
                      </div>
                      {u.id === currentUser.id && (
                        <span className="text-[10px] text-emerald-400 font-mono">Active</span>
                      )}
                    </button>
                  ))}

                  <div className="border-t border-slate-800 mt-1 pt-1">
                    <button
                      onClick={onOpenProfileModal}
                      className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-800 transition cursor-pointer"
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-400" />
                      <span>Financial Settings & Preferences</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center space-x-1 overflow-x-auto py-2 border-t border-slate-900 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium transition ${
                  isActive
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
