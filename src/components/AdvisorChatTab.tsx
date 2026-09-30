import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  RefreshCw, 
  User, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp, 
  Lightbulb, 
  Flame, 
  DollarSign, 
  HelpCircle,
  Copy,
  Check,
  Calculator,
  Compass
} from 'lucide-react';
import { ChatMessage, FinancialSummary, UserProfile } from '../types/finance';

interface AdvisorChatTabProps {
  currentUser: UserProfile;
  summary: FinancialSummary;
  chatMessages: ChatMessage[];
  onSendMessage: (message: string) => Promise<void>;
  isThinking: boolean;
  onApplyBudgetTemplate?: () => void;
  onOpenAuditModal: () => void;
}

export const AdvisorChatTab: React.FC<AdvisorChatTabProps> = ({
  currentUser,
  summary,
  chatMessages,
  onSendMessage,
  isThinking,
  onApplyBudgetTemplate,
  onOpenAuditModal,
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const sym = currentUser.currencySymbol;
  const fmt = (n: number) => `${sym}${n.toLocaleString()}`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isThinking]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isThinking) return;
    const msg = inputText.trim();
    setInputText('');
    onSendMessage(msg);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = [
    {
      title: 'Audit Spending Leaks',
      prompt: 'Yashraj, analyze my expense breakdown and pinpoint any unbudgeted spending leaks or waste.',
      icon: Flame,
    },
    {
      title: '50/30/20 Plan',
      prompt: 'Formulate an exact 50/30/20 budget breakdown based on my current monthly income.',
      icon: Calculator,
    },
    {
      title: 'Emergency Fund Strategy',
      prompt: `Evaluate my current emergency fund of ${fmt(summary.emergencyFundCurrent)} against my ${currentUser.emergencyFundMonths}-month runway target.`,
      icon: ShieldCheck,
    },
    {
      title: 'Accelerate Savings by 15%',
      prompt: 'What are the top 3 micro-adjustments I can make this month to increase my net savings rate by 15%?',
      icon: TrendingUp,
    },
  ];

  // Helper to render markdown-like rich text cleanly
  const renderMessageContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Header 3 or 4
      if (line.startsWith('### ') || line.startsWith('## ')) {
        return (
          <h4 key={idx} className="text-sm font-bold text-emerald-300 mt-2 mb-1">
            {line.replace(/^#+\s*/, '')}
          </h4>
        );
      }
      // Bullet list item
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const text = line.trim().substring(2);
        return (
          <div key={idx} className="flex items-start space-x-2 my-1 pl-1 text-slate-200">
            <span className="text-emerald-400 mt-1.5">•</span>
            <div className="flex-1" dangerouslySetInnerHTML={{ __html: formatBold(text) }} />
          </div>
        );
      }
      // Numbered list item
      if (/^\d+\.\s/.test(line.trim())) {
        const match = line.trim().match(/^(\d+\.)\s*(.*)/);
        if (match) {
          return (
            <div key={idx} className="flex items-start space-x-2 my-1 pl-1 text-slate-200">
              <span className="font-mono text-emerald-400 font-bold shrink-0">{match[1]}</span>
              <div className="flex-1" dangerouslySetInnerHTML={{ __html: formatBold(match[2]) }} />
            </div>
          );
        }
      }
      // Empty line spacer
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }
      // Standard paragraph
      return (
        <p key={idx} className="text-slate-200 leading-relaxed my-1" dangerouslySetInnerHTML={{ __html: formatBold(line) }} />
      );
    });
  };

  const formatBold = (str: string) => {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
      .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-slate-800 text-emerald-300 font-mono text-xs">$1</code>');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-130px)] min-h-[640px] animate-in fade-in duration-300">
      {/* Left Chat Conversation Engine */}
      <div className="lg:col-span-8 flex flex-col h-full rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-xl">
        {/* Advisor Header Bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full"></span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold text-white tracking-tight">Yashraj Patil</h2>
                <span className="text-[10px] font-semibold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                  Lead Financial AI
                </span>
              </div>
              <p className="text-xs text-slate-400">Contextual wealth mentoring • Armed with your live ledger</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenAuditModal}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Deep Audit</span>
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {chatMessages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Bubble Container */}
                <div className={`max-w-[85%] sm:max-w-[78%] group relative`}>
                  <div
                    className={`rounded-2xl p-4 text-xs sm:text-sm shadow-md ${
                      isUser
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-slate-950/90 border border-slate-800 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {!isUser && (
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 text-[11px] text-slate-400">
                        <span className="font-semibold text-emerald-400 flex items-center gap-1">
                          <Bot className="w-3 h-3" /> Yashraj Patil
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                          <button
                            onClick={() => handleCopy(msg.id, msg.content)}
                            title="Copy reply"
                            className="text-slate-400 hover:text-white transition cursor-pointer"
                          >
                            {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="prose-sm">{renderMessageContent(msg.content)}</div>
                  </div>

                  {/* Suggestion Chips from Advisor */}
                  {msg.quickPrompts && msg.quickPrompts.length > 0 && !isUser && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {msg.quickPrompts.map((promptText, pIdx) => (
                        <button
                          key={pIdx}
                          onClick={() => onSendMessage(promptText)}
                          className="text-[11px] font-medium text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/40 px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center space-x-1"
                        >
                          <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{promptText}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Thinking Spinner */}
          {isThinking && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-emerald-400 animate-pulse" />
              </div>
              <div className="rounded-2xl rounded-tl-none bg-slate-950/90 border border-slate-800 p-4 text-xs text-slate-300 flex items-center space-x-3 shadow-md">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-xs text-slate-400 font-medium">Yashraj Patil is analyzing your finances...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/80">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Yashraj Patil: e.g. How do I balance my dining spending or set up an index fund plan?"
              rows={2}
              className="w-full resize-none rounded-xl bg-slate-900 border border-slate-700/80 px-4 py-2.5 pr-20 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
            <div className="absolute right-2.5 flex items-center space-x-1">
              <button
                type="submit"
                disabled={!inputText.trim() || isThinking}
                className="p-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 transition cursor-pointer shadow-md shadow-emerald-500/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span>Press Enter to send • Shift+Enter for new line</span>
            <span className="text-emerald-400/80 font-medium">Powered by Gemini 3.8 Flash</span>
          </div>
        </div>
      </div>

      {/* Right Snapshot & Quick Advisor Toolkit */}
      <div className="lg:col-span-4 flex flex-col space-y-4 overflow-y-auto">
        {/* Live Context Card */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Live Financial State</h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40">
              Synced
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Monthly Cash Inflow</span>
              <span className="font-bold text-white font-mono">{fmt(summary.totalIncome)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Monthly Cash Outflow</span>
              <span className="font-bold text-rose-300 font-mono">{fmt(summary.totalExpenses)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Net Monthly Savings</span>
              <span className="font-bold text-emerald-400 font-mono">+{fmt(summary.netSavings)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Savings Rate</span>
              <span className="font-bold text-indigo-400 font-mono">{summary.savingsRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Health Score</span>
              <span className="font-bold text-emerald-400 font-mono">{summary.healthScore}/100</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Emergency Buffer</span>
              <span className="font-bold text-teal-400 font-mono">{summary.runwayMonths} Months</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={onOpenAuditModal}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Generate Health Audit</span>
            </button>
          </div>
        </div>

        {/* Quick Launch Prompts */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-800">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Quick Advice Topics</h3>
          </div>

          <div className="space-y-2">
            {quickPrompts.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => onSendMessage(item.prompt)}
                  className="w-full text-left p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition cursor-pointer group"
                >
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-200 group-hover:text-emerald-400 transition">
                    <Icon className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{item.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {item.prompt}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
