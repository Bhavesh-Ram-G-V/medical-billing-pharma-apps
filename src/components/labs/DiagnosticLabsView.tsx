import React, { useState } from 'react';
import { LabPanel, Patient } from '../../types/clinical';
import { DOCTOR_PROFILE } from '../../data/mockClinicalData';
import { 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  Heart, 
  FileCheck, 
  Download, 
  ShieldCheck, 
  Sparkles,
  Search
} from 'lucide-react';

interface DiagnosticLabsViewProps {
  labPanels: LabPanel[];
  patients: Patient[];
  onReviewPanel: (panelId: string, doctorNotes: string) => void;
}

export const DiagnosticLabsView: React.FC<DiagnosticLabsViewProps> = ({
  labPanels,
  patients,
  onReviewPanel
}) => {
  const [selectedPanelId, setSelectedPanelId] = useState<string>(labPanels[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'labs' | 'ecg'>('labs');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [ecgReviewed, setEcgReviewed] = useState(false);

  const selectedPanel = labPanels.find(p => p.id === selectedPanelId) || labPanels[0];
  const patient = patients.find(p => p.id === selectedPanel?.patientId) || patients[0];

  const handleSignOff = () => {
    if (!selectedPanel) return;
    onReviewPanel(selectedPanel.id, doctorNotes || 'Reviewed and approved by Dr. Sarah Jenkins, MD. Normal ranges noted.');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Diagnostic Title Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 rounded-xl border border-slate-800 p-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Diagnostic & Laboratory Workstation
            </h1>
            <span className="text-xs bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded font-mono">
              Suite 304 Analyzer
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Certified In-Clinic Diagnostics · Trinity Health Central Laboratories
          </p>
        </div>

        {/* View Switcher: Labs vs 12-Lead ECG */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('labs')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
              activeTab === 'labs'
                ? 'bg-teal-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Blood Chemistry & Panels
          </button>
          <button
            onClick={() => setActiveTab('ecg')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'ecg'
                ? 'bg-teal-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-red-400" />
            <span>12-Lead ECG Telemetry</span>
          </button>
        </div>
      </div>

      {activeTab === 'labs' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel Selector Column */}
          <div className="space-y-3">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Recent Panels ({labPanels.length})
            </h2>

            <div className="space-y-2">
              {labPanels.map((panel) => {
                const pt = patients.find(p => p.id === panel.patientId);
                const isSelected = panel.id === selectedPanel?.id;
                const hasAbnormal = panel.items.some(i => i.status !== 'normal');

                return (
                  <div
                    key={panel.id}
                    onClick={() => setSelectedPanelId(panel.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-800 border-teal-500/60 shadow-md'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="text-xs font-bold text-white">
                        {panel.panelName}
                      </div>
                      {hasAbnormal ? (
                        <span className="px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-800/80 text-amber-300 text-[10px] font-semibold">
                          Abnormal
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-[10px] font-semibold">
                          All Normal
                        </span>
                      )}
                    </div>

                    <div className="mt-2 text-xs text-slate-400">
                      Patient: <strong className="text-slate-200">{pt?.firstName} {pt?.lastName}</strong> ({pt?.mrn})
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Drawn: {panel.collectedAt} · By: {panel.orderedBy}
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">
                        {panel.items.length} analytes tested
                      </span>
                      {panel.status === 'reviewed' ? (
                        <span className="text-emerald-400 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Reviewed
                        </span>
                      ) : (
                        <span className="text-amber-400 font-medium flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Needs MD Sign-off
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Panel Detail View */}
          <div className="lg:col-span-2 space-y-4">
            {selectedPanel ? (
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-base font-bold text-white">
                      {selectedPanel.panelName}
                    </h2>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Specimen: Serum Blood · Patient: <strong className="text-white">{patient?.firstName} {patient?.lastName}</strong> ({patient?.mrn})
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 font-mono">Drawn: {selectedPanel.collectedAt}</span>
                    <div className="text-[11px] text-teal-400 mt-0.5">Trinity Diagnostics Core Lab</div>
                  </div>
                </div>

                {/* Analytes Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">Analyte / Test</th>
                        <th className="py-2.5 px-3">Observed Value</th>
                        <th className="py-2.5 px-3">Reference Range</th>
                        <th className="py-2.5 px-3">Visual Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {selectedPanel.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/40">
                          <td className="py-2.5 px-3 font-semibold text-white">
                            {item.name}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-200">
                            {item.value} <span className="text-slate-500 font-normal text-[11px]">{item.unit}</span>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-400 text-[11px]">
                            {item.referenceRange} {item.unit}
                          </td>
                          <td className="py-2.5 px-3">
                            {item.status === 'normal' ? (
                              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Normal</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                                <AlertCircle className="w-3.5 h-3.5" />
                                <span>{item.status.toUpperCase()}</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Doctor's Review & Addendum */}
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300">
                      Physician Clinical Interpretation & Addendum:
                    </label>
                    <span className="text-[11px] text-slate-500 font-mono">
                      Dr. Sarah Jenkins, MD
                    </span>
                  </div>

                  <textarea
                    rows={3}
                    placeholder="Enter physician clinical notes regarding lab values, treatment changes, or patient notification instructions..."
                    value={doctorNotes || selectedPanel.doctorNotes || ''}
                    onChange={(e) => setDoctorNotes(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                  />

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-slate-400">
                      {selectedPanel.status === 'reviewed' ? (
                        <span className="text-emerald-400 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Reviewed & signed by {selectedPanel.reviewedBy} ({selectedPanel.reviewedAt})</span>
                        </span>
                      ) : (
                        <span>Pending physician sign-off.</span>
                      )}
                    </span>

                    <button
                      onClick={handleSignOff}
                      className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-2 shadow transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Sign & Release to Patient Chart</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        /* View: 12-Lead Electrocardiogram (ECG) Telemetry */
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-400" />
                <h2 className="text-base font-bold text-white">
                  12-Lead Diagnostic Electrocardiogram (ECG)
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                GE MAC 5500 HD ECG Cart · In-Clinic Standard Lead II & Multi-Vector Recording
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="bg-slate-950 px-3 py-1.5 rounded border border-slate-800 text-slate-300">
                HR: <strong className="text-white">72 bpm</strong>
              </div>
              <div className="bg-slate-950 px-3 py-1.5 rounded border border-slate-800 text-slate-300">
                PR: <strong className="text-white">156 ms</strong>
              </div>
              <div className="bg-slate-950 px-3 py-1.5 rounded border border-slate-800 text-slate-300">
                QRS: <strong className="text-white">88 ms</strong>
              </div>
              <div className="bg-slate-950 px-3 py-1.5 rounded border border-slate-800 text-slate-300">
                QT/QTc: <strong className="text-white">402/420 ms</strong>
              </div>
            </div>
          </div>

          {/* High-Resolution Diagnostic Rhythm Strip Asset */}
          <div className="rounded-xl overflow-hidden border border-slate-700/80 bg-black relative shadow-2xl">
            <img
              src="/src/assets/images/medical_diagnostic_ecg_1790788464507.jpg"
              alt="12-Lead Diagnostic ECG Rhythm Strip"
              className="w-full h-80 object-cover opacity-95 hover:opacity-100 transition-opacity"
              referrerPolicy="no-referrer"
            />
            {/* Live Telemetry Overlay */}
            <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-sm border border-slate-700/60 px-3 py-1 rounded text-[11px] font-mono text-teal-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Lead II Sinus Rhythm · Filter 0.05-150 Hz</span>
            </div>

            <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-sm border border-slate-700/60 px-3 py-1 rounded text-[11px] font-mono text-slate-300">
              Cal: 25 mm/s, 10 mm/mV
            </div>
          </div>

          {/* Cardiologist / Attending Interpretation */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Diagnostic Interpretation: Normal Sinus Rhythm (NSR)</span>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                Patient: Eleanor Vance · 54y F
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              No evidence of ischemic ST elevation or depression. T waves upright across precordial leads V1–V6. PR interval within normal limits. Normal cardiac axis (approx +45°). No ventricular ectopy or atrial arrhythmias.
            </p>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <div className="text-[11px] text-slate-400">
                Attending Physician: <strong className="text-white">Dr. Sarah Jenkins, MD</strong>
              </div>

              {ecgReviewed ? (
                <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/80 px-3 py-1 rounded border border-emerald-800/80">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Approved & Signed by Dr. Jenkins</span>
                </div>
              ) : (
                <button
                  onClick={() => setEcgReviewed(true)}
                  className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Approve & Sign ECG Report</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
