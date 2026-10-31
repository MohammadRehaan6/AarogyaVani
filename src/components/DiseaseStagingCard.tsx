import React from 'react';
import { DiseaseDiagnosis, SupportedLanguage } from '../types';
import { UI_TRANSLATIONS } from '../utils/languages';
import {
  ShieldAlert,
  AlertOctagon,
  Calendar,
  Layers,
  HeartHandshake,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Flame,
} from 'lucide-react';

interface DiseaseStagingCardProps {
  diagnosis: DiseaseDiagnosis;
  currentLanguage: SupportedLanguage;
}

export const DiseaseStagingCard: React.FC<DiseaseStagingCardProps> = ({
  diagnosis,
  currentLanguage,
}) => {
  const t = UI_TRANSLATIONS[currentLanguage.code] || UI_TRANSLATIONS.en;

  const severityColor =
    diagnosis.severity === 'Critical'
      ? 'bg-red-500 text-white'
      : diagnosis.severity === 'Severe'
      ? 'bg-rose-500 text-white'
      : diagnosis.severity === 'Moderate'
      ? 'bg-amber-500 text-white'
      : 'bg-emerald-500 text-white';

  const stages = Array.from({ length: diagnosis.totalStages }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      {/* Primary Diagnosis & Staging Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {diagnosis.category}
              </span>
              <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${severityColor}`}>
                {diagnosis.severity} Severity
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {diagnosis.name}
            </h2>
            {diagnosis.translatedName && (
              <div className="text-base font-semibold text-teal-800 mt-0.5 font-serif">
                {diagnosis.translatedName}
              </div>
            )}
          </div>

          {/* Follow-up reminder box */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900">
            <Calendar className="w-5 h-5 text-teal-600 shrink-0" />
            <div>
              <div className="text-[11px] font-semibold text-teal-700">Follow-up Window</div>
              <div className="text-xs font-bold">In {diagnosis.followUpDays} Days</div>
            </div>
          </div>
        </div>

        {/* Clinical Staging Ladder */}
        <div className="mt-6 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-600" />
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Clinical Staging & Severity Ladder
              </span>
            </div>
            <span className="text-xs font-bold text-teal-700 bg-teal-100 px-3 py-1 rounded-full">
              {diagnosis.stageName}
            </span>
          </div>

          {/* Stepper Progress */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
            {stages.map((stageNum) => {
              const isActive = stageNum === diagnosis.stageLevel;
              const isPast = stageNum < diagnosis.stageLevel;

              return (
                <div
                  key={stageNum}
                  className={`p-3 rounded-xl border transition-all text-center ${
                    isActive
                      ? 'bg-teal-600 text-white border-teal-600 ring-4 ring-teal-600/20 shadow-md font-bold'
                      : isPast
                      ? 'bg-teal-50 text-teal-800 border-teal-200'
                      : 'bg-white text-slate-400 border-slate-200'
                  }`}
                >
                  <div className="text-[11px] font-bold">Stage {stageNum}</div>
                  <div className={`text-[10px] mt-0.5 ${isActive ? 'text-teal-100' : 'text-slate-500'}`}>
                    {stageNum === 1
                      ? 'Mild / Early'
                      : stageNum === 2
                      ? 'Moderate'
                      : stageNum === 3
                      ? 'Advanced / Severe'
                      : 'Critical'}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-slate-600 mt-3 leading-relaxed">
            <span className="font-semibold text-slate-900">Stage Definition: </span>
            {diagnosis.stageDescription}
          </p>

          {diagnosis.translatedStageDescription && (
            <p className="text-xs text-teal-900 font-medium mt-1 font-serif pt-1 border-t border-slate-200/60">
              {diagnosis.translatedStageDescription}
            </p>
          )}
        </div>

        {/* What this means in plain language */}
        <div className="mt-5 p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
          <div className="flex items-center gap-2 mb-2 text-amber-900">
            <HeartHandshake className="w-4 h-4 text-amber-700" />
            <h4 className="text-xs font-bold uppercase tracking-wider">
              What This Condition Means For Your Daily Life
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {diagnosis.whatItMeansForYou}
          </p>
          {diagnosis.translatedWhatItMeans && (
            <p className="text-xs sm:text-sm text-amber-950 font-medium mt-2 pt-2 border-t border-amber-200/60 font-serif">
              {diagnosis.translatedWhatItMeans}
            </p>
          )}
        </div>

        {/* Warning Signs & Red Flags */}
        <div className="mt-5 p-4 rounded-2xl bg-rose-50/70 border border-rose-200">
          <div className="flex items-center gap-2 mb-2.5 text-rose-900">
            <AlertOctagon className="w-4 h-4 text-rose-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider">
              Critical Warning Signs (Seek Immediate Medical Help if Present)
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {diagnosis.warningSigns.map((sign, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 p-2.5 rounded-xl bg-white border border-rose-200/80 text-xs text-slate-800"
              >
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{sign}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
