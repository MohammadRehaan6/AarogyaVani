import React, { useState } from 'react';
import { MedicineScheduleItem, SupportedLanguage } from '../types';
import { UI_TRANSLATIONS } from '../utils/languages';
import {
  Pill,
  Clock,
  CalendarX,
  AlertTriangle,
  GlassWater,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Info,
  Droplet,
  Utensils,
  Moon,
  Sun,
  Coffee,
} from 'lucide-react';

interface MedicineDosageGuideProps {
  medicines: MedicineScheduleItem[];
  currentLanguage: SupportedLanguage;
}

export const MedicineDosageGuide: React.FC<MedicineDosageGuideProps> = ({
  medicines,
  currentLanguage,
}) => {
  const [selectedMedId, setSelectedMedId] = useState<string>(medicines[0]?.id || '');
  const t = UI_TRANSLATIONS[currentLanguage.code] || UI_TRANSLATIONS.en;

  const activeMed = medicines.find((m) => m.id === selectedMedId) || medicines[0];

  const getAdminModeIcon = (type: string) => {
    switch (type) {
      case 'dissolve-water':
        return <GlassWater className="w-5 h-5 text-blue-600" />;
      case 'eye-drops':
        return <Droplet className="w-5 h-5 text-cyan-600" />;
      case 'chew-tablet':
        return <Utensils className="w-5 h-5 text-amber-600" />;
      case 'sublingual-tongue':
        return <Sparkles className="w-5 h-5 text-purple-600" />;
      case 'tonic-shake':
        return <GlassWater className="w-5 h-5 text-emerald-600" />;
      default:
        return <Pill className="w-5 h-5 text-teal-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-3xl bg-teal-900 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-800 text-teal-200 text-xs font-semibold uppercase tracking-wider mb-2">
              <Pill className="w-3.5 h-3.5" />
              Prescription Timetable & Safety Guide
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">
              {t.medicinesTab}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-teal-200">
              Clear dosage strengths, meal timings (before/after breakfast/lunch/dinner), shelf-life expiry rules, and step-by-step administration method.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1.5 bg-teal-800/80 border border-teal-700 rounded-xl text-teal-100 whitespace-nowrap">
            {medicines.length} Prescribed Medicines
          </span>
        </div>
      </div>

      {/* Main Grid: Medicine Selector Sidebar + Selected Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Medicine List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            Prescription Items
          </div>
          {medicines.map((med) => {
            const isSelected = med.id === activeMed?.id;
            return (
              <button
                type="button"
                key={med.id}
                onClick={() => setSelectedMedId(med.id)}
                className={`w-full p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/20'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-teal-50 text-teal-700'
                      }`}
                    >
                      <Pill className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold line-clamp-1">
                        {med.medicineName}
                      </h4>
                      <span
                        className={`text-[11px] font-semibold block ${
                          isSelected ? 'text-teal-100' : 'text-teal-700'
                        }`}
                      >
                        Strength: {med.dosageStrength}
                      </span>
                    </div>
                  </div>
                  {med.shelfLifeAndExpiry.isSpecialExpiryWarning && (
                    <span
                      className={`p-1 rounded-md ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700'
                      }`}
                      title="Special Expiry / Seal Warning"
                    >
                      <CalendarX className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-100/20 flex items-center justify-between text-[11px]">
                  <span className={isSelected ? 'text-teal-100' : 'text-slate-500'}>
                    {med.mealRelationLabel.split(':')[0]}
                  </span>
                  <span
                    className={`font-semibold px-2 py-0.5 rounded-md ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {med.administrationMode.type.replace('-', ' ')}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Detailed Medicine Breakdown */}
        {activeMed && (
          <div className="lg:col-span-8 space-y-4">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
              {/* Medicine Title Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="text-xs font-bold text-teal-700 uppercase tracking-wider mb-0.5">
                    Generic: {activeMed.genericName}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">
                    {activeMed.medicineName}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-3.5 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 font-extrabold text-sm">
                    {activeMed.dosageStrength}
                  </div>
                </div>
              </div>

              {/* 1. Dosage Strength Reasoning (e.g. P40 vs P20 vs P60) */}
              <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200/80">
                <div className="flex items-center gap-2 text-teal-900 text-xs font-bold uppercase tracking-wider mb-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-700" />
                  <span>Why this exact dosage strength was chosen</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {activeMed.dosageStrengthReason}
                </p>
              </div>

              {/* 2. Timing Slots & Meal Relationship */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-slate-900 text-xs font-bold uppercase tracking-wider">
                    <Clock className="w-4 h-4 text-teal-600" />
                    <span>Exact Timing & Meal Relation</span>
                  </div>
                </div>

                {/* Slots: Morning, Afternoon, Evening, Night */}
                <div className="grid grid-cols-4 gap-2 mb-3">
                  <div
                    className={`p-2.5 rounded-xl text-center border text-xs font-bold ${
                      activeMed.timingSlot.morning
                        ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                        : 'bg-white text-slate-300 border-slate-200'
                    }`}
                  >
                    <Sun className="w-4 h-4 mx-auto mb-1" />
                    <span>Morning</span>
                  </div>
                  <div
                    className={`p-2.5 rounded-xl text-center border text-xs font-bold ${
                      activeMed.timingSlot.afternoon
                        ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                        : 'bg-white text-slate-300 border-slate-200'
                    }`}
                  >
                    <Sun className="w-4 h-4 mx-auto mb-1 text-amber-300" />
                    <span>Afternoon</span>
                  </div>
                  <div
                    className={`p-2.5 rounded-xl text-center border text-xs font-bold ${
                      activeMed.timingSlot.evening
                        ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                        : 'bg-white text-slate-300 border-slate-200'
                    }`}
                  >
                    <Coffee className="w-4 h-4 mx-auto mb-1" />
                    <span>Evening</span>
                  </div>
                  <div
                    className={`p-2.5 rounded-xl text-center border text-xs font-bold ${
                      activeMed.timingSlot.night
                        ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                        : 'bg-white text-slate-300 border-slate-200'
                    }`}
                  >
                    <Moon className="w-4 h-4 mx-auto mb-1" />
                    <span>Night</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800">
                  <div className="text-teal-800 font-bold mb-0.5">Instruction:</div>
                  <div>{activeMed.mealRelationLabel}</div>
                  {activeMed.mealRelationTranslated && (
                    <div className="mt-1 pt-1 border-t border-slate-100 text-teal-950 font-serif">
                      {activeMed.mealRelationTranslated}
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Shelf-Life, Expiry Date & Crucial Seal Opening Rules */}
              <div
                className={`p-4 rounded-2xl border ${
                  activeMed.shelfLifeAndExpiry.isSpecialExpiryWarning
                    ? 'bg-rose-50 border-rose-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <CalendarX
                    className={`w-4 h-4 ${
                      activeMed.shelfLifeAndExpiry.isSpecialExpiryWarning
                        ? 'text-rose-600'
                        : 'text-slate-600'
                    }`}
                  />
                  <h4
                    className={`text-xs font-bold uppercase tracking-wider ${
                      activeMed.shelfLifeAndExpiry.isSpecialExpiryWarning
                        ? 'text-rose-900'
                        : 'text-slate-900'
                    }`}
                  >
                    Shelf Life & Crucial Expiry Rules
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase">
                      Unopened Shelf Life
                    </div>
                    <div className="font-bold text-slate-900 mt-0.5">
                      {activeMed.shelfLifeAndExpiry.unopenedShelfLife}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      {activeMed.shelfLifeAndExpiry.storageCondition}
                    </div>
                  </div>

                  <div
                    className={`p-3 rounded-xl border ${
                      activeMed.shelfLifeAndExpiry.isSpecialExpiryWarning
                        ? 'bg-rose-100/60 border-rose-300 text-rose-950'
                        : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  >
                    <div
                      className={`text-[11px] font-bold uppercase ${
                        activeMed.shelfLifeAndExpiry.isSpecialExpiryWarning
                          ? 'text-rose-800'
                          : 'text-slate-500'
                      }`}
                    >
                      Post-Opening / Seal Broken Rule
                    </div>
                    <div className="font-bold mt-0.5">
                      {activeMed.shelfLifeAndExpiry.afterOpeningRule}
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Administration Mode ("How to Take Medicine") */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-50/50 to-blue-50/50 border border-teal-200">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center">
                    {getAdminModeIcon(activeMed.administrationMode.type)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-teal-900">
                      How to Take This Medicine Correctly
                    </h4>
                    <div className="text-sm font-extrabold text-slate-900">
                      {activeMed.administrationMode.title}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mt-3">
                  {activeMed.administrationMode.stepByStepInstructions.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700"
                    >
                      <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>

                {activeMed.administrationMode.criticalCaution && (
                  <div className="mt-3 p-3 rounded-xl bg-amber-100/70 border border-amber-300 text-xs text-amber-950 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <span>
                      <span className="font-bold">Important Caution: </span>
                      {activeMed.administrationMode.criticalCaution}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
