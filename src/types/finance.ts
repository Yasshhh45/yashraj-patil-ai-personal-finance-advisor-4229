export type CurrencyCode = 'USD' | 'INR' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  label: string;
}

export type RiskTolerance = 'conservative' | 'balanced' | 'aggressive';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  currency: CurrencyCode;
  currencySymbol: string;
  monthlyIncomeGoal: number;
  emergencyFundMonths: number;
  riskTolerance: RiskTolerance;
  bio?: string;
  createdAt: string;
}

export type IncomeCategory =
  | 'salary'
  | 'freelance'
  | 'investment'
  | 'rental'
  | 'business'
  | 'side_hustle'
  | 'bonus'
  | 'other';

export interface IncomeRecord {
  id: string;
  userId: string;
  title: string;
  amount: number;
  category: IncomeCategory;
  date: string;
  isRecurring: boolean;
  frequency: 'monthly' | 'biweekly' | 'weekly' | 'one-time';
  notes?: string;
}

export type ExpenseCategory =
  | 'housing'
  | 'groceries'
  | 'dining'
  | 'utilities'
  | 'transport'
  | 'entertainment'
  | 'health'
  | 'shopping'
  | 'debt'
  | 'subscriptions'
  | 'education'
  | 'personal'
  | 'other';

export interface ExpenseRecord {
  id: string;
  userId: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  paymentMethod: 'credit_card' | 'debit_card' | 'bank_transfer' | 'cash' | 'upi';
  notes?: string;
  isRecurring: boolean;
}

export interface BudgetPlan {
  id: string;
  userId: string;
  category: ExpenseCategory;
  allocatedAmount: number;
  period: 'monthly';
  alertThresholdPercentage: number; // e.g. 80%
}

export type SavingsGoalCategory =
  | 'emergency_fund'
  | 'retirement'
  | 'travel'
  | 'investment'
  | 'home'
  | 'gadget'
  | 'vehicle'
  | 'other';

export interface SavingsGoal {
  id: string;
  userId: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: SavingsGoalCategory;
  color?: string;
  monthlyContributionTarget?: number;
}

export interface CategorySummary {
  category: ExpenseCategory;
  label: string;
  spent: number;
  allocated: number;
  percentageUsed: number;
  isOverBudget: boolean;
  transactionCount: number;
  color: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsRate: number; // percentage
  healthScore: number; // 0 - 100
  healthRating: 'Critical' | 'Needs Attention' | 'Good' | 'Exceptional';
  runwayMonths: number;
  emergencyFundTarget: number;
  emergencyFundCurrent: number;
  activeBudgetsCount: number;
  overBudgetCategoriesCount: number;
  categorySummaries: CategorySummary[];
  monthlyTrend: {
    month: string;
    income: number;
    expenses: number;
    savings: number;
  }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  quickPrompts?: string[];
  isAiAdvisor?: boolean;
}

export interface OverspendingAlert {
  category: string;
  spent: number;
  budget: number;
  excess: number;
  severity: 'low' | 'medium' | 'high';
  advice: string;
}

export interface CostOptimizationTip {
  title: string;
  description: string;
  potentialSavings: number;
  difficulty: 'Easy' | 'Medium' | 'Challenging';
  category: string;
}

export interface FinancialHealthAudit {
  score: number;
  status: string;
  headline: string;
  summary: string;
  strengths: string[];
  vulnerabilities: string[];
  overspendingAlerts: OverspendingAlert[];
  costOptimizationTips: CostOptimizationTip[];
  emergencyFundAnalysis: {
    runwayMonths: number;
    targetMonths: number;
    status: 'Deficient' | 'Adequate' | 'Strong';
    actionPlan: string;
  };
  yashrajPatilRecommendation: string;
  generatedAt: string;
}
