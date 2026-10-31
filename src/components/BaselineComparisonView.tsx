import React, { useState } from 'react';
import { LabMetric, SupportedLanguage } from '../types';
import { evaluateLabMetric } from '../utils/medicalLogic';
import { UI_TRANSLATIONS } from '../utils/languages';
import {
  Activity,
  Heart,
  TrendingDown,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Scale,
  ShieldAlert,
  Info,
} from 'lucide-react';

interface BaselineComparisonViewProps {
  metrics: LabMetric[];
  currentLanguage: SupportedLanguage;
  overallScore: number;
}

export const BaselineComparisonView: React.FC<BaselineComparisonViewProps> = ({
  metrics,
  currentLanguage,
  overallScore,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const t = UI_TRANSLATIONS[currentLanguage.code] || UI_TRANSLATIONS.en;

  const categories = ['All', ...Array.from(new Set(metrics.map((m) => m.category)))];

  const filteredMetrics =
    selectedCategory === 'All'
      ? metrics
      : metrics.filter((m) => m.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Top Benchmark Overview Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Scale className="w-3.5 h-3.5" />
              Healthy Human Normal vs Current Patient Benchmark
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {t.healthyBenchmarkTab}
            </h2>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Every lab test parameter is compared directly with an optimal healthy adult human benchmark. See exactly how your numbers differ from healthy reference biology.
            </p>
          </div>

          {/* Health Index Dial */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/15">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="5"
                  className="text-slate-700"
                  fill="transparent"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeDasharray={175}
                  strokeDashoffset={175 - (175 * overallScore) / 100}
                  className={`${overallScore >= 75 ? 'text-emerald-400' : overallScore >= 50 ? 'text-amber-400' : 'text-rose-400'}`}
                  fill="transparent"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-lg font-black text-white">
                {overallScore}%
              </span>
            </div>
            <div>
              <div className="text-xs text-slate-300 font-medium">Health Vitality Score</div>
              <div className="text-sm font-bold text-teal-200">
                {overallScore >= 75 ? 'Optimal Stability' : overallScore >= 50 ? 'Moderate Deviation' : 'Needs Active Care'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category filter pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Metric Comparison Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filteredMetrics.map((metric) => {
          const evalResult = evaluateLabMetric(
            metric.patientValue,
            metric.healthyNormalMin,
            metric.healthyNormalMax,
            metric.healthyIdealBaseline,
            metric.name,
            metric.unit
          );

          const isCritical = evalResult.status === 'critical-low' || evalResult.status === 'critical-high';
          const isAbnormal = !evalResult.isHealthy;

          return (
            <div
              key={metric.id}
              className={`p-5 rounded-2xl bg-white border transition-all ${
                isCritical
                  ? 'border-rose-300 shadow-xs ring-1 ring-rose-200'
                  : isAbnormal
                  ? 'border-amber-200'
                  : 'border-slate-200/80 hover:border-teal-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      {metric.name}
                    </h3>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {metric.category}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                    <span>Target Organ: {metric.organAffected}</span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      evalResult.badgeColor === 'emerald'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : evalResult.badgeColor === 'amber'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {evalResult.badgeColor === 'emerald' ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5" />
                    )}
                    {evalResult.statusBadge}
                  </span>

                  {evalResult.percentageVariance !== 0 && (
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 ${
                        evalResult.percentageVariance > 0
                          ? 'bg-rose-100/70 text-rose-800'
                          : 'bg-amber-100/70 text-amber-800'
                      }`}
                    >
                      {evalResult.percentageVariance > 0 ? (
                        <TrendingUp className="w-3.5 h-3.5" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {evalResult.percentageVariance > 0 ? '+' : ''}
                        {evalResult.percentageVariance}%
                      </span>
                    </span>
                  )}
                </div>
              </div>

              {/* Side-by-Side Comparison Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                {/* Left: Healthy Normal Baseline */}
                <div className="border-b sm:border-b-0 sm:border-r border-slate-200/80 pb-3 sm:pb-0 sm:pr-4">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{t.normalBenchmarkHeader}</span>
                  </div>
                  <div className="text-xl font-extrabold text-emerald-700 mt-1">
                    {metric.healthyIdealBaseline} {metric.unit}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Healthy Range: <span className="font-semibold text-slate-700">{metric.healthyNormalMin} - {metric.healthyNormalMax} {metric.unit}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 italic">
                    {metric.healthyBaselineNote}
                  </div>
                </div>

                {/* Right: Current Patient Value */}
                <div className="sm:pl-4">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Activity className="w-3 h-3 text-teal-600" />
                    <span>{t.yourReportHeader}</span>
                  </div>
                  <div
                    className={`text-xl font-extrabold mt-1 ${
                      evalResult.badgeColor === 'emerald'
                        ? 'text-emerald-700'
                        : evalResult.badgeColor === 'amber'
                        ? 'text-amber-700'
                        : 'text-rose-700'
                    }`}
                  >
                    {metric.patientValue} {metric.unit}
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Status: <span className="font-semibold">{evalResult.statusBadge}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {evalResult.humanComparisonSummary}
                  </div>
                </div>
              </div>

              {/* Visual Visual Comparison Gauge Bar */}
              <div className="mt-4">
                <div className="flex justify-between items-center text-[11px] text-slate-400 font-medium mb-1.5">
                  <span>Below Healthy Threshold</span>
                  <span className="text-emerald-700 font-bold">Optimal Healthy Zone</span>
                  <span>Above Healthy Threshold</span>
                </div>

                <div className="relative w-full h-3 bg-slate-200 rounded-full overflow-hidden flex">
                  {/* Left sub-normal zone */}
                  <div className="w-1/4 h-full bg-amber-200/80" />
                  {/* Center healthy green zone */}
                  <div className="w-2/4 h-full bg-emerald-400/90" />
                  {/* Right elevated zone */}
                  <div className="w-1/4 h-full bg-rose-200/80" />

                  {/* Marker Pin representing the patient value */}
                  <div
                    className="absolute top-0 bottom-0 w-3 bg-slate-900 rounded-full shadow-md border-2 border-white transform -translate-x-1/2 transition-all duration-500"
                    style={{ left: `${evalResult.gaugePositionPercent}%` }}
                    title={`Patient: ${metric.patientValue} ${metric.unit}`}
                  />
                </div>
              </div>

              {/* Plain Language Body Explanation */}
              <div className="mt-4 p-3 rounded-xl bg-teal-50/50 border border-teal-100 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700 leading-relaxed">
                  <span className="font-semibold text-teal-900">What this means inside your body: </span>
                  {metric.plainExplanation}
                  {metric.translatedExplanation && (
                    <div className="mt-1 pt-1 border-t border-teal-100/60 font-medium text-teal-950 font-serif">
                      {metric.translatedExplanation}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
