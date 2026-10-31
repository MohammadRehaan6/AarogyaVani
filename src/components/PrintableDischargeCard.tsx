import React from 'react';
import { DischargeReportAnalysis, SupportedLanguage } from '../types';
import { Printer, X, ShieldCheck, HeartPulse, Clock, AlertTriangle, Calendar } from 'lucide-react';

interface PrintableDischargeCardProps {
  report: DischargeReportAnalysis;
  currentLanguage: SupportedLanguage;
  onClose: () => void;
}

export const PrintableDischargeCard: React.FC<PrintableDischargeCardProps> = ({
  report,
  currentLanguage,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Actions Bar (hidden when printing) */}
        <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <HeartPulse className="w-4 h-4 text-teal-600" />
            <span>AarogyaVani Official Discharge Slip & Recovery Guide</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 transition flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print Discharge Card</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Content Body */}
        <div className="p-8 space-y-6 text-slate-900 font-sans print:p-4">
          {/* Hospital / Clinic Header */}
          <div className="flex justify-between items-start border-b-2 border-teal-600 pb-4">
            <div>
              <h1 className="text-2xl font-black text-teal-900">
                AAROGYAVANI DISCHARGE CARD
              </h1>
              <div className="text-xs text-slate-500 mt-0.5">
                Multilingual Plain-Language Medical Report & Prescription Guide
              </div>
            </div>
            <div className="text-right text-xs">
              <div className="font-bold text-slate-900">ID: {report.reportId}</div>
              <div className="text-slate-500">Date: {report.scanTimestamp}</div>
              <div className="text-teal-700 font-semibold font-serif">{currentLanguage.name} ({currentLanguage.nativeName})</div>
            </div>
          </div>

          {/* Patient Info Row */}
          <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500">Patient Name:</span>
              <div className="font-bold text-slate-900">{report.patientName}</div>
            </div>
            <div>
              <span className="text-slate-500">Age / Gender:</span>
              <div className="font-bold text-slate-900">{report.age} Y / {report.gender}</div>
            </div>
            <div>
              <span className="text-slate-500">Diagnosis & Stage:</span>
              <div className="font-bold text-teal-800">{report.diagnosis.name} ({report.diagnosis.stageName.split(':')[0]})</div>
            </div>
          </div>

          {/* Summary */}
          <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200 text-xs">
            <div className="font-bold text-teal-950 uppercase mb-1">
              Patient Plain-Language Summary:
            </div>
            <p className="text-slate-800 leading-relaxed font-serif">
              {report.summaryInChosenLanguage || report.summaryInPlainLanguage}
            </p>
          </div>

          {/* Key Abnormal Metrics compared to Normal Healthy Baseline */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Key Metrics vs Healthy Human Normal Baseline
            </h3>
            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="p-2 border-b border-slate-200">Parameter</th>
                  <th className="p-2 border-b border-slate-200">Your Value</th>
                  <th className="p-2 border-b border-slate-200">Healthy Optimal</th>
                  <th className="p-2 border-b border-slate-200">Status</th>
                </tr>
              </thead>
              <tbody>
                {report.metrics.map((m) => (
                  <tr key={m.id} className="border-b border-slate-100 text-[11px]">
                    <td className="p-2 font-medium">{m.name}</td>
                    <td className="p-2 font-bold">{m.patientValue} {m.unit}</td>
                    <td className="p-2 text-slate-600">{m.healthyNormalMin} - {m.healthyNormalMax} {m.unit}</td>
                    <td className="p-2">
                      <span className="px-2 py-0.5 rounded font-bold uppercase text-[10px] bg-slate-100 text-slate-800">
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Prescribed Medicine Schedule */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Prescription Dosage & Timing Instructions
            </h3>
            <div className="space-y-2">
              {report.medicines.map((med) => (
                <div key={med.id} className="p-3 rounded-xl border border-slate-200 text-xs">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-slate-900">{med.medicineName} ({med.dosageStrength})</span>
                    <span className="text-teal-700">{med.mealRelationLabel.split(':')[0]}</span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1 font-serif">
                    Timing: {med.mealRelationTranslated || med.mealRelationLabel}
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    How to take: {med.administrationMode.title}
                  </div>
                  <div className="text-[10px] text-rose-700 mt-1 font-semibold">
                    Expiry / Seal: {med.shelfLifeAndExpiry.afterOpeningRule}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Warning Signs & Doctor Sign-Off */}
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-200 text-xs">
            <div>
              <div className="font-bold text-rose-900 mb-1 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>Emergency Warning Signs:</span>
              </div>
              <ul className="text-[10px] list-disc list-inside text-slate-600 space-y-0.5">
                {report.diagnosis.warningSigns.slice(0, 3).map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
              <div className="mt-2 text-teal-800 font-bold text-[11px]">
                Review in {report.diagnosis.followUpDays} days.
              </div>
            </div>

            <div className="text-right flex flex-col justify-end items-end">
              <div className="inline-flex items-center gap-1 text-emerald-800 font-bold text-xs bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified by Clinician</span>
              </div>
              <div className="text-xs font-bold text-slate-900">
                {report.clinicianVerification.verifiedByDoctorName || 'Dr. Ananya Sen, MD'}
              </div>
              <div className="text-[10px] text-slate-500">
                {report.clinicianVerification.verifiedAt || 'Certified Clinical Discharge'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
