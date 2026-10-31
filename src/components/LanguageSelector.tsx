import React, { useState } from 'react';
import { SupportedLanguage, LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES, UI_TRANSLATIONS } from '../utils/languages';
import { Languages, Volume2, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

interface LanguageSelectorProps {
  currentLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  onProceed: () => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onSelectLanguage,
  onProceed,
}) => {
  const [playingCode, setPlayingCode] = useState<LanguageCode | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const t = UI_TRANSLATIONS[currentLanguage.code] || UI_TRANSLATIONS.en;

  const playVoiceSample = (lang: SupportedLanguage, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(lang.samplePhrase);
    utterance.lang = lang.speechCode;
    utterance.rate = 0.95;

    setPlayingCode(lang.code);
    utterance.onend = () => setPlayingCode(null);
    utterance.onerror = () => setPlayingCode(null);

    window.speechSynthesis.speak(utterance);
  };

  const filteredLanguages = SUPPORTED_LANGUAGES.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          Step 1: Patient Accessibility & Language Preference
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {t.step1Title}
        </h1>
        <p className="mt-2 text-base text-slate-600 max-w-2xl mx-auto">
          {t.step1Subtitle}
        </p>

        {/* Current Greeting Preview */}
        <div className="mt-5 inline-flex items-center gap-3 bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-blue-500/10 border border-teal-200 rounded-2xl px-5 py-3">
          <span className="text-2xl font-bold text-teal-900 font-serif">
            {currentLanguage.scriptGreeting}!
          </span>
          <span className="text-sm font-medium text-slate-700">
            {currentLanguage.samplePhrase}
          </span>
          <button
            onClick={(e) => playVoiceSample(currentLanguage, e)}
            className="p-2 rounded-xl bg-teal-600 text-white hover:bg-teal-700 transition shadow-sm hover:shadow"
            title="Listen to greeting"
            aria-label="Listen to greeting"
          >
            <Volume2 className={`w-4 h-4 ${playingCode === currentLanguage.code ? 'animate-pulse' : ''}`} />
          </button>
        </div>
      </div>

      {/* Search Filter */}
      <div className="mb-6 flex justify-between items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Search language / भाषा खोजें..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 shadow-sm"
          />
          <Languages className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
        <div className="text-xs text-slate-500 font-medium">
          {filteredLanguages.length} Languages Available
        </div>
      </div>

      {/* Language Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 mb-8">
        {filteredLanguages.map((lang) => {
          const isSelected = currentLanguage.code === lang.code;
          return (
            <div
              key={lang.code}
              onClick={() => onSelectLanguage(lang)}
              className={`relative group p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                isSelected
                  ? 'bg-teal-600 text-white border-teal-600 shadow-lg shadow-teal-600/20 scale-[1.02]'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200/80 hover:border-teal-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className={`text-xl font-bold block ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                    {lang.nativeName}
                  </span>
                  <span className={`text-xs block mt-0.5 ${isSelected ? 'text-teal-100' : 'text-slate-500 font-medium'}`}>
                    {lang.name}
                  </span>
                </div>
                {isSelected ? (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                ) : (
                  <button
                    onClick={(e) => playVoiceSample(lang, e)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition"
                    title={`Listen in ${lang.name}`}
                    aria-label={`Listen in ${lang.name}`}
                  >
                    <Volume2 className={`w-4 h-4 ${playingCode === lang.code ? 'text-teal-600 animate-pulse' : ''}`} />
                  </button>
                )}
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100/20">
                <div className={`text-xs font-serif ${isSelected ? 'text-teal-100' : 'text-teal-700 font-semibold'}`}>
                  {lang.scriptGreeting} ({lang.phoneticGreeting})
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Continue Action */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700 font-bold">
            {currentLanguage.code.toUpperCase()}
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Selected Language</div>
            <div className="text-base font-bold text-slate-900">
              {currentLanguage.nativeName} ({currentLanguage.name})
            </div>
          </div>
        </div>

        <button
          onClick={onProceed}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-md shadow-teal-600/25 transition"
        >
          <span>{t.continueBtn}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
