import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardTab } from './components/DashboardTab';
import { AdvisorChatTab } from './components/AdvisorChatTab';
import { TransactionsTab } from './components/TransactionsTab';
import { BudgetTab } from './components/BudgetTab';
import { SavingsTab } from './components/SavingsTab';
import { MonthlyReportTab } from './components/MonthlyReportTab';
import { AddTransactionModal } from './components/AddTransactionModal';
import { AddGoalModal } from './components/AddGoalModal';
import { HealthAuditModal } from './components/HealthAuditModal';
import { ProfileModal } from './components/ProfileModal';
import { 
  FinancialSummary, 
  UserProfile, 
  ExpenseRecord, 
  IncomeRecord, 
  BudgetPlan, 
  SavingsGoal, 
  ChatMessage, 
  FinancialHealthAudit, 
  ExpenseCategory 
} from './types/finance';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [incomes, setIncomes] = useState<IncomeRecord[]>([]);
  const [budgets, setBudgets] = useState<BudgetPlan[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalType, setAddModalType] = useState<'expense' | 'income'>('expense');
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // AI State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditData, setAuditData] = useState<FinancialHealthAudit | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch full state from backend
  const fetchState = async (userId?: string) => {
    try {
      const targetUser = userId || currentUser?.id || 'user_yashraj';
      const res = await fetch(`/api/finance/full-state?userId=${encodeURIComponent(targetUser)}`);
      const data = await res.json();
      if (data.user) {
        setCurrentUser(data.user);
        setAllUsers(data.users || [data.user]);
        setSummary(data.summary);
        setExpenses(data.expenses || []);
        setIncomes(data.incomes || []);
        setBudgets(data.budgets || []);
        setSavingsGoals(data.savingsGoals || []);

        // Initialize welcoming chat message if empty
        if (chatMessages.length === 0) {
          const sym = data.user.currencySymbol;
          setChatMessages([
            {
              id: 'init_welcome',
              role: 'assistant',
              content: `Greetings ${data.user.name}! I am **Yashraj Patil**, your AI Personal Finance Planning Advisor.\n\nI have reviewed your current ledger:\n- Monthly Inflow: **${sym}${data.summary.totalIncome.toLocaleString()}**\n- Monthly Outflow: **${sym}${data.summary.totalExpenses.toLocaleString()}**\n- Retained Capital: **+${sym}${data.summary.netSavings.toLocaleString()}** (**${data.summary.savingsRate}%** savings rate)\n- Emergency Runway: **${data.summary.runwayMonths} months**\n\nHow can I help you sharpen your financial trajectory today?`,
              timestamp: 'Just now',
              quickPrompts: [
                'Where am I leaking the most money?',
                'Build a 50/30/20 budget for my income',
                'Calculate when I can save $50,000',
              ],
            },
          ]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch full state:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  // Switch profile
  const handleSwitchUser = async (userId: string) => {
    setIsLoading(true);
    await fetchState(userId);
    showToast(`Switched active profile`);
  };

  // Add Expense
  const handleAddExpense = async (data: any) => {
    try {
      const res = await fetch('/api/finance/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        showToast(`Expense "${data.title}" recorded`);
        await fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add Income
  const handleAddIncome = async (data: any) => {
    try {
      const res = await fetch('/api/finance/incomes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        showToast(`Income "${data.title}" added`);
        await fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Expense
  const handleDeleteExpense = async (id: string) => {
    try {
      const res = await fetch(`/api/finance/expenses/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Expense removed');
        await fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Income
  const handleDeleteIncome = async (id: string) => {
    try {
      const res = await fetch(`/api/finance/incomes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Income removed');
        await fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update Category Budget
  const handleUpdateBudget = async (category: ExpenseCategory, amount: number) => {
    try {
      const res = await fetch('/api/finance/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser?.id,
          category,
          allocatedAmount: amount,
        }),
      });
      if (res.ok) {
        showToast(`Budget for ${category} updated to ${currentUser?.currencySymbol}${amount}`);
        await fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Apply Budget Template
  const handleApplyTemplate = async (template: string) => {
    try {
      const res = await fetch('/api/finance/budgets/apply-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser?.id, template }),
      });
      if (res.ok) {
        showToast('50/30/20 Budget Framework applied successfully!');
        await fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // AI Smart Budget Generation
  const handleGenerateAiBudget = async () => {
    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/ai/generate-budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser?.id }),
      });
      const data = await res.json();
      if (data.success && data.allocations) {
        // Apply allocations into database
        for (const item of data.allocations) {
          await fetch('/api/finance/budgets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: currentUser?.id,
              category: item.category,
              allocatedAmount: item.allocatedAmount,
            }),
          });
        }
        await fetchState();
        showToast('Yashraj Patil AI formulated and calibrated your budget!');
        if (data.advisorNote) {
          setChatMessages((prev) => [
            ...prev,
            {
              id: `ai_bud_${Date.now()}`,
              role: 'assistant',
              content: `### Yashraj Patil AI Budget Formulation\n\n${data.advisorNote}\n\nI have automatically adjusted your category allocations to maximize cash flow protection.`,
              timestamp: 'Just now',
            },
          ]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Add Savings Goal
  const handleAddGoal = async (data: any) => {
    try {
      const res = await fetch('/api/finance/savings-goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        showToast(`Savings goal "${data.title}" established`);
        await fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Contribute to Savings Goal
  const handleContributeGoal = async (goalId: string, amount: number) => {
    try {
      const res = await fetch(`/api/finance/savings-goals/${goalId}/contribute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      if (res.ok) {
        showToast(`Deposited ${currentUser?.currencySymbol}${amount} into goal vault`);
        await fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Savings Goal
  const handleDeleteGoal = async (goalId: string) => {
    try {
      const res = await fetch(`/api/finance/savings-goals/${goalId}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Goal removed');
        await fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update Profile
  const handleUpdateProfile = async (data: Partial<UserProfile>) => {
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser?.id, ...data }),
      });
      if (res.ok) {
        showToast('Financial preferences saved');
        await fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Reset Seed Data
  const handleResetSeedData = async () => {
    try {
      const res = await fetch('/api/finance/reset-seed', { method: 'POST' });
      if (res.ok) {
        showToast('Ledger reset to default demo accounts');
        await fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Chat with Yashraj Patil AI
  const handleSendMessage = async (msgText: string) => {
    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: msgText,
      timestamp: 'Just now',
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser?.id,
          message: msgText,
          history: chatMessages.slice(-6),
        }),
      });
      const data = await res.json();
      if (data.reply) {
        const aiMsg: ChatMessage = {
          id: `ai_${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          timestamp: 'Just now',
          quickPrompts: data.suggestions,
        };
        setChatMessages((prev) => [...prev, aiMsg]);
      }
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsThinking(false);
    }
  };

  // Run Health Audit
  const handleRunAudit = async () => {
    setIsAuditModalOpen(true);
    setIsAuditing(true);
    try {
      const res = await fetch('/api/ai/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser?.id }),
      });
      const data = await res.json();
      if (data.audit) {
        setAuditData(data.audit);
      }
    } catch (err) {
      console.error('Audit error:', err);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleOpenAskAdvisor = (initialPrompt?: string) => {
    setActiveTab('advisor');
    if (initialPrompt) {
      handleSendMessage(initialPrompt);
    }
  };

  if (isLoading || !currentUser || !summary) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-600 p-0.5 animate-pulse">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <span className="text-emerald-400 font-bold text-lg font-mono">YP</span>
          </div>
        </div>
        <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase animate-pulse">
          Initializing Yashraj Patil AI Personal Finance Engine...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-300 text-xs font-semibold px-4 py-3 shadow-2xl flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        allUsers={allUsers}
        onSwitchUser={handleSwitchUser}
        onOpenAddModal={(t) => {
          setAddModalType(t);
          setIsAddModalOpen(true);
        }}
        onOpenAuditModal={handleRunAudit}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardTab
            summary={summary}
            expenses={expenses}
            incomes={incomes}
            savingsGoals={savingsGoals}
            currentUser={currentUser}
            onNavigateTab={setActiveTab}
            onOpenAddModal={(t) => {
              setAddModalType(t);
              setIsAddModalOpen(true);
            }}
            onOpenAuditModal={handleRunAudit}
            onOpenAskAdvisor={handleOpenAskAdvisor}
          />
        )}

        {activeTab === 'advisor' && (
          <AdvisorChatTab
            currentUser={currentUser}
            summary={summary}
            chatMessages={chatMessages}
            onSendMessage={handleSendMessage}
            isThinking={isThinking}
            onOpenAuditModal={handleRunAudit}
          />
        )}

        {activeTab === 'transactions' && (
          <TransactionsTab
            expenses={expenses}
            incomes={incomes}
            currentUser={currentUser}
            onOpenAddModal={(t) => {
              setAddModalType(t);
              setIsAddModalOpen(true);
            }}
            onDeleteExpense={handleDeleteExpense}
            onDeleteIncome={handleDeleteIncome}
          />
        )}

        {activeTab === 'budget' && (
          <BudgetTab
            budgets={budgets}
            summary={summary}
            currentUser={currentUser}
            onApplyTemplate={handleApplyTemplate}
            onGenerateAiBudget={handleGenerateAiBudget}
            onUpdateBudget={handleUpdateBudget}
            isGeneratingAi={isGeneratingAi}
          />
        )}

        {activeTab === 'savings' && (
          <SavingsTab
            savingsGoals={savingsGoals}
            summary={summary}
            currentUser={currentUser}
            onOpenAddGoalModal={() => setIsAddGoalModalOpen(true)}
            onContributeGoal={handleContributeGoal}
            onDeleteGoal={handleDeleteGoal}
            onOpenAdvisor={handleOpenAskAdvisor}
          />
        )}

        {activeTab === 'report' && (
          <MonthlyReportTab
            summary={summary}
            currentUser={currentUser}
            expenses={expenses}
            incomes={incomes}
            savingsGoals={savingsGoals}
            onOpenAdvisor={handleOpenAskAdvisor}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Yashraj Patil • AI Personal Finance Planning & Wealth Advisory Engine</p>
          <div className="flex items-center space-x-4 text-[11px] text-slate-400">
            <span>Server Gemini 3.8 Flash</span>
            <span>•</span>
            <span>50/30/20 Quantitative Framework</span>
            <span>•</span>
            <span>Real-time Ledger State</span>
          </div>
        </div>
      </footer>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        initialType={addModalType}
        currentUser={currentUser}
        onAddExpense={handleAddExpense}
        onAddIncome={handleAddIncome}
      />

      {/* Add Savings Goal Modal */}
      <AddGoalModal
        isOpen={isAddGoalModalOpen}
        onClose={() => setIsAddGoalModalOpen(false)}
        currentUser={currentUser}
        onAddGoal={handleAddGoal}
      />

      {/* Health Audit Modal */}
      <HealthAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        audit={auditData}
        isLoading={isAuditing}
        currentUser={currentUser}
        onAskAdvisor={handleOpenAskAdvisor}
        onRefreshAudit={handleRunAudit}
      />

      {/* Profile & Settings Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        onUpdateProfile={handleUpdateProfile}
        onResetSeedData={handleResetSeedData}
      />
    </div>
  );
}
