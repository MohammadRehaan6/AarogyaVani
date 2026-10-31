import React, { useState } from 'react';
import { DietRecommendation, ExercisePlan, SupportedLanguage } from '../types';
import { UI_TRANSLATIONS } from '../utils/languages';
import {
  Salad,
  Footprints,
  Sun,
  Wind,
  ShieldCheck,
  AlertCircle,
  Apple,
  Dumbbell,
  Sparkles,
  Ban,
  Check,
} from 'lucide-react';

interface RecoveryPlanViewProps {
  dietPlan: DietRecommendation;
  exercisePlan: ExercisePlan;
  currentLanguage: SupportedLanguage;
}

export const RecoveryPlanView: React.FC<RecoveryPlanViewProps> = ({
  dietPlan,
  exercisePlan,
  currentLanguage,
}) => {
  const [activeTab, setActiveTab] = useState<'diet' | 'yoga-exercise'>('diet');
  const t = UI_TRANSLATIONS[currentLanguage.code] || UI_TRANSLATIONS.en;

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex p-1.5 bg-slate-100 rounded-2xl max-w-md">
        <button
          onClick={() => setActiveTab('diet')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
            activeTab === 'diet'
              ? 'bg-white text-teal-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Salad className="w-4 h-4 text-teal-600" />
          <span>Nutrition & Protein Diet</span>
        </button>
        <button
          onClick={() => setActiveTab('yoga-exercise')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
            activeTab === 'yoga-exercise'
              ? 'bg-white text-teal-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sun className="w-4 h-4 text-amber-500" />
          <span>Surya Namaskar & Yoga</span>
        </button>
      </div>

      {activeTab === 'diet' ? (
        <div className="space-y-6">
          {/* Vegetarian & Non-Vegetarian Protein Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vegetarian Proteins */}
            <div className="p-5 rounded-3xl bg-white border border-emerald-200/80 shadow-xs">
              <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-emerald-100">
                <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-sm font-bold">
                  🌱
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {t.recoveryVegProtein}
                  </h3>
                  <div className="text-[11px] text-emerald-700 font-medium">
                    Plant-based tissue repair & cellular rebuilding
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {dietPlan.vegProteins.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-emerald-50/40 border border-emerald-100/80 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{item.name}</span>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                        {item.portion}
                      </span>
                    </div>
                    {item.translatedName && (
                      <div className="text-[11px] font-medium text-emerald-900 font-serif mt-0.5">
                        {item.translatedName}
                      </div>
                    )}
                    <p className="mt-1.5 text-slate-600 text-[11px] leading-relaxed">
                      {item.benefit}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Non-Vegetarian Proteins */}
            <div className="p-5 rounded-3xl bg-white border border-blue-200/80 shadow-xs">
              <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-blue-100">
                <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center text-sm font-bold">
                  🥚
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {t.recoveryNonVegProtein}
                  </h3>
                  <div className="text-[11px] text-blue-700 font-medium">
                    Bioavailable complete amino acids & heme iron
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {dietPlan.nonVegProteins.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-blue-50/40 border border-blue-100/80 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{item.name}</span>
                      <span className="text-[11px] font-semibold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md">
                        {item.portion}
                      </span>
                    </div>
                    {item.translatedName && (
                      <div className="text-[11px] font-medium text-blue-900 font-serif mt-0.5">
                        {item.translatedName}
                      </div>
                    )}
                    <p className="mt-1.5 text-slate-600 text-[11px] leading-relaxed">
                      {item.benefit}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Healing Vegetables and Superfood Seeds */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Healing Veggies */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Apple className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  {t.recoveryVeggies}
                </h3>
              </div>
              <div className="space-y-2.5">
                {dietPlan.healingVeggies.map((veg, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs"
                  >
                    <div className="font-bold text-slate-900 flex items-center justify-between">
                      <span>{veg.name}</span>
                      <span className="text-[11px] font-medium text-teal-700 font-serif">{veg.translatedName}</span>
                    </div>
                    <div className="mt-1 text-slate-600 text-[11px]">{veg.whyItHelps}</div>
                    <div className="mt-1 text-[11px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md inline-block">
                      Preparation: {veg.preparationTip}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Superfood Seeds & Foods to Avoid */}
            <div className="space-y-4">
              {/* Seeds */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <div className="flex items-center gap-2 mb-2 text-slate-900 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Beneficial Seeds & Natural Boosters</span>
                </div>
                <div className="space-y-2">
                  {dietPlan.superfoodsAndSeeds.map((seed, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-100 text-xs">
                      <div className="font-bold text-slate-900 flex justify-between">
                        <span>{seed.name}</span>
                        <span className="text-amber-800 font-semibold">{seed.dosage}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">{seed.benefit}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Foods to Avoid */}
              <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 shadow-xs">
                <div className="flex items-center gap-2 mb-2 text-rose-900 text-xs font-bold uppercase tracking-wider">
                  <Ban className="w-3.5 h-3.5 text-rose-600" />
                  <span>Foods to Strictly Limit / Avoid</span>
                </div>
                <div className="space-y-2">
                  {dietPlan.foodsToStrictlyAvoid.map((bad, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-white border border-rose-200/80 text-xs">
                      <span className="font-bold text-rose-950">{bad.name}</span>
                      <p className="text-[11px] text-slate-600 mt-0.5">{bad.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Yoga, Pranayama & Physical Exercise Tab */
        <div className="space-y-6">
          {/* Walking & Surya Namaskar Highlight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Walking Card */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
                  Daily Walking Target
                </span>
                <Footprints className="w-5 h-5 text-teal-600" />
              </div>
              <div className="text-3xl font-extrabold text-teal-900">
                {exercisePlan.dailyWalkingMinutes} Minutes
              </div>
              <div className="text-xs text-teal-700 font-medium mt-1">
                Gentle, brisk pace in fresh morning air
              </div>
              <p className="mt-3 text-xs text-slate-600 bg-white/80 p-2.5 rounded-xl border border-teal-100">
                {exercisePlan.walkingTip}
              </p>
            </div>

            {/* Surya Namaskar Card */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                  Surya Namaskar (Sun Salutations)
                </span>
                <Sun className="w-5 h-5 text-amber-600" />
              </div>
              <div className="text-3xl font-extrabold text-amber-900">
                {exercisePlan.suryaNamaskarRounds} Rounds
              </div>
              <div className="text-xs text-amber-700 font-medium mt-1">
                Breath-synchronized morning salutation
              </div>
              <p className="mt-3 text-xs text-slate-600 bg-white/80 p-2.5 rounded-xl border border-amber-100">
                {exercisePlan.suryaNamaskarGuidance}
              </p>
            </div>
          </div>

          {/* Pranayama Section */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Wind className="w-5 h-5 text-teal-600" />
              <h3 className="text-base font-bold text-slate-900">
                Condition-Specific Pranayama (Healing Breathing)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exercisePlan.pranayama.map((prana, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{prana.name}</span>
                      <div className="text-[11px] font-medium text-teal-700 font-serif">{prana.translatedName}</div>
                    </div>
                    <span className="font-bold text-teal-700 bg-teal-100 px-2.5 py-1 rounded-lg text-xs">
                      {prana.durationMinutes} mins
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 text-slate-700 leading-relaxed text-[11px]">
                    <span className="font-semibold text-slate-900">How to breathe: </span>
                    {prana.howToPerform}
                  </div>
                  <div className="text-[11px] text-teal-800 font-medium">
                    🎯 Healing focus: {prana.healingFocus}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
