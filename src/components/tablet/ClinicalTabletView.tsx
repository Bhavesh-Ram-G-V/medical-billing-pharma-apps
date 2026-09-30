import React, { useState, useRef, useEffect } from 'react';
import { Patient, SOAPNote } from '../../types/clinical';
import { DOCTOR_PROFILE } from '../../data/mockClinicalData';
import { 
  Wifi, 
  BatteryMedium, 
  PenTool, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  X, 
  Heart, 
  Activity, 
  ShieldCheck, 
  ChevronRight,
  Maximize2
} from 'lucide-react';

interface ClinicalTabletViewProps {
  patient: Patient;
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  soapNote: SOAPNote;
  onUpdateSoapNote: (newNote: SOAPNote) => void;
  onReturnToDesktop: () => void;
}

export const ClinicalTabletView: React.FC<ClinicalTabletViewProps> = ({
  patient,
  patients,
  onSelectPatient,
  soapNote,
  onUpdateSoapNote,
  onReturnToDesktop
}) => {
  const [stylusActive, setStylusActive] = useState(true);
  const [activeExamTab, setActiveExamTab] = useState<'exam' | 'vitals' | 'notes' | 'signature'>('exam');
  
  // Physical exam checklist states
  const [examStatus, setExamStatus] = useState<Record<string, { normal: boolean; notes: string }>>({
    Constitutional: { normal: true, notes: 'Alert, well nourished, comfortable.' },
    HEENT: { normal: true, notes: 'PERRLA, moist membranes, oropharynx clear.' },
    Cardiovascular: { normal: true, notes: 'Regular rate & rhythm. Normal S1/S2. No murmurs.' },
    Pulmonary: { normal: true, notes: 'Clear to auscultation bilaterally.' },
    Abdominal: { normal: true, notes: 'Soft, non-tender, active bowel sounds.' },
    Neurological: { normal: true, notes: 'CN II-XII grossly intact. Alert x4.' },
    Musculoskeletal: { normal: false, notes: 'Mild right knee crepitus without effusion.' }
  });

  // Digital Signature Canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawnSignature, setHasDrawnSignature] = useState(false);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawnSignature(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#0d9488'; // teal-600
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawnSignature(false);
  };

  const toggleOrganSystem = (system: string) => {
    setExamStatus(prev => ({
      ...prev,
      [system]: {
        ...prev[system],
        normal: !prev[system].normal
      }
    }));
  };

  const latestVitals = patient.vitalsHistory[0];

  return (
    <div className="py-6 px-3 sm:px-6 max-w-5xl mx-auto">
      {/* Tablet Exterior Bezel Container */}
      <div className="bg-slate-950 p-3 sm:p-5 rounded-[2.5rem] shadow-2xl border-4 border-slate-700/80 relative">
        {/* Tablet Top Edge Camera & Ambient Sensor */}
        <div className="flex items-center justify-center mb-2">
          <div className="w-16 h-2 rounded-full bg-slate-800 flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-900 border border-slate-700"></span>
            <span className="w-1 h-1 rounded-full bg-slate-900"></span>
          </div>
        </div>

        {/* Tablet Glass Screen Display */}
        <div className="bg-slate-900 rounded-[1.75rem] border border-slate-800 overflow-hidden shadow-inner flex flex-col min-h-[700px]">
          {/* Tablet Status Bar */}
          <div className="bg-slate-950 px-5 py-2 flex items-center justify-between text-[11px] text-slate-400 font-mono select-none border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">09:41 AM</span>
              <span className="text-slate-600">·</span>
              <span className="text-teal-400 font-sans font-medium">Trinity Clinical Tablet OS</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setStylusActive(!stylusActive)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] transition-colors ${
                  stylusActive
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <PenTool className="w-3 h-3" />
                <span>Stylus {stylusActive ? 'Paired' : 'Off'}</span>
              </button>
              <div className="flex items-center gap-1 text-slate-300">
                <Wifi className="w-3.5 h-3.5" />
                <span>5G Suite 304</span>
              </div>
              <div className="flex items-center gap-1 text-slate-300">
                <span>98%</span>
                <BatteryMedium className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Tablet Application Header */}
          <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={DOCTOR_PROFILE.avatarUrl}
                alt="Dr. Sarah Jenkins"
                className="w-10 h-10 rounded-full object-cover border border-teal-500/60"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Dr. Sarah Jenkins, MD</span>
                  <span className="text-[10px] text-teal-400 bg-teal-950 px-1.5 rounded">Rounding Tablet</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Bedside Examination Suite · Exam Room 3
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onReturnToDesktop}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                <Maximize2 className="w-3 h-3 text-teal-400" />
                <span>Return to Desktop EMR</span>
              </button>
            </div>
          </div>

          {/* Quick Bedside Patient Banner & Switcher */}
          <div className="bg-slate-950/60 p-3 px-5 border-b border-slate-800 flex items-center justify-between gap-3 overflow-x-auto">
            <div className="flex items-center gap-3 shrink-0">
              {patient.avatar ? (
                <img
                  src={patient.avatar}
                  alt={patient.firstName}
                  className="w-8 h-8 rounded-full object-cover border border-slate-600"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white">
                  {patient.firstName[0]}{patient.lastName[0]}
                </div>
              )}
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>{patient.firstName} {patient.lastName}</span>
                  <span className="text-[10px] font-mono text-teal-400">{patient.mrn}</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {patient.age}y {patient.gender} · Allergies: {patient.allergies.map(a => a.allergen).join(', ') || 'NKDA'}
                </div>
              </div>
            </div>

            {/* Switch patient quick pills */}
            <div className="flex items-center gap-1 shrink-0 text-xs">
              <span className="text-[10px] text-slate-500 mr-1 hidden md:inline">Other rooms:</span>
              {patients.map(p => (
                <button
                  key={p.id}
                  onClick={() => onSelectPatient(p)}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                    p.id === patient.id
                      ? 'bg-teal-600 text-white font-semibold'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white'
                  }`}
                >
                  {p.firstName}
                </button>
              ))}
            </div>
          </div>

          {/* Tablet Nav Tabs */}
          <div className="flex border-b border-slate-800 bg-slate-900/80 px-4 pt-2 gap-2 text-xs">
            <button
              onClick={() => setActiveExamTab('exam')}
              className={`pb-2.5 px-3 font-semibold border-b-2 transition-colors ${
                activeExamTab === 'exam'
                  ? 'border-teal-500 text-teal-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Bedside Exam Checklist
            </button>
            <button
              onClick={() => setActiveExamTab('vitals')}
              className={`pb-2.5 px-3 font-semibold border-b-2 transition-colors ${
                activeExamTab === 'vitals'
                  ? 'border-teal-500 text-teal-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Telemetry & Vitals
            </button>
            <button
              onClick={() => setActiveExamTab('notes')}
              className={`pb-2.5 px-3 font-semibold border-b-2 transition-colors ${
                activeExamTab === 'notes'
                  ? 'border-teal-500 text-teal-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Clinical Dictation / Notes
            </button>
            <button
              onClick={() => setActiveExamTab('signature')}
              className={`pb-2.5 px-3 font-semibold border-b-2 transition-colors ${
                activeExamTab === 'signature'
                  ? 'border-teal-500 text-teal-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Stylus Signature Pad
            </button>
          </div>

          {/* Tablet Body Content */}
          <div className="p-5 flex-1 overflow-y-auto space-y-4">
            {/* View 1: Bedside Exam Checklist */}
            {activeExamTab === 'exam' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-300">
                    Tap organ system to toggle Normal / Abnormal. Document bedside findings in real time.
                  </div>
                  <button
                    onClick={() => {
                      const allNormal: any = {};
                      Object.keys(examStatus).forEach(k => {
                        allNormal[k] = { normal: true, notes: 'Normal on physical exam.' };
                      });
                      setExamStatus(allNormal);
                    }}
                    className="text-[11px] text-teal-400 hover:underline"
                  >
                    Set All to Normal
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(examStatus).map(([system, data]) => (
                    <div
                      key={system}
                      className={`p-3.5 rounded-xl border transition-all ${
                        data.normal
                          ? 'bg-slate-900/90 border-slate-800'
                          : 'bg-amber-950/20 border-amber-800/60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-white text-xs">{system}</span>
                        <button
                          onClick={() => toggleOrganSystem(system)}
                          className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                            data.normal
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                              : 'bg-amber-950 text-amber-300 border border-amber-800/80'
                          }`}
                        >
                          {data.normal ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>Normal</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3 h-3 text-amber-400" />
                              <span>Abnormal</span>
                            </>
                          )}
                        </button>
                      </div>

                      <input
                        type="text"
                        value={data.notes}
                        onChange={(e) => {
                          const val = e.target.value;
                          setExamStatus(prev => ({
                            ...prev,
                            [system]: { ...prev[system], notes: val }
                          }));
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-slate-300 focus:outline-none focus:border-teal-500 font-sans"
                        placeholder="Add bedside clinical observations..."
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* View 2: Telemetry & Vitals */}
            {activeExamTab === 'vitals' && latestVitals && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-teal-400 uppercase tracking-wider">
                      <Activity className="w-4 h-4" />
                      <span>Bedside Bluetooth Triage Vitals Monitor</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Connected · Welch Allyn Connex
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <div className="text-[11px] text-slate-400">Non-Invasive BP</div>
                      <div className="text-xl font-bold text-white font-mono mt-1">
                        {latestVitals.bloodPressureSystolic}/{latestVitals.bloodPressureDiastolic}
                        <span className="text-xs text-slate-400 ml-1">mmHg</span>
                      </div>
                      <div className="text-[10px] text-emerald-400 mt-0.5">Normotensive Target</div>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <div className="text-[11px] text-slate-400">Heart Rate (Pulse)</div>
                      <div className="text-xl font-bold text-white font-mono mt-1">
                        {latestVitals.heartRate}
                        <span className="text-xs text-slate-400 ml-1">bpm</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Sinus rhythm</div>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <div className="text-[11px] text-slate-400">Pulse Oximetry (SpO2)</div>
                      <div className="text-xl font-bold text-white font-mono mt-1">
                        {latestVitals.oxygenSaturation}
                        <span className="text-xs text-slate-400 ml-1">%</span>
                      </div>
                      <div className="text-[10px] text-emerald-400 mt-0.5">Room air adequate</div>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <div className="text-[11px] text-slate-400">Oral Temp</div>
                      <div className="text-xl font-bold text-white font-mono mt-1">
                        {latestVitals.temperature}
                        <span className="text-xs text-slate-400 ml-1">°F</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Afebrile</div>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <div className="text-[11px] text-slate-400">Resp Rate</div>
                      <div className="text-xl font-bold text-white font-mono mt-1">
                        {latestVitals.respiratoryRate}
                        <span className="text-xs text-slate-400 ml-1">/min</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Unlabored</div>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <div className="text-[11px] text-slate-400">Weight & BMI</div>
                      <div className="text-xl font-bold text-white font-mono mt-1">
                        {latestVitals.weightLbs} <span className="text-xs text-slate-400 font-normal">lbs</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">BMI {latestVitals.bmi}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* View 3: Clinical Dictation / Quick Notes */}
            {activeExamTab === 'notes' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Bedside Stylus Scribble & Rapid Encounter Summary:</span>
                  <span className="text-teal-400">Stylus input recognized</span>
                </div>
                <textarea
                  rows={10}
                  value={soapNote.subjective}
                  onChange={(e) => onUpdateSoapNote({ ...soapNote, subjective: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-200 leading-relaxed font-sans focus:outline-none focus:border-teal-500 shadow-inner"
                  placeholder="Tap with stylus or keyboard to transcribe patient encounter conversation..."
                />
              </div>
            )}

            {/* View 4: Stylus Signature Pad */}
            {activeExamTab === 'signature' && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-white">Physician Electronic Attestation Pad</span>
                    <button
                      onClick={clearSignature}
                      className="text-[11px] text-slate-400 hover:text-red-400 flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Clear Canvas</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-3">
                    Use your stylus, mouse, or touch finger to draw Dr. Sarah Jenkins' signature below to attest this clinical encounter.
                  </p>

                  <div className="bg-slate-900 rounded-lg border border-slate-700 p-2 relative flex justify-center">
                    <canvas
                      ref={canvasRef}
                      width={480}
                      height={160}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      className="bg-slate-950 rounded border border-slate-800 cursor-crosshair touch-none"
                    />
                    {!hasDrawnSignature && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-600 text-xs italic">
                        ✍️ Sign with Stylus or Mouse here (Dr. Sarah Jenkins, MD)
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-[11px] text-slate-400 font-mono">
                      Sarah Jenkins, MD · License #MD-84921-GM
                    </div>
                    <button
                      onClick={() => {
                        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' on ' + new Date().toLocaleDateString();
                        onUpdateSoapNote({
                          ...soapNote,
                          isSigned: true,
                          signedAt: now,
                          signedBy: DOCTOR_PROFILE.name
                        });
                        alert('Encounter successfully signed with digital stylus on Dr. Jenkins\' Tablet!');
                      }}
                      className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Confirm & Lock Encounter</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tablet Bottom Bezel Bar */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400"></span>
              <span>Encrypted Session · HIPAA HITECH Certified</span>
            </div>
            <span className="font-mono text-[11px]">Trinity Cloud Sync: Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
