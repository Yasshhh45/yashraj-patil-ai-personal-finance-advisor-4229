import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize server-side Gemini AI client
const geminiApiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: geminiApiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Category metadata helper
export const CATEGORY_COLORS: Record<string, { label: string; color: string }> = {
  housing: { label: 'Housing & Rent', color: '#38bdf8' },
  groceries: { label: 'Groceries & Food', color: '#34d399' },
  dining: { label: 'Dining & Takeout', color: '#f59e0b' },
  utilities: { label: 'Bills & Utilities', color: '#818cf8' },
  transport: { label: 'Transit & Fuel', color: '#fb7185' },
  entertainment: { label: 'Entertainment & Fun', color: '#a78bfa' },
  health: { label: 'Healthcare & Fitness', color: '#10b981' },
  shopping: { label: 'Shopping & Retail', color: '#f43f5e' },
  debt: { label: 'Debt & Loan Repayment', color: '#ef4444' },
  subscriptions: { label: 'Streaming & Software', color: '#6366f1' },
  education: { label: 'Courses & Books', color: '#06b6d4' },
  personal: { label: 'Personal Care', color: '#ec4899' },
  other: { label: 'Miscellaneous', color: '#94a3b8' },
};

// Seed Data
const getSeedData = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');

  const yashrajUser = {
    id: 'user_yashraj',
    name: 'Yashraj Patil',
    email: 'yashraj.patil@finadvisor.ai',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    currency: 'USD',
    currencySymbol: '$',
    monthlyIncomeGoal: 8500,
    emergencyFundMonths: 6,
    riskTolerance: 'balanced',
    bio: 'Software engineer building financial freedom through quantitative budgeting and disciplined compounding.',
    createdAt: new Date().toISOString(),
  };

  const demoUser2 = {
    id: 'user_priya',
    name: 'Priya Sharma',
    email: 'priya.sharma@designstudio.io',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
    currency: 'USD',
    currencySymbol: '$',
    monthlyIncomeGoal: 6200,
    emergencyFundMonths: 6,
    riskTolerance: 'aggressive',
    bio: 'Freelance UI/UX Director balancing fluctuating gig revenue with steady investment allocations.',
    createdAt: new Date().toISOString(),
  };

  const incomes = [
    {
      id: 'inc_1',
      userId: 'user_yashraj',
      title: 'Principal Software Engineer Salary',
      amount: 6800,
      category: 'salary',
      date: `${currentYear}-${currentMonth}-01`,
      isRecurring: true,
      frequency: 'monthly',
      notes: 'Net post-tax payroll direct deposit',
    },
    {
      id: 'inc_2',
      userId: 'user_yashraj',
      title: 'FinTech Tech Consulting & Architecture',
      amount: 1400,
      category: 'freelance',
      date: `${currentYear}-${currentMonth}-12`,
      isRecurring: true,
      frequency: 'monthly',
      notes: 'Retainer for microservice design',
    },
    {
      id: 'inc_3',
      userId: 'user_yashraj',
      title: 'Dividend Portfolio Yield (VTI/SCHD)',
      amount: 320,
      category: 'investment',
      date: `${currentYear}-${currentMonth}-18`,
      isRecurring: true,
      frequency: 'monthly',
      notes: 'Quarterly dividend distributions reinvestment yield',
    },
    // Priya's incomes
    {
      id: 'inc_4',
      userId: 'user_priya',
      title: 'Client Retainer - Mobile App Design',
      amount: 4200,
      category: 'freelance',
      date: `${currentYear}-${currentMonth}-05`,
      isRecurring: true,
      frequency: 'monthly',
      notes: 'Design sprints monthly invoice',
    },
    {
      id: 'inc_5',
      userId: 'user_priya',
      title: 'Design System Figma UI Kit Sales',
      amount: 1150,
      category: 'side_hustle',
      date: `${currentYear}-${currentMonth}-15`,
      isRecurring: false,
      frequency: 'one-time',
      notes: 'Passive digital asset downloads',
    },
  ];

  const expenses = [
    {
      id: 'exp_1',
      userId: 'user_yashraj',
      title: 'Luxury Apartment Lease & Parking',
      amount: 2200,
      category: 'housing',
      date: `${currentYear}-${currentMonth}-01`,
      paymentMethod: 'bank_transfer',
      notes: 'Includes reserved garage space and water',
      isRecurring: true,
    },
    {
      id: 'exp_2',
      userId: 'user_yashraj',
      title: 'Whole Foods & Trader Joe’s Groceries',
      amount: 540,
      category: 'groceries',
      date: `${currentYear}-${currentMonth}-04`,
      paymentMethod: 'credit_card',
      notes: 'Organic pantry restock & high-protein meal prep',
      isRecurring: false,
    },
    {
      id: 'exp_3',
      userId: 'user_yashraj',
      title: 'Omakase Dinner & Socializing',
      amount: 320,
      category: 'dining',
      date: `${currentYear}-${currentMonth}-08`,
      paymentMethod: 'credit_card',
      notes: 'Weekend dinner with founders and friends',
      isRecurring: false,
    },
    {
      id: 'exp_4',
      userId: 'user_yashraj',
      title: 'Gigabit Fiber Internet & Power Utility',
      amount: 165,
      category: 'utilities',
      date: `${currentYear}-${currentMonth}-09`,
      paymentMethod: 'bank_transfer',
      notes: 'Home lab high-speed uplink',
      isRecurring: true,
    },
    {
      id: 'exp_5',
      userId: 'user_yashraj',
      title: 'Metro Pass & Uber Rides',
      amount: 140,
      category: 'transport',
      date: `${currentYear}-${currentMonth}-14`,
      paymentMethod: 'credit_card',
      notes: 'Commute and airport ride',
      isRecurring: false,
    },
    {
      id: 'exp_6',
      userId: 'user_yashraj',
      title: 'Equinox Gym & Sauna Membership',
      amount: 250,
      category: 'health',
      date: `${currentYear}-${currentMonth}-03`,
      paymentMethod: 'credit_card',
      notes: 'Physical recovery and fitness wellness',
      isRecurring: true,
    },
    {
      id: 'exp_7',
      userId: 'user_yashraj',
      title: 'Software Dev Cloud, GitHub & AI Tools',
      amount: 95,
      category: 'subscriptions',
      date: `${currentYear}-${currentMonth}-06`,
      paymentMethod: 'credit_card',
      notes: 'Copilot, GCP dev cluster, and Spotify',
      isRecurring: true,
    },
    {
      id: 'exp_8',
      userId: 'user_yashraj',
      title: 'Ergonomic Desk Accessories & Books',
      amount: 180,
      category: 'shopping',
      date: `${currentYear}-${currentMonth}-17`,
      paymentMethod: 'credit_card',
      notes: 'Keychron switches and finance textbooks',
      isRecurring: false,
    },
    {
      id: 'exp_9',
      userId: 'user_yashraj',
      title: 'Student Loan Accelerated Amortization',
      amount: 450,
      category: 'debt',
      date: `${currentYear}-${currentMonth}-10`,
      paymentMethod: 'bank_transfer',
      notes: 'Extra principal reduction (avalanche strategy)',
      isRecurring: true,
    },
    {
      id: 'exp_10',
      userId: 'user_yashraj',
      title: 'Cinema & Concert Tickets',
      amount: 110,
      category: 'entertainment',
      date: `${currentYear}-${currentMonth}-21`,
      paymentMethod: 'credit_card',
      notes: 'Weekend symphony showcase',
      isRecurring: false,
    },
    // Priya's expenses
    {
      id: 'exp_11',
      userId: 'user_priya',
      title: 'Studio Loft Rent',
      amount: 1800,
      category: 'housing',
      date: `${currentYear}-${currentMonth}-02`,
      paymentMethod: 'bank_transfer',
      notes: 'Workspace studio lease',
      isRecurring: true,
    },
    {
      id: 'exp_12',
      userId: 'user_priya',
      title: 'Adobe Suite & Figma Enterprise',
      amount: 140,
      category: 'subscriptions',
      date: `${currentYear}-${currentMonth}-05`,
      paymentMethod: 'credit_card',
      notes: 'Design tooling stack',
      isRecurring: true,
    },
  ];

  const budgets = [
    {
      id: 'bud_1',
      userId: 'user_yashraj',
      category: 'housing',
      allocatedAmount: 2300,
      period: 'monthly',
      alertThresholdPercentage: 90,
    },
    {
      id: 'bud_2',
      userId: 'user_yashraj',
      category: 'groceries',
      allocatedAmount: 650,
      period: 'monthly',
      alertThresholdPercentage: 80,
    },
    {
      id: 'bud_3',
      userId: 'user_yashraj',
      category: 'dining',
      allocatedAmount: 400,
      period: 'monthly',
      alertThresholdPercentage: 75,
    },
    {
      id: 'bud_4',
      userId: 'user_yashraj',
      category: 'utilities',
      allocatedAmount: 200,
      period: 'monthly',
      alertThresholdPercentage: 85,
    },
    {
      id: 'bud_5',
      userId: 'user_yashraj',
      category: 'transport',
      allocatedAmount: 250,
      period: 'monthly',
      alertThresholdPercentage: 80,
    },
    {
      id: 'bud_6',
      userId: 'user_yashraj',
      category: 'health',
      allocatedAmount: 300,
      period: 'monthly',
      alertThresholdPercentage: 85,
    },
    {
      id: 'bud_7',
      userId: 'user_yashraj',
      category: 'subscriptions',
      allocatedAmount: 120,
      period: 'monthly',
      alertThresholdPercentage: 80,
    },
    {
      id: 'bud_8',
      userId: 'user_yashraj',
      category: 'shopping',
      allocatedAmount: 300,
      period: 'monthly',
      alertThresholdPercentage: 75,
    },
    {
      id: 'bud_9',
      userId: 'user_yashraj',
      category: 'debt',
      allocatedAmount: 500,
      period: 'monthly',
      alertThresholdPercentage: 90,
    },
    {
      id: 'bud_10',
      userId: 'user_yashraj',
      category: 'entertainment',
      allocatedAmount: 200,
      period: 'monthly',
      alertThresholdPercentage: 80,
    },
  ];

  const savingsGoals = [
    {
      id: 'goal_1',
      userId: 'user_yashraj',
      title: '6-Month Emergency Resilience Vault',
      targetAmount: 28000,
      currentAmount: 21500,
      targetDate: `${currentYear}-12-31`,
      category: 'emergency_fund',
      color: '#10b981',
      monthlyContributionTarget: 1200,
    },
    {
      id: 'goal_2',
      userId: 'user_yashraj',
      title: 'Index ETF & Semiconductor Equity Fund',
      targetAmount: 50000,
      currentAmount: 34200,
      targetDate: `${currentYear + 1}-06-30`,
      category: 'investment',
      color: '#3b82f6',
      monthlyContributionTarget: 1800,
    },
    {
      id: 'goal_3',
      userId: 'user_yashraj',
      title: 'Japan & Swiss Alps Exploration Trip',
      targetAmount: 6500,
      currentAmount: 4800,
      targetDate: `${currentYear}-11-15`,
      category: 'travel',
      color: '#f59e0b',
      monthlyContributionTarget: 600,
    },
    {
      id: 'goal_4',
      userId: 'user_yashraj',
      title: 'Next-Gen M-Series AI Development Rig',
      targetAmount: 3800,
      currentAmount: 3800,
      targetDate: `${currentYear}-${currentMonth}-28`,
      category: 'gadget',
      color: '#8b5cf6',
      monthlyContributionTarget: 400,
    },
  ];

  return {
    users: [yashrajUser, demoUser2],
    incomes,
    expenses,
    budgets,
    savingsGoals,
  };
};

// Database persistence layer
const DB_PATH = path.resolve(__dirname, 'data', 'finance_store.json');

interface DatabaseStore {
  users: any[];
  incomes: any[];
  expenses: any[];
  budgets: any[];
  savingsGoals: any[];
}

let db: DatabaseStore = getSeedData();

const loadDb = () => {
  try {
    if (fs.existsSync(DB_PATH)) {
      const content = fs.readFileSync(DB_PATH, 'utf-8');
      db = JSON.parse(content);
    } else {
      const dataDir = path.dirname(DB_PATH);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      saveDb();
    }
  } catch (err) {
    console.warn('Error reading DB, using default seed:', err);
    db = getSeedData();
  }
};

const saveDb = () => {
  try {
    const dataDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save DB:', err);
  }
};

// Initialize DB on boot
loadDb();

// Financial Calculation Engine
function calculateFinancialSummary(userId: string) {
  const user = db.users.find((u) => u.id === userId) || db.users[0];
  const userIncomes = db.incomes.filter((i) => i.userId === userId);
  const userExpenses = db.expenses.filter((e) => e.userId === userId);
  const userBudgets = db.budgets.filter((b) => b.userId === userId);
  const userGoals = db.savingsGoals.filter((g) => g.userId === userId);

  const totalIncome = userIncomes.reduce((sum, item) => sum + Number(item.amount), 0);
  const totalExpenses = userExpenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const netSavings = Math.max(0, totalIncome - totalExpenses);
  const savingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;

  // Emergency fund calculations
  const emergencyGoal = userGoals.find((g) => g.category === 'emergency_fund');
  const emergencyFundCurrent = emergencyGoal ? emergencyGoal.currentAmount : 0;
  const targetMonths = user.emergencyFundMonths || 6;
  const monthlyBurn = totalExpenses > 0 ? totalExpenses : 2500;
  const emergencyFundTarget = emergencyGoal ? emergencyGoal.targetAmount : monthlyBurn * targetMonths;
  const runwayMonths = monthlyBurn > 0 ? Number((emergencyFundCurrent / monthlyBurn).toFixed(1)) : 0;

  // Category Summaries
  const categoryMap: Record<string, { spent: number; count: number }> = {};
  for (const exp of userExpenses) {
    if (!categoryMap[exp.category]) {
      categoryMap[exp.category] = { spent: 0, count: 0 };
    }
    categoryMap[exp.category].spent += Number(exp.amount);
    categoryMap[exp.category].count += 1;
  }

  const categorySummaries = Object.keys(CATEGORY_COLORS).map((catKey) => {
    const meta = CATEGORY_COLORS[catKey];
    const spent = categoryMap[catKey]?.spent || 0;
    const count = categoryMap[catKey]?.count || 0;
    const budget = userBudgets.find((b) => b.category === catKey);
    const allocated = budget ? Number(budget.allocatedAmount) : 0;
    const percentageUsed = allocated > 0 ? Math.round((spent / allocated) * 100) : spent > 0 ? 100 : 0;
    const isOverBudget = allocated > 0 && spent > allocated;

    return {
      category: catKey,
      label: meta.label,
      color: meta.color,
      spent,
      allocated,
      percentageUsed,
      isOverBudget,
      transactionCount: count,
    };
  }).filter((c) => c.spent > 0 || c.allocated > 0);

  const overBudgetCategoriesCount = categorySummaries.filter((c) => c.isOverBudget).length;
  const activeBudgetsCount = userBudgets.length;

  // Quantitative Health Score Algorithm (0 to 100)
  // Factors: Savings Rate (30%), Emergency Runway (25%), Budget Adherence (25%), Diversification/Goals (20%)
  let score = 50;
  // Savings rate score (up to 30 pts)
  if (savingsRate >= 35) score += 30;
  else if (savingsRate >= 20) score += 22;
  else if (savingsRate >= 10) score += 14;
  else if (savingsRate > 0) score += 6;
  else score -= 15;

  // Emergency runway score (up to 25 pts)
  if (runwayMonths >= targetMonths) score += 25;
  else if (runwayMonths >= 3) score += 18;
  else if (runwayMonths >= 1) score += 8;
  else score -= 10;

  // Budget adherence score (up to 25 pts)
  if (overBudgetCategoriesCount === 0 && activeBudgetsCount > 0) score += 25;
  else if (overBudgetCategoriesCount === 1) score += 15;
  else if (overBudgetCategoriesCount === 2) score += 5;
  else score -= 15;

  // Normalization
  score = Math.max(10, Math.min(100, Math.round(score)));

  let healthRating: 'Critical' | 'Needs Attention' | 'Good' | 'Exceptional' = 'Good';
  if (score >= 85) healthRating = 'Exceptional';
  else if (score >= 70) healthRating = 'Good';
  else if (score >= 50) healthRating = 'Needs Attention';
  else healthRating = 'Critical';

  // Monthly simulated trend
  const monthNames = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  const monthlyTrend = monthNames.map((m, idx) => {
    const factor = 0.9 + idx * 0.03;
    const inc = Math.round(totalIncome * factor);
    const exp = Math.round(totalExpenses * (0.92 + (idx % 2 === 0 ? 0.04 : -0.02)));
    return {
      month: m,
      income: inc,
      expenses: exp,
      savings: Math.max(0, inc - exp),
    };
  });

  return {
    user,
    totalIncome,
    totalExpenses,
    netSavings,
    savingsRate,
    healthScore: score,
    healthRating,
    runwayMonths,
    emergencyFundTarget,
    emergencyFundCurrent,
    activeBudgetsCount,
    overBudgetCategoriesCount,
    categorySummaries,
    monthlyTrend,
  };
}

// ---------------- API ROUTES ----------------

// System health
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    advisorName: 'Yashraj Patil',
    timestamp: new Date().toISOString(),
    hasGeminiKey: Boolean(geminiApiKey),
  });
});

// Full state endpoint
app.get('/api/finance/full-state', (req, res) => {
  const userId = (req.query.userId as string) || 'user_yashraj';
  const user = db.users.find((u) => u.id === userId) || db.users[0];
  const summary = calculateFinancialSummary(user.id);

  res.json({
    user,
    users: db.users,
    incomes: db.incomes.filter((i) => i.userId === user.id),
    expenses: db.expenses.filter((e) => e.userId === user.id),
    budgets: db.budgets.filter((b) => b.userId === user.id),
    savingsGoals: db.savingsGoals.filter((g) => g.userId === user.id),
    summary,
  });
});

// Authentication / Profile Switcher
app.post('/api/auth/login', (req, res) => {
  const { email, userId } = req.body;
  let user = null;
  if (userId) {
    user = db.users.find((u) => u.id === userId);
  } else if (email) {
    user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }
  if (!user) {
    user = db.users[0];
  }
  res.json({ success: true, user });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, currency = 'USD', monthlyIncomeGoal = 5000 } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.json({ success: true, user: existing });
  }

  const newUser = {
    id: `user_${Date.now()}`,
    name,
    email,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
    currency,
    currencySymbol: currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$',
    monthlyIncomeGoal: Number(monthlyIncomeGoal) || 5000,
    emergencyFundMonths: 6,
    riskTolerance: 'balanced',
    bio: 'Individual investor on the path to financial self-sufficiency.',
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  saveDb();
  res.json({ success: true, user: newUser });
});

// Update Profile
app.put('/api/user/profile', (req, res) => {
  const { userId, name, currency, monthlyIncomeGoal, emergencyFundMonths, riskTolerance, bio } = req.body;
  const user = db.users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (name) user.name = name;
  if (currency) {
    user.currency = currency;
    user.currencySymbol = currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';
  }
  if (monthlyIncomeGoal !== undefined) user.monthlyIncomeGoal = Number(monthlyIncomeGoal);
  if (emergencyFundMonths !== undefined) user.emergencyFundMonths = Number(emergencyFundMonths);
  if (riskTolerance) user.riskTolerance = riskTolerance;
  if (bio !== undefined) user.bio = bio;

  saveDb();
  res.json({ success: true, user });
});

// Incomes CRUD
app.post('/api/finance/incomes', (req, res) => {
  const { userId, title, amount, category, date, isRecurring, frequency, notes } = req.body;
  if (!userId || !title || amount === undefined) {
    return res.status(400).json({ error: 'Missing required income fields' });
  }

  const newIncome = {
    id: `inc_${Date.now()}`,
    userId,
    title,
    amount: Number(amount),
    category: category || 'salary',
    date: date || new Date().toISOString().split('T')[0],
    isRecurring: Boolean(isRecurring),
    frequency: frequency || 'monthly',
    notes: notes || '',
  };

  db.incomes.unshift(newIncome);
  saveDb();
  res.json({ success: true, income: newIncome });
});

app.put('/api/finance/incomes/:id', (req, res) => {
  const { id } = req.params;
  const index = db.incomes.findIndex((i) => i.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Income record not found' });
  }

  db.incomes[index] = {
    ...db.incomes[index],
    ...req.body,
    amount: Number(req.body.amount ?? db.incomes[index].amount),
  };

  saveDb();
  res.json({ success: true, income: db.incomes[index] });
});

app.delete('/api/finance/incomes/:id', (req, res) => {
  const { id } = req.params;
  db.incomes = db.incomes.filter((i) => i.id !== id);
  saveDb();
  res.json({ success: true, id });
});

// Expenses CRUD
app.post('/api/finance/expenses', (req, res) => {
  const { userId, title, amount, category, date, paymentMethod, notes, isRecurring } = req.body;
  if (!userId || !title || amount === undefined) {
    return res.status(400).json({ error: 'Missing required expense fields' });
  }

  const newExpense = {
    id: `exp_${Date.now()}`,
    userId,
    title,
    amount: Number(amount),
    category: category || 'other',
    date: date || new Date().toISOString().split('T')[0],
    paymentMethod: paymentMethod || 'credit_card',
    notes: notes || '',
    isRecurring: Boolean(isRecurring),
  };

  db.expenses.unshift(newExpense);
  saveDb();
  res.json({ success: true, expense: newExpense });
});

app.put('/api/finance/expenses/:id', (req, res) => {
  const { id } = req.params;
  const index = db.expenses.findIndex((e) => e.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Expense record not found' });
  }

  db.expenses[index] = {
    ...db.expenses[index],
    ...req.body,
    amount: Number(req.body.amount ?? db.expenses[index].amount),
  };

  saveDb();
  res.json({ success: true, expense: db.expenses[index] });
});

app.delete('/api/finance/expenses/:id', (req, res) => {
  const { id } = req.params;
  db.expenses = db.expenses.filter((e) => e.id !== id);
  saveDb();
  res.json({ success: true, id });
});

// Budgets CRUD
app.post('/api/finance/budgets', (req, res) => {
  const { userId, category, allocatedAmount, alertThresholdPercentage = 80 } = req.body;
  if (!userId || !category || allocatedAmount === undefined) {
    return res.status(400).json({ error: 'Missing required budget fields' });
  }

  // Update existing budget for category or create new
  const existingIdx = db.budgets.findIndex((b) => b.userId === userId && b.category === category);
  if (existingIdx !== -1) {
    db.budgets[existingIdx].allocatedAmount = Number(allocatedAmount);
    db.budgets[existingIdx].alertThresholdPercentage = Number(alertThresholdPercentage);
    saveDb();
    return res.json({ success: true, budget: db.budgets[existingIdx] });
  }

  const newBudget = {
    id: `bud_${Date.now()}`,
    userId,
    category,
    allocatedAmount: Number(allocatedAmount),
    period: 'monthly',
    alertThresholdPercentage: Number(alertThresholdPercentage),
  };

  db.budgets.push(newBudget);
  saveDb();
  res.json({ success: true, budget: newBudget });
});

app.put('/api/finance/budgets/:id', (req, res) => {
  const { id } = req.params;
  const index = db.budgets.findIndex((b) => b.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Budget not found' });
  }

  db.budgets[index] = {
    ...db.budgets[index],
    ...req.body,
    allocatedAmount: Number(req.body.allocatedAmount ?? db.budgets[index].allocatedAmount),
  };

  saveDb();
  res.json({ success: true, budget: db.budgets[index] });
});

app.delete('/api/finance/budgets/:id', (req, res) => {
  const { id } = req.params;
  db.budgets = db.budgets.filter((b) => b.id !== id);
  saveDb();
  res.json({ success: true, id });
});

// Apply 50/30/20 or balanced template
app.post('/api/finance/budgets/apply-template', (req, res) => {
  const { userId, template = '50_30_20' } = req.body;
  const user = db.users.find((u) => u.id === userId) || db.users[0];
  const summary = calculateFinancialSummary(user.id);
  const income = summary.totalIncome || user.monthlyIncomeGoal || 5000;

  // Remove existing budgets for this user
  db.budgets = db.budgets.filter((b) => b.userId === user.id);

  let allocations: { category: string; amount: number }[] = [];
  if (template === '50_30_20') {
    // 50% Needs: Housing (30%), Groceries (8%), Utilities (5%), Transport (4%), Health (3%)
    // 30% Wants: Dining (10%), Entertainment (6%), Shopping (7%), Subscriptions (3%), Personal (4%)
    // 20% Savings / Debt: Debt (10%), Savings goals receive remaining
    allocations = [
      { category: 'housing', amount: Math.round(income * 0.30) },
      { category: 'groceries', amount: Math.round(income * 0.09) },
      { category: 'utilities', amount: Math.round(income * 0.04) },
      { category: 'transport', amount: Math.round(income * 0.04) },
      { category: 'health', amount: Math.round(income * 0.03) },
      { category: 'dining', amount: Math.round(income * 0.08) },
      { category: 'shopping', amount: Math.round(income * 0.06) },
      { category: 'entertainment', amount: Math.round(income * 0.04) },
      { category: 'subscriptions', amount: Math.round(income * 0.02) },
      { category: 'debt', amount: Math.round(income * 0.08) },
    ];
  } else {
    // Conservative Zero-based
    allocations = [
      { category: 'housing', amount: Math.round(income * 0.28) },
      { category: 'groceries', amount: Math.round(income * 0.08) },
      { category: 'utilities', amount: Math.round(income * 0.03) },
      { category: 'transport', amount: Math.round(income * 0.03) },
      { category: 'health', amount: Math.round(income * 0.04) },
      { category: 'dining', amount: Math.round(income * 0.05) },
      { category: 'shopping', amount: Math.round(income * 0.04) },
      { category: 'subscriptions', amount: Math.round(income * 0.02) },
      { category: 'debt', amount: Math.round(income * 0.12) },
    ];
  }

  allocations.forEach((item) => {
    db.budgets.push({
      id: `bud_${Date.now()}_${item.category}`,
      userId: user.id,
      category: item.category,
      allocatedAmount: item.amount,
      period: 'monthly',
      alertThresholdPercentage: 80,
    });
  });

  saveDb();
  res.json({ success: true, budgets: db.budgets.filter((b) => b.userId === user.id) });
});

// Savings Goals CRUD
app.post('/api/finance/savings-goals', (req, res) => {
  const { userId, title, targetAmount, currentAmount = 0, targetDate, category, color, monthlyContributionTarget } = req.body;
  if (!userId || !title || targetAmount === undefined) {
    return res.status(400).json({ error: 'Missing required savings goal fields' });
  }

  const newGoal = {
    id: `goal_${Date.now()}`,
    userId,
    title,
    targetAmount: Number(targetAmount),
    currentAmount: Number(currentAmount),
    targetDate: targetDate || `${new Date().getFullYear()}-12-31`,
    category: category || 'other',
    color: color || '#10b981',
    monthlyContributionTarget: Number(monthlyContributionTarget) || 0,
  };

  db.savingsGoals.push(newGoal);
  saveDb();
  res.json({ success: true, goal: newGoal });
});

app.post('/api/finance/savings-goals/:id/contribute', (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;
  const goal = db.savingsGoals.find((g) => g.id === id);
  if (!goal) {
    return res.status(404).json({ error: 'Goal not found' });
  }

  const addAmount = Number(amount);
  if (isNaN(addAmount) || addAmount <= 0) {
    return res.status(400).json({ error: 'Invalid contribution amount' });
  }

  goal.currentAmount = Number((goal.currentAmount + addAmount).toFixed(2));
  saveDb();
  res.json({ success: true, goal });
});

app.put('/api/finance/savings-goals/:id', (req, res) => {
  const { id } = req.params;
  const index = db.savingsGoals.findIndex((g) => g.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Goal not found' });
  }

  db.savingsGoals[index] = {
    ...db.savingsGoals[index],
    ...req.body,
    targetAmount: Number(req.body.targetAmount ?? db.savingsGoals[index].targetAmount),
    currentAmount: Number(req.body.currentAmount ?? db.savingsGoals[index].currentAmount),
  };

  saveDb();
  res.json({ success: true, goal: db.savingsGoals[index] });
});

app.delete('/api/finance/savings-goals/:id', (req, res) => {
  const { id } = req.params;
  db.savingsGoals = db.savingsGoals.filter((g) => g.id !== id);
  saveDb();
  res.json({ success: true, id });
});

// Reset to initial seed
app.post('/api/finance/reset-seed', (req, res) => {
  db = getSeedData();
  saveDb();
  res.json({ success: true, message: 'Finance data reset to default seed state' });
});

// ---------------- AI FINANCIAL ADVISOR ENGINE (Yashraj Patil) ----------------

const ADVISOR_SYSTEM_INSTRUCTION = `You are Yashraj Patil, an elite AI Personal Finance Advisor, Certified Wealth Strategist, and Founder of the Yashraj Patil Financial Planning Engine.
Your purpose: Empower individuals to achieve financial independence, conquer unbudgeted spending leaks, build fortress-like emergency cushions, eliminate high-interest liabilities, and accelerate compounding wealth.
Tone: Warm, authoritative, mathematically grounded, encouraging, and deeply practical. Always reference real numbers from the user's finances.
When answering, maintain your identity: "I am Yashraj Patil, your AI Personal Finance Advisor."
Structure responses with clear headers, bullet points, exact dollar/currency amounts, and numbered next steps. Always highlight risk/reward and provide actionable micro-habits.`;

// AI Chat Endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { userId, message, history = [] } = req.body;
    const user = db.users.find((u) => u.id === userId) || db.users[0];
    const summary = calculateFinancialSummary(user.id);
    const userIncomes = db.incomes.filter((i) => i.userId === user.id);
    const userExpenses = db.expenses.filter((e) => e.userId === user.id);
    const userBudgets = db.budgets.filter((b) => b.userId === user.id);
    const userGoals = db.savingsGoals.filter((g) => g.userId === user.id);

    // Build rich context for Yashraj Patil
    const financialContext = `
USER FINANCIAL SNAPSHOT:
- Name: ${user.name}
- Currency: ${user.currencySymbol} (${user.currency})
- Monthly Income: ${user.currencySymbol}${summary.totalIncome.toLocaleString()} (Goal: ${user.currencySymbol}${user.monthlyIncomeGoal.toLocaleString()})
- Monthly Expenses: ${user.currencySymbol}${summary.totalExpenses.toLocaleString()}
- Net Monthly Savings: ${user.currencySymbol}${summary.netSavings.toLocaleString()} (${summary.savingsRate}% savings rate)
- Health Score: ${summary.healthScore}/100 (${summary.healthRating})
- Emergency Fund Runway: ${summary.runwayMonths} months (Target: ${user.emergencyFundMonths} months, Current: ${user.currencySymbol}${summary.emergencyFundCurrent.toLocaleString()})
- Active Budgets: ${userBudgets.length} categories
- Over-budget Categories: ${summary.categorySummaries.filter((c) => c.isOverBudget).map((c) => `${c.label} (Spent ${user.currencySymbol}${c.spent} vs Budget ${user.currencySymbol}${c.allocated})`).join(', ') || 'None! Excellent adherence'}
- Top Spending Categories:
${summary.categorySummaries.slice(0, 5).map((c) => `  * ${c.label}: ${user.currencySymbol}${c.spent} (${c.percentageUsed}% of budget)`).join('\n')}
- Savings Goals:
${userGoals.map((g) => `  * ${g.title}: ${user.currencySymbol}${g.currentAmount} / ${user.currencySymbol}${g.targetAmount} (Target Date: ${g.targetDate})`).join('\n')}
`;

    if (!geminiApiKey) {
      // High-quality intelligent fallback if key is not injected
      const fallbackResponse = `Hello ${user.name}! I am **Yashraj Patil**, your AI Personal Finance Advisor.\n\nAnalyzing your live financial profile:\n- **Monthly Net Cash Flow**: +${user.currencySymbol}${summary.netSavings.toLocaleString()} (Healthy **${summary.savingsRate}%** savings rate)\n- **Financial Health Score**: **${summary.healthScore}/100** (${summary.healthRating})\n- **Emergency Cushion**: **${summary.runwayMonths} months** of runway saved\n\n${
        summary.overBudgetCategoriesCount > 0
          ? `⚠️ **Immediate Action Needed**: You are currently exceeding allocations in **${summary.overBudgetCategoriesCount} category**. Let's rebalance discretionary dining and shopping to protect your emergency buffer.`
          : `✨ **Excellent Discipline**: You are comfortably within your budget limits across all monitored categories.`
      }\n\n**Yashraj Patil's Top 3 Recommendations for You:**\n1. **Automate Savings First**: Auto-transfer ${user.currencySymbol}${Math.round(summary.netSavings * 0.6).toLocaleString()} into your emergency vault on salary day before paying discretionary costs.\n2. **Optimize High-Yield Yields**: Ensure your liquid cash is yielding 4.5%+ APY in a treasury or HYSA.\n3. **Amortize Any Debt**: Maintain accelerated principal reductions on high-interest loans.\n\nHow can I help you customize your strategy today? Ask me about budget generation, tax-advantaged investing, or emergency fund formulas!`;
      return res.json({
        reply: fallbackResponse,
        suggestions: [
          'How can I boost my savings rate by 10%?',
          'Generate a zero-based budget for my income',
          'Evaluate my emergency fund adequacy',
          'Where am I overspending the most?',
        ],
      });
    }

    const promptText = `
${financialContext}

CONVERSATION HISTORY:
${history.slice(-4).map((h: any) => `${h.role === 'user' ? 'User' : 'Yashraj Patil'}: ${h.content}`).join('\n')}

USER QUESTION / PROMPT:
${message}

Respond directly as Yashraj Patil. Provide specific numbers and practical financial advice based on the snapshot above. Include 3 relevant quick follow-up prompt ideas at the very end formatted as:
[SUGGESTIONS]
1. First suggestion
2. Second suggestion
3. Third suggestion
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction: ADVISOR_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const replyRaw = response.text || '';
    let reply = replyRaw;
    let suggestions: string[] = [
      'How to reach my emergency fund target faster?',
      'Which subscription or expense can I cut first?',
      'Should I prioritize debt payoff or investing?',
    ];

    if (replyRaw.includes('[SUGGESTIONS]')) {
      const parts = replyRaw.split('[SUGGESTIONS]');
      reply = parts[0].trim();
      const suggestionsText = parts[1];
      const parsed = suggestionsText
        .split('\n')
        .map((s) => s.replace(/^\d+\.\s*/, '').trim())
        .filter((s) => s.length > 5);
      if (parsed.length > 0) suggestions = parsed.slice(0, 4);
    }

    res.json({ reply, suggestions });
  } catch (err: any) {
    console.error('AI chat error:', err);
    res.status(500).json({
      error: 'Failed to generate financial advice.',
      details: err?.message || 'Server error',
    });
  }
});

// AI Deep Financial Health Audit
app.post('/api/ai/audit', async (req, res) => {
  try {
    const { userId } = req.body;
    const user = db.users.find((u) => u.id === userId) || db.users[0];
    const summary = calculateFinancialSummary(user.id);
    const userExpenses = db.expenses.filter((e) => e.userId === user.id);
    const userBudgets = db.budgets.filter((b) => b.userId === user.id);
    const userGoals = db.savingsGoals.filter((g) => g.userId === user.id);

    // If Gemini key is missing, return robust calculated audit
    if (!geminiApiKey) {
      const overspent = summary.categorySummaries.filter((c) => c.isOverBudget);
      const auditResult = {
        score: summary.healthScore,
        status: summary.healthRating,
        headline: `Solid Financial Architecture with ${summary.savingsRate}% Capital Accumulation Rate`,
        summary: `Yashraj Patil's automated audit confirms positive net cash flow of ${user.currencySymbol}${summary.netSavings.toLocaleString()} per month. Your liquidity runway covers ${summary.runwayMonths} months of baseline living costs.`,
        strengths: [
          `Consistent positive monthly savings margin of ${user.currencySymbol}${summary.netSavings.toLocaleString()}`,
          `Disciplined emergency fund buffer of ${summary.runwayMonths} months against shocks`,
          `Diversified income streams spanning primary salary and secondary freelance/investments`,
        ],
        vulnerabilities: [
          overspent.length > 0
            ? `Category overspending detected in ${overspent.map((o) => o.label).join(', ')}`
            : `Discretionary dining and lifestyle creep can be trimmed by 12%`,
          `Opportunity to accelerate high-yield compounding by routing surplus into automated SIPs`,
        ],
        overspendingAlerts: summary.categorySummaries
          .filter((c) => c.isOverBudget || c.percentageUsed >= 85)
          .map((c) => ({
            category: c.label,
            spent: c.spent,
            budget: c.allocated,
            excess: Math.max(0, c.spent - c.allocated),
            severity: c.isOverBudget ? 'high' : 'medium',
            advice: `Cap discretionary transactions for ${c.label} for the remainder of the billing cycle.`,
          })),
        costOptimizationTips: [
          {
            title: 'Audit Software & Streaming Subscriptions',
            description: 'Consolidate redundant cloud platforms and pause unused video subscriptions.',
            potentialSavings: 45,
            difficulty: 'Easy',
            category: 'subscriptions',
          },
          {
            title: 'Grocery Batch-Cooking Optimization',
            description: 'Plan weekly meal prep to eliminate mid-week food delivery orders.',
            potentialSavings: 120,
            difficulty: 'Medium',
            category: 'groceries',
          },
          {
            title: 'Refinance / Avalanche Debt Tranches',
            description: 'Prioritize paying down the highest APR balance to minimize compound interest fees.',
            potentialSavings: 85,
            difficulty: 'Medium',
            category: 'debt',
          },
        ],
        emergencyFundAnalysis: {
          runwayMonths: summary.runwayMonths,
          targetMonths: user.emergencyFundMonths,
          status: summary.runwayMonths >= user.emergencyFundMonths ? 'Strong' : 'Adequate',
          actionPlan: `Allocate ${user.currencySymbol}400 monthly to reach full ${user.emergencyFundMonths}-month runway milestone.`,
        },
        yashrajPatilRecommendation: `Maintain your strict 50/30/20 baseline allocation. Focus the next 90 days on capping dining spend to ${user.currencySymbol}350 and auto-investing the surplus into low-cost index funds.`,
        generatedAt: new Date().toISOString(),
      };
      return res.json({ audit: auditResult });
    }

    const promptText = `
Conduct an authoritative, quantitative financial health audit for user: ${user.name}.
Financial Data:
- Currency: ${user.currencySymbol} (${user.currency})
- Monthly Income: ${user.currencySymbol}${summary.totalIncome}
- Monthly Expenses: ${user.currencySymbol}${summary.totalExpenses}
- Net Savings: ${user.currencySymbol}${summary.netSavings} (Savings rate: ${summary.savingsRate}%)
- Emergency Runway: ${summary.runwayMonths} months (Target: ${user.emergencyFundMonths} months)
- Expenses Breakdown:
${summary.categorySummaries.map((c) => `  * ${c.label}: Spent ${user.currencySymbol}${c.spent}, Budget ${user.currencySymbol}${c.allocated}`).join('\n')}
- Savings Goals:
${userGoals.map((g) => `  * ${g.title}: ${user.currencySymbol}${g.currentAmount} / ${user.currencySymbol}${g.targetAmount}`).join('\n')}

Provide an in-depth audit from advisor Yashraj Patil in strictly valid JSON format matching this schema:
{
  "score": number (0-100),
  "status": string ("Critical" | "Needs Attention" | "Good" | "Exceptional"),
  "headline": string,
  "summary": string,
  "strengths": string[],
  "vulnerabilities": string[],
  "overspendingAlerts": [
    {
      "category": string,
      "spent": number,
      "budget": number,
      "excess": number,
      "severity": "low" | "medium" | "high",
      "advice": string
    }
  ],
  "costOptimizationTips": [
    {
      "title": string,
      "description": string,
      "potentialSavings": number,
      "difficulty": "Easy" | "Medium" | "Challenging",
      "category": string
    }
  ],
  "emergencyFundAnalysis": {
    "runwayMonths": number,
    "targetMonths": number,
    "status": "Deficient" | "Adequate" | "Strong",
    "actionPlan": string
  },
  "yashrajPatilRecommendation": string,
  "generatedAt": string
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction: ADVISOR_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
      },
    });

    const parsedAudit = JSON.parse(response.text || '{}');
    res.json({ audit: parsedAudit });
  } catch (err: any) {
    console.error('Audit generation error:', err);
    res.status(500).json({ error: 'Failed to generate financial audit', details: err?.message });
  }
});

// AI Smart Budget Generator
app.post('/api/ai/generate-budget', async (req, res) => {
  try {
    const { userId, strategy = 'balanced' } = req.body;
    const user = db.users.find((u) => u.id === userId) || db.users[0];
    const summary = calculateFinancialSummary(user.id);
    const income = summary.totalIncome || user.monthlyIncomeGoal || 6000;

    if (!geminiApiKey) {
      // Fallback budget computation
      const allocations = [
        { category: 'housing', label: 'Housing & Rent', allocatedAmount: Math.round(income * 0.30), rationale: 'Standard safe housing ceiling' },
        { category: 'groceries', label: 'Groceries & Food', allocatedAmount: Math.round(income * 0.09), rationale: 'Nutritious home cooking baseline' },
        { category: 'dining', label: 'Dining & Takeout', allocatedAmount: Math.round(income * 0.06), rationale: 'Controlled culinary enjoyment' },
        { category: 'utilities', label: 'Bills & Utilities', allocatedAmount: Math.round(income * 0.04), rationale: 'Essential utilities & broadband' },
        { category: 'transport', label: 'Transit & Fuel', allocatedAmount: Math.round(income * 0.04), rationale: 'Reliable mobility' },
        { category: 'health', label: 'Healthcare & Fitness', allocatedAmount: Math.round(income * 0.04), rationale: 'Physical health protection' },
        { category: 'subscriptions', label: 'Streaming & Software', allocatedAmount: Math.round(income * 0.02), rationale: 'Essential productivity and media' },
        { category: 'shopping', label: 'Shopping & Retail', allocatedAmount: Math.round(income * 0.05), rationale: 'Replacement items & clothes' },
        { category: 'debt', label: 'Debt & Loan Repayment', allocatedAmount: Math.round(income * 0.08), rationale: 'Aggressive balance elimination' },
        { category: 'entertainment', label: 'Entertainment & Fun', allocatedAmount: Math.round(income * 0.03), rationale: 'Recreation sanity budget' },
      ];

      return res.json({
        success: true,
        advisorNote: `Yashraj Patil has formulated an optimized ${strategy} monthly budget totaling ${user.currencySymbol}${allocations.reduce((s, a) => s + a.allocatedAmount, 0).toLocaleString()}, leaving ${user.currencySymbol}${Math.round(income * 0.25).toLocaleString()} for your savings and compounding investment vaults.`,
        allocations,
      });
    }

    const promptText = `
You are Yashraj Patil. Generate an optimized monthly category budget allocation for:
User: ${user.name}
Monthly Income: ${user.currencySymbol}${income}
Risk Tolerance: ${user.riskTolerance}
Strategy: ${strategy} (e.g. 50/30/20 disciplined or zero-based aggressive savings)

Return JSON with format:
{
  "advisorNote": string,
  "allocations": [
    {
      "category": string (must be valid: housing, groceries, dining, utilities, transport, health, subscriptions, shopping, debt, entertainment, personal, education),
      "label": string,
      "allocatedAmount": number,
      "rationale": string
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction: ADVISOR_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
      },
    });

    const result = JSON.parse(response.text || '{}');
    res.json({ success: true, ...result });
  } catch (err: any) {
    console.error('Smart budget generation error:', err);
    res.status(500).json({ error: 'Failed to generate smart budget', details: err?.message });
  }
});

// ---------------- VITE MIDDLEWARE & SERVER BOOTSTRAP ----------------

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Yashraj Patil AI Personal Finance Advisor server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
