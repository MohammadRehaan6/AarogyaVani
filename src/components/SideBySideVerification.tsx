import React, { useState } from 'react';
import { DischargeReportAnalysis, SupportedLanguage } from '../types';
import { UI_TRANSLATIONS } from '../utils/languages';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserCheck,
  Printer,
  Calendar,
  Clock,
  Sparkles,
  Stethoscope,
} from 'lucide-react';

interface SideBySideVerificationProps {
  report: DischargeReportAnalysis;
  currentLanguage: SupportedLanguage;
  onUpdateVerification: (verifiedBy: string, notes: string) => void;
  onPrint: () => void;
}

export const SideBySideVerification: React.FC<SideBySideVerificationProps> = ({
  report,
  currentLanguage,
  onUpdateVerification,
  onPrint,
}) => {
  const [doctorName, setDoctorName] = useState(
    report.clinicianVerification.verifiedByDoctorName || 'Dr. Ananya Sen, MD'
  );
  const [notes, setNotes] = useState(
    report.clinicianVerification.notes ||
      'Prescription dosage, timing intervals, and red-flag signs verified for patient clarity.'
  );
  const [checklist, setChecklist] = useState({
    medicineNames: true,
    timingAccurate: true,
    warningSignsClear: true,
    followUpDate: true,
  });

  const t = UI_TRANSLATIONS[currentLanguage.code] || UI_TRANSLATIONS.en;
  const isVerified = report.clinicianVerification.isVerified;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateVerification(doctorName, notes);
  };

  return (
    <div className="space-y-6">
      {/* Clinician Portal Header */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Stethoscope className="w-3.5 h-3.5" />
            Clinician Review & Translation Verification Portal
          </div>
          <h2 className="text-2xl font-black">
            Bilingual Side-by-Side Discharge Audit
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-xl">
            Verify that clinical discharge orders are faithfully translated into {currentLanguage.name} without altering chemical names, dosage strengths, timing, or safety warnings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onPrint}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Discharge Slip</span>
          </button>
          <div
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
              isVerified
                ? 'bg-emerald-500/20 border border-emerald-400 text-emerald-300'
                : 'bg-amber-500/20 border border-amber-400 text-amber-300'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isVerified ? 'Certified & Verified' : 'Pending Verification'}</span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Review Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Original Clinician Orders in English */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <FileText className="w-4 h-4 text-slate-600" />
              <span>Original Clinical Orders (English)</span>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
              Hospital EMR Source
            </span>
          </div>

          {/* Condition & Stage */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
            <div className="font-bold text-slate-900">{report.diagnosis.name}</div>
            <div className="text-teal-700 font-semibold mt-0.5">{report.diagnosis.stageName}</div>
            <p className="mt-1.5 text-slate-600">{report.diagnosis.whatItMeansForYou}</p>
          </div>

          {/* Prescribed Medicines in English */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Prescribed Drug Regimen
            </div>
            {report.medicines.map((med) => (
              <div key={med.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{med.medicineName}</span>
                  <span className="text-teal-700">{med.dosageStrength}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Timing: {med.mealRelationLabel}
                </div>
                <div className="text-[11px] text-slate-600 mt-1">
                  Admin: {med.administrationMode.title}
                </div>
              </div>
            ))}
          </div>

          {/* Warning Signs & Follow Up */}
          <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200 text-xs">
            <div className="font-bold text-rose-950 mb-1">Emergency Warning Signs:</div>
            <ul className="list-disc list-inside space-y-0.5 text-slate-700 text-[11px]">
              {report.diagnosis.warningSigns.map((w, idx) => (
                <li key={idx}>{w}</li>
              ))}
            </ul>
            <div className="mt-2 text-teal-800 font-bold text-[11px]">
              Follow-up scheduled: In {report.diagnosis.followUpDays} days.
            </div>
          </div>
        </div>

        {/* Right: Plain-Language Translated Instructions in Patient's Language */}
        <div className="p-6 rounded-3xl bg-teal-50/40 border border-teal-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-teal-100">
            <div className="flex items-center gap-2 text-teal-950 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Translated Patient Instructions ({currentLanguage.name})</span>
            </div>
            <span className="text-[11px] font-semibold text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-full font-serif">
              {currentLanguage.nativeName}
            </span>
          </div>

          {/* Condition & Stage Translated */}
          <div className="p-3.5 rounded-xl bg-white border border-teal-200 text-xs">
            <div className="font-bold text-slate-900 font-serif text-sm">
              {report.diagnosis.translatedName || report.diagnosis.name}
            </div>
            <div className="text-teal-700 font-semibold mt-0.5">
              {report.diagnosis.stageName}
            </div>
            <p className="mt-1.5 text-slate-700 font-serif leading-relaxed">
              {report.diagnosis.translatedWhatItMeans || report.diagnosis.whatItMeansForYou}
            </p>
          </div>

          {/* Prescribed Medicines in Patient's Language */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-teal-900 uppercase tracking-wider">
              దవా మరియు మోతాదు వివరాలు (Preserved Names)
            </div>
            {report.medicines.map((med) => (
              <div key={med.id} className="p-3 rounded-xl bg-white border border-teal-200 text-xs">
                <div className="flex justify-between font-bold text-slate-900">
                  <span className="text-teal-900">{med.medicineName}</span>
                  <span className="text-teal-700 bg-teal-50 px-2 py-0.5 rounded">{med.dosageStrength}</span>
                </div>
                <div className="text-[11px] text-teal-950 font-serif font-medium mt-1">
                  సమయం / Time: {med.mealRelationTranslated || med.mealRelationLabel}
                </div>
                <div className="text-[11px] text-slate-600 font-serif mt-0.5">
                  తీసుకునే విధానం: {med.administrationMode.translatedTitle || med.administrationMode.title}
                </div>
              </div>
            ))}
          </div>

          {/* Warning Signs Translated */}
          <div className="p-3.5 rounded-xl bg-white border border-rose-200 text-xs">
            <div className="font-bold text-rose-950 mb-1">హెచ్చరిక సంకేతాలు (Emergency Red Flags):</div>
            <div className="text-[11px] text-slate-700 font-serif leading-relaxed">
              తీవ్రమైన తలతిరగడం, గుండె దడ, లేదా ఊపిరి ఆడకపోతే వెంటనే ఆసుపత్రికి వెళ్లండి.
            </div>
            <div className="mt-2 text-teal-900 font-bold text-[11px] font-serif">
              తిరిగి సంప్రదించాల్సిన సమయం: {report.diagnosis.followUpDays} రోజులలో.
            </div>
          </div>
        </div>
      </div>

      {/* Clinician Sign-Off & Verification Form */}
      <form onSubmit={handleVerify} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-teal-600" />
          <h3 className="text-base font-bold text-slate-900">
            Clinician Certification & Safety Sign-off
          </h3>
        </div>

        {/* Audit Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={checklist.medicineNames}
              onChange={(e) => setChecklist({ ...checklist, medicineNames: e.target.checked })}
              className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
            />
            <span className="font-medium text-slate-700">
              Drug names, dosages, and generic molecules preserved accurately
            </span>
          </label>

          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={checklist.timingAccurate}
              onChange={(e) => setChecklist({ ...checklist, timingAccurate: e.target.checked })}
              className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
            />
            <span className="font-medium text-slate-700">
              Meal timings (empty stomach vs post-meal) verified
            </span>
          </label>

          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={checklist.warningSignsClear}
              onChange={(e) => setChecklist({ ...checklist, warningSignsClear: e.target.checked })}
              className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
            />
            <span className="font-medium text-slate-700">
              Emergency red-flag signs translated with high cultural fidelity
            </span>
          </label>

          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={checklist.followUpDate}
              onChange={(e) => setChecklist({ ...checklist, followUpDate: e.target.checked })}
              className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
            />
            <span className="font-medium text-slate-700">
              Follow-up review window ({report.diagnosis.followUpDays} days) confirmed
            </span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Verifying Clinician Name & Designation
            </label>
            <input
              type="text"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="e.g. Dr. Ananya Sen, MD"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Clinical Review Notes & Verification Stamp
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Verification notes..."
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Sign & Certify Discharge Translation</span>
          </button>
        </div>
      </form>
    </div>
  );
};
