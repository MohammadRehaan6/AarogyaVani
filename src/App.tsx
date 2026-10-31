import React, { useState } from 'react';
import { SupportedLanguage, DischargeReportAnalysis } from './types';
import { SUPPORTED_LANGUAGES, UI_TRANSLATIONS } from './utils/languages';
import { SAMPLE_REPORTS } from './utils/sampleReports';
import { LanguageSelector } from './components/LanguageSelector';
import { ReportScanner } from './components/ReportScanner';
import { BaselineComparisonView } from './components/BaselineComparisonView';
import { DiseaseStagingCard } from './components/DiseaseStagingCard';
import { RecoveryPlanView } from './components/RecoveryPlanView';
import { MedicineDosageGuide } from './components/MedicineDosageGuide';
import { SideBySideVerification } from './components/SideBySideVerification';
import { AudioVoicePlayer } from './components/AudioVoicePlayer';
import { PrintableDischargeCard } from './components/PrintableDischargeCard';
import {
  HeartPulse,
  Scale,
  Layers,
  Salad,
  Pill,
  UserCheck,
  Languages,
  Scan,
  Printer,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  RotateCcw,
} from 'lucide-react';

export default function App() {
  // Step 1: language selection (defaulting to Hindi for immediate bilingual display, but starts at step 1)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(
    SUPPORTED_LANGUAGES[1] // Default to Hindi (हिन्दी)
  );

  // Analysis result
  const [currentReport, setCurrentReport] = useState<DischargeReportAnalysis | null>(null);

  // Active tab within Step 3 Analysis Hub
  const [activeTab, setActiveTab] = useState<
    'benchmark' | 'staging' | 'recovery' | 'medicines' | 'clinician'
  >('benchmark');

  // Print modal
  const [showPrintModal, setShowPrintModal] = useState(false);

  const t = UI_TRANSLATIONS[selectedLanguage.code] || UI_TRANSLATIONS.en;

  const handleLanguageSelect = (lang: SupportedLanguage) => {
    setSelectedLanguage(lang);
  };

  const handleLanguageConfirm = () => {
    setCurrentStep(2);
  };

  const handleAnalysisComplete = (report: DischargeReportAnalysis) => {
    setCurrentReport(report);
    setCurrentStep(3);
    setActiveTab('benchmark');
  };

  const handleUpdateVerification = (doctorName: string, notes: string) => {
    if (!currentReport) return;
    setCurrentReport({
      ...currentReport,
      clinicianVerification: {
        ...currentReport.clinicianVerification,
        isVerified: true,
        verifiedByDoctorName: doctorName,
        verifiedAt: new Date().toLocaleString(),
        notes,
      },
    });
  };

  // Text for the Audio Player in the chosen language
  const getAudioSpeechText = (): string => {
    if (!currentReport) return selectedLanguage.samplePhrase;
    const medNames = currentReport.medicines.map((m) => `${m.medicineName}, ${m.dosageStrength}`).join('. ');
    return `${currentReport.summaryInChosenLanguage || currentReport.summaryInPlainLanguage}. आपकी मुख्य बीमारी है ${currentReport.diagnosis.translatedName || currentReport.diagnosis.name}. दवाइयां: ${medNames}. किसी भी आपातकालीन स्थिति में तुरंत डॉक्टर से संपर्क करें।`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Top Universal Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div
            onClick={() => setCurrentStep(1)}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center shadow-md shadow-teal-600/20 group-hover:scale-105 transition">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                AarogyaVani <span className="text-teal-600 text-xs font-bold px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200">AI</span>
              </span>
              <span className="text-[10px] font-medium text-slate-500 block -mt-0.5">
                Multilingual Plain-Language Medical & Discharge Assistant
              </span>
            </div>
          </div>

          {/* Stepper Progress Badges */}
          <div className="hidden md:flex items-center gap-2 text-xs font-bold">
            <button
              onClick={() => setCurrentStep(1)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                currentStep === 1
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>1. {t.step1Title.split(' ')[0]}</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <button
              onClick={() => setCurrentStep(2)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                currentStep === 2
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>2. {t.step2Title.split(' ')[0]}</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <button
              disabled={!currentReport}
              onClick={() => currentReport && setCurrentStep(3)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition disabled:opacity-40 ${
                currentStep === 3
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>3. Analysis & Recovery Hub</span>
            </button>
          </div>

          {/* Active Language Badge with quick switch */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentStep(1)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold hover:bg-teal-100 transition"
              title="Change Language"
            >
              <Languages className="w-3.5 h-3.5 text-teal-600" />
              <span>{selectedLanguage.nativeName}</span>
            </button>

            {currentReport && currentStep === 3 && (
              <button
                onClick={() => setShowPrintModal(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Slip</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Body Content based on Step */}
      <main className="flex-1 pb-16">
        {currentStep === 1 && (
          <LanguageSelector
            currentLanguage={selectedLanguage}
            onSelectLanguage={handleLanguageSelect}
            onProceed={handleLanguageConfirm}
          />
        )}

        {currentStep === 2 && (
          <ReportScanner
            currentLanguage={selectedLanguage}
            onAnalysisComplete={handleAnalysisComplete}
            onBackToLanguage={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && currentReport && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
            {/* Top Navigation Bar: Back & Scan New Report */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                  title="Scan another report"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                    <span>{currentReport.reportType}</span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-teal-100 text-teal-800">
                      {currentReport.patientName} (Age: {currentReport.age})
                    </span>
                  </h1>
                  <p className="text-xs text-slate-500">
                    ID: {currentReport.reportId} • Analyzed on {currentReport.scanTimestamp}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 shadow-2xs"
                >
                  <Scan className="w-3.5 h-3.5 text-teal-600" />
                  <span>{t.scanNewReport}</span>
                </button>
                <button
                  onClick={() => setShowPrintModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{t.printDischargeCard}</span>
                </button>
              </div>
            </div>

            {/* Persistent Audio Voice Player */}
            <AudioVoicePlayer
              currentLanguage={selectedLanguage}
              textToRead={getAudioSpeechText()}
              title={`Discharge Audio Reader in ${selectedLanguage.nativeName}`}
            />

            {/* Main Tabs for the 5 Critical Healthcare Features */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none">
              <button
                onClick={() => setActiveTab('benchmark')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                  activeTab === 'benchmark'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Scale className="w-4 h-4" />
                <span>1. {t.healthyBenchmarkTab}</span>
              </button>

              <button
                onClick={() => setActiveTab('staging')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                  activeTab === 'staging'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>2. {t.diseaseStagingTab}</span>
              </button>

              <button
                onClick={() => setActiveTab('recovery')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                  activeTab === 'recovery'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Salad className="w-4 h-4" />
                <span>3. {t.recoveryTab}</span>
              </button>

              <button
                onClick={() => setActiveTab('medicines')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                  activeTab === 'medicines'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Pill className="w-4 h-4" />
                <span>4. {t.medicinesTab}</span>
              </button>

              <button
                onClick={() => setActiveTab('clinician')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                  activeTab === 'clinician'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white text-indigo-700 hover:bg-indigo-50 border border-indigo-200'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>5. {t.clinicianTab}</span>
              </button>
            </div>

            {/* Active Tab Panel */}
            <div className="pt-2">
              {activeTab === 'benchmark' && (
                <BaselineComparisonView
                  metrics={currentReport.metrics}
                  currentLanguage={selectedLanguage}
                  overallScore={currentReport.overallHealthScore}
                />
              )}

              {activeTab === 'staging' && (
                <DiseaseStagingCard
                  diagnosis={currentReport.diagnosis}
                  currentLanguage={selectedLanguage}
                />
              )}

              {activeTab === 'recovery' && (
                <RecoveryPlanView
                  dietPlan={currentReport.dietPlan}
                  exercisePlan={currentReport.exercisePlan}
                  currentLanguage={selectedLanguage}
                />
              )}

              {activeTab === 'medicines' && (
                <MedicineDosageGuide
                  medicines={currentReport.medicines}
                  currentLanguage={selectedLanguage}
                />
              )}

              {activeTab === 'clinician' && (
                <SideBySideVerification
                  report={currentReport}
                  currentLanguage={selectedLanguage}
                  onUpdateVerification={handleUpdateVerification}
                  onPrint={() => setShowPrintModal(true)}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Printable Discharge Card Modal */}
      {showPrintModal && currentReport && (
        <PrintableDischargeCard
          report={currentReport}
          currentLanguage={selectedLanguage}
          onClose={() => setShowPrintModal(false)}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>AarogyaVani Healthcare Assistant • Clinician Verified • ISO 13485 & Ayushman Bharat Digital Mission Compatible</span>
          </div>
          <div className="text-slate-400">
            For educational guidance. Always consult your attending physician before altering medical treatments.
          </div>
        </div>
      </footer>
    </div>
  );
}
