import React from 'react';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp, 
  ArrowRight, 
  Flame, 
  CheckCircle2, 
  DollarSign, 
  Bot,
  Lightbulb
} from 'lucide-react';
import { FinancialHealthAudit, UserProfile } from '../types/finance';

interface HealthAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  audit: FinancialHealthAudit | null;
  isLoading: boolean;
  currentUser: UserProfile;
  onAskAdvisor: (prompt: string) => void;
  onRefreshAudit: () => void;
}

export const HealthAuditModal: React.FC<HealthAuditModalProps> = ({
  isOpen,
  onClose,
  audit,
  isLoading,
  currentUser,
  onAskAdvisor,
  onRefreshAudit,
}) => {
  if (!isOpen) return null;

  const sym = currentUser.currencySymbol;
  const fmt = (n: number) => `${sym}${n.toLocaleString()}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 p-0.5">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white tracking-tight">Yashraj Patil AI Health Audit</h3>
                <span className="text-[10px] font-semibold uppercase bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  Comprehensive
                </span>
              </div>
              <p className="text-xs text-slate-400">Quantitative diagnosis of cash flow, liquidity, and cost leaks</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          {isLoading ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto animate-pulse">
                <Sparkles className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Yashraj Patil is running algorithmic audit...</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Cross-referencing category expense variances, savings velocity, and emergency cushion runway.
                </p>
              </div>
            </div>
          ) : audit ? (
            <>
              {/* Score Headline Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 to-emerald-950/30 border border-slate-800 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Financial Health Index
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-white">{audit.headline}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed mt-1">{audit.summary}</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
                  <span className="text-3xl font-extrabold text-emerald-400 font-mono">{audit.score}</span>
                  <span className="text-[10px] text-slate-400 block">/ 100</span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 block mt-1">
                    {audit.status}
                  </span>
                </div>
              </div>

              {/* Strengths & Vulnerabilities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Strengths */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5">
                  <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Key Structural Strengths</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-300">
                    {audit.strengths.map((str, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Vulnerabilities */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5">
                  <div className="flex items-center space-x-2 text-rose-400 font-bold">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Identified Vulnerabilities</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-300">
                    {audit.vulnerabilities.map((vuln, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-rose-400 font-bold">•</span>
                        <span>{vuln}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Cost Optimization Opportunities */}
              {audit.costOptimizationTips && audit.costOptimizationTips.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-amber-400" />
                      Cost Optimization & Leak Plugs
                    </h4>
                    <span className="text-[11px] text-emerald-400 font-bold font-mono">
                      +
                      {fmt(
                        audit.costOptimizationTips.reduce(
                          (s, t) => s + (t.potentialSavings || 0),
                          0
                        )
                      )}{' '}
                      Monthly Savings Potential
                    </span>
                  </div>

                  <div className="space-y-2">
                    {audit.costOptimizationTips.map((tip, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start justify-between gap-3"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-white">{tip.title}</span>
                            <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                              {tip.difficulty}
                            </span>
                          </div>
                          <p className="text-slate-400 text-[11px] leading-relaxed">{tip.description}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold text-emerald-400 font-mono">
                            +{fmt(tip.potentialSavings)}/mo
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Emergency Fund Analysis */}
              {audit.emergencyFundAnalysis && (
                <div className="p-4 rounded-xl bg-teal-950/20 border border-teal-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-teal-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" /> Emergency Fund Analysis
                    </span>
                    <span className="font-mono text-teal-400 font-bold">
                      {audit.emergencyFundAnalysis.runwayMonths} / {audit.emergencyFundAnalysis.targetMonths} Months
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    {audit.emergencyFundAnalysis.actionPlan}
                  </p>
                </div>
              )}

              {/* Advisor Final Word */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider">
                  Yashraj Patil's Prescribed Directive
                </span>
                <p className="text-xs text-white leading-relaxed font-medium">
                  "{audit.yashrajPatilRecommendation}"
                </p>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between shrink-0">
          <button
            onClick={onRefreshAudit}
            className="text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer"
          >
            Re-run Audit
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onClose();
                onAskAdvisor('Yashraj, how should I execute the top cost optimization tip from my health audit?');
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition shadow-md shadow-emerald-400/20 cursor-pointer flex items-center space-x-1.5"
            >
              <span>Discuss Plan with Advisor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
