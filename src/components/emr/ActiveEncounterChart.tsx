import React, { useState } from 'react';
import { Patient, SOAPNote, Medication, Diagnosis } from '../../types/clinical';
import { DOCTOR_PROFILE } from '../../data/mockClinicalData';
import { 
  FileText, 
  AlertTriangle, 
  Heart, 
  Activity, 
  Thermometer, 
  Wind, 
  Scale, 
  Pill, 
  CheckCircle2, 
  Plus, 
  Save, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  RotateCcw,
  Sparkles,
  ClipboardList
} from 'lucide-react';

interface ActiveEncounterChartProps {
  patient: Patient;
  soapNote: SOAPNote;
  onUpdateSoapNote: (newNote: SOAPNote) => void;
  onAddMedication: (patientId: string, medication: Medication) => void;
  onAddDiagnosis: (patientId: string, diagnosis: Diagnosis) => void;
}

export const ActiveEncounterChart: React.FC<ActiveEncounterChartProps> = ({
  patient,
  soapNote,
  onUpdateSoapNote,
  onAddMedication,
  onAddDiagnosis
}) => {
  const [activeTab, setActiveTab] = useState<'soap' | 'rx' | 'diagnoses' | 'vitals_history'>('soap');
  
  // Local state for editing SOAP note
  const [subjective, setSubjective] = useState(soapNote.subjective);
  const [objective, setObjective] = useState(soapNote.objective);
  const [assessment, setAssessment] = useState(soapNote.assessment);
  const [plan, setPlan] = useState(soapNote.plan);
  const [isSigned, setIsSigned] = useState(soapNote.isSigned);
  const [signedAt, setSignedAt] = useState(soapNote.signedAt || '');

  // Rx writer state
  const [showRxModal, setShowRxModal] = useState(false);
  const [rxDrugName, setRxDrugName] = useState('');
  const [rxDosage, setRxDosage] = useState('');
  const [rxFrequency, setRxFrequency] = useState('Once daily PO');
  const [rxRefills, setRxRefills] = useState(3);
  const [rxWarning, setRxWarning] = useState<string | null>(null);

  // New diagnosis state
  const [showDiagModal, setShowDiagModal] = useState(false);
  const [diagCode, setDiagCode] = useState('');
  const [diagDesc, setDiagDesc] = useState('');
  const [diagType, setDiagType] = useState<'chronic' | 'acute'>('chronic');

  const latestVitals = patient.vitalsHistory[0];

  const handleSaveDraft = () => {
    onUpdateSoapNote({
      ...soapNote,
      subjective,
      objective,
      assessment,
      plan,
      isSigned: false
    });
  };

  const handleSignEncounter = () => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' on ' + new Date().toLocaleDateString();
    setIsSigned(true);
    setSignedAt(now);
    onUpdateSoapNote({
      ...soapNote,
      subjective,
      objective,
      assessment,
      plan,
      isSigned: true,
      signedAt: now,
      signedBy: DOCTOR_PROFILE.name
    });
  };

  const handleRxDrugChange = (text: string) => {
    setRxDrugName(text);
    // Check patient allergies
    const lower = text.toLowerCase();
    const hasPenicillinAllergy = patient.allergies.some(a => a.allergen.toLowerCase().includes('penicillin'));
    const hasSulfaAllergy = patient.allergies.some(a => a.allergen.toLowerCase().includes('sulfa'));

    if (hasPenicillinAllergy && (lower.includes('pen') || lower.includes('amox') || lower.includes('amp') || lower.includes('augmentin'))) {
      setRxWarning('ALLERGY ALERT: Patient has documented severe allergy to Penicillin (Rash/Urticaria). Confirm clinical indication or select alternate class.');
    } else if (hasSulfaAllergy && (lower.includes('sulfa') || lower.includes('bactrim') || lower.includes('septra'))) {
      setRxWarning('ALLERGY ALERT: Patient has documented allergy to Sulfa drugs. Cross-reactivity risk.');
    } else {
      setRxWarning(null);
    }
  };

  const handlePrescribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rxDrugName || !rxDosage) return;

    const newMed: Medication = {
      id: `med-${Date.now()}`,
      name: rxDrugName,
      dosage: rxDosage,
      frequency: rxFrequency,
      route: 'Oral',
      startDate: new Date().toISOString().split('T')[0],
      prescribedBy: DOCTOR_PROFILE.name,
      refillsRemaining: rxRefills,
      status: 'active'
    };

    onAddMedication(patient.id, newMed);
    setRxDrugName('');
    setRxDosage('');
    setRxWarning(null);
    setShowRxModal(false);
  };

  const handleAddDiagnosisSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagCode || !diagDesc) return;

    const newDiag: Diagnosis = {
      icd10: diagCode.toUpperCase(),
      description: diagDesc,
      type: diagType,
      onsetDate: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    onAddDiagnosis(patient.id, newDiag);
    setDiagCode('');
    setDiagDesc('');
    setShowDiagModal(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Patient Header Banner */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {patient.avatar ? (
              <img
                src={patient.avatar}
                alt={patient.firstName}
                className="w-16 h-16 rounded-xl object-cover border-2 border-teal-500/40"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl font-bold text-teal-400">
                {patient.firstName[0]}{patient.lastName[0]}
              </div>
            )}

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-tight">
                  {patient.firstName} {patient.lastName}
                </h1>
                <span className="text-xs font-mono bg-slate-800 text-teal-300 px-2 py-0.5 rounded border border-slate-700">
                  {patient.mrn}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  DOB: {patient.dob} ({patient.age} y/o {patient.gender})
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-400">
                <span>Ins: <strong className="text-slate-200">{patient.insuranceProvider}</strong></span>
                <span>Policy: <strong className="text-slate-200 font-mono">{patient.policyNumber}</strong></span>
                <span>PCP: <strong className="text-teal-300">{patient.primaryCarePhysician}</strong></span>
              </div>
            </div>
          </div>

          {/* Allergies Box */}
          <div className="w-full lg:w-auto p-3 rounded-lg bg-red-950/30 border border-red-900/50">
            <div className="flex items-center gap-1.5 text-xs font-bold text-red-400 uppercase tracking-wider mb-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Documented Allergies ({patient.allergies.length})</span>
            </div>
            {patient.allergies.length === 0 ? (
              <span className="text-xs text-slate-400">No Known Drug Allergies (NKDA)</span>
            ) : (
              <div className="flex flex-wrap gap-2">
                {patient.allergies.map((all, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-900/50 border border-red-700/60 text-red-200 text-xs font-medium"
                  >
                    <span>{all.allergen}</span>
                    <span className="text-[10px] text-red-300">({all.reaction})</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Real-Time Clinical Vitals Ribbon */}
        {latestVitals && (
          <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
              <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-0.5">
                <Heart className="w-3 h-3 text-red-400" />
                <span>Blood Pressure</span>
              </div>
              <div className="text-base font-bold text-white font-mono tabular-nums">
                {latestVitals.bloodPressureSystolic}/{latestVitals.bloodPressureDiastolic}
                <span className="text-[10px] font-normal text-slate-400 ml-1">mmHg</span>
              </div>
            </div>

            <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
              <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-0.5">
                <Activity className="w-3 h-3 text-teal-400" />
                <span>Heart Rate</span>
              </div>
              <div className="text-base font-bold text-white font-mono tabular-nums">
                {latestVitals.heartRate}
                <span className="text-[10px] font-normal text-slate-400 ml-1">bpm</span>
              </div>
            </div>

            <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
              <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-0.5">
                <Wind className="w-3 h-3 text-blue-400" />
                <span>SpO2 (Pulse Ox)</span>
              </div>
              <div className="text-base font-bold text-white font-mono tabular-nums">
                {latestVitals.oxygenSaturation}
                <span className="text-[10px] font-normal text-slate-400 ml-1">%</span>
              </div>
            </div>

            <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
              <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-0.5">
                <Thermometer className="w-3 h-3 text-amber-400" />
                <span>Temperature</span>
              </div>
              <div className="text-base font-bold text-white font-mono tabular-nums">
                {latestVitals.temperature}
                <span className="text-[10px] font-normal text-slate-400 ml-1">°F</span>
              </div>
            </div>

            <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
              <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-0.5">
                <Scale className="w-3 h-3 text-purple-400" />
                <span>Body Mass Index</span>
              </div>
              <div className="text-base font-bold text-white font-mono tabular-nums">
                {latestVitals.bmi}
                <span className="text-[10px] font-normal text-slate-400 ml-1">BMI</span>
              </div>
            </div>

            <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
              <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-0.5">
                <Scale className="w-3 h-3 text-slate-400" />
                <span>Weight / Height</span>
              </div>
              <div className="text-base font-bold text-white font-mono tabular-nums">
                {latestVitals.weightLbs} <span className="text-[10px] font-normal text-slate-400">lbs</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('soap')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
              activeTab === 'soap'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>SOAP Encounter Note</span>
            {isSigned && <Lock className="w-3 h-3 text-emerald-300 ml-1" />}
          </button>

          <button
            onClick={() => setActiveTab('rx')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
              activeTab === 'rx'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Pill className="w-4 h-4" />
            <span>Medications & Rx ({patient.currentMedications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('diagnoses')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
              activeTab === 'diagnoses'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>ICD-10 Diagnoses ({patient.activeDiagnoses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('vitals_history')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
              activeTab === 'vitals_history'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Longitudinal Vitals</span>
          </button>
        </div>

        {activeTab === 'soap' && (
          <div className="flex items-center gap-2">
            {!isSigned ? (
              <>
                <button
                  onClick={handleSaveDraft}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Draft</span>
                </button>

                <button
                  onClick={handleSignEncounter}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sign & Lock Encounter</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Signed by Dr. Sarah Jenkins ({signedAt})</span>
                </span>
                <button
                  onClick={() => setIsSigned(false)}
                  className="text-xs text-slate-400 hover:text-white underline ml-2"
                >
                  Unlock to Add Addendum
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tab Content: SOAP Note */}
      {activeTab === 'soap' && (
        <div className="space-y-6">
          {/* Quick Auto-Template Prompts */}
          {!isSigned && (
            <div className="flex items-center gap-2 text-xs bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <Sparkles className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span className="text-slate-400 font-medium">Quick Clinical Templates:</span>
              <button
                onClick={() => {
                  setSubjective(`Patient presents for routine follow-up of hypertension and hyperlipidemia. Denies headache, chest pain, dizziness, or visual changes.`);
                }}
                className="text-teal-300 hover:underline"
              >
                + HTN Routine Follow-Up
              </button>
              <span className="text-slate-600">·</span>
              <button
                onClick={() => {
                  setObjective({
                    general: 'Alert, oriented x4, comfortable, no acute distress.',
                    heent: 'PERRLA, EOMI, oropharynx clear.',
                    cardiovascular: 'Regular rate and rhythm, normal S1/S2, no murmurs.',
                    pulmonary: 'Lungs clear to auscultation bilaterally, unlabored.',
                    abdominal: 'Soft, non-tender, non-distended.',
                    neurological: 'Grossly intact, normal strength and sensation.',
                    extremities: 'No cyanosis, clubbing, or edema.'
                  });
                }}
                className="text-teal-300 hover:underline"
              >
                + Normal Adult Physical Exam
              </button>
            </div>
          )}

          {/* S: Subjective */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-teal-500/20 text-teal-300 flex items-center justify-center font-mono text-xs">
                  S
                </span>
                <span>Subjective (Chief Complaint & History of Present Illness)</span>
              </h2>
            </div>
            <textarea
              rows={5}
              disabled={isSigned}
              value={subjective}
              onChange={(e) => setSubjective(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-teal-500 font-sans disabled:opacity-80"
              placeholder="Enter patient subjective report, onset, duration, severity, review of systems..."
            />
          </div>

          {/* O: Objective */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-blue-500/20 text-blue-300 flex items-center justify-center font-mono text-xs">
                  O
                </span>
                <span>Objective (Physical Exam by Organ Systems)</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Cardiovascular
                </label>
                <input
                  type="text"
                  disabled={isSigned}
                  value={objective.cardiovascular}
                  onChange={(e) => setObjective({ ...objective, cardiovascular: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Pulmonary / Lungs
                </label>
                <input
                  type="text"
                  disabled={isSigned}
                  value={objective.pulmonary}
                  onChange={(e) => setObjective({ ...objective, pulmonary: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Abdominal / Gastrointestinal
                </label>
                <input
                  type="text"
                  disabled={isSigned}
                  value={objective.abdominal}
                  onChange={(e) => setObjective({ ...objective, abdominal: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  HEENT (Head, Eyes, Ears, Nose, Throat)
                </label>
                <input
                  type="text"
                  disabled={isSigned}
                  value={objective.heent}
                  onChange={(e) => setObjective({ ...objective, heent: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Neurological & Cognitive
                </label>
                <input
                  type="text"
                  disabled={isSigned}
                  value={objective.neurological}
                  onChange={(e) => setObjective({ ...objective, neurological: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Extremities & Musculoskeletal
                </label>
                <input
                  type="text"
                  disabled={isSigned}
                  value={objective.extremities}
                  onChange={(e) => setObjective({ ...objective, extremities: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>
          </div>

          {/* A: Assessment */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded bg-purple-500/20 text-purple-300 flex items-center justify-center font-mono text-xs">
                A
              </span>
              <span>Assessment & Clinical Impression</span>
            </h2>
            <textarea
              rows={4}
              disabled={isSigned}
              value={assessment}
              onChange={(e) => setAssessment(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-teal-500 font-sans disabled:opacity-80"
              placeholder="Clinical synthesis, problem list, ICD-10 justification..."
            />
          </div>

          {/* P: Plan */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-mono text-xs">
                P
              </span>
              <span>Treatment Plan, Orders, & Patient Instructions</span>
            </h2>
            <textarea
              rows={4}
              disabled={isSigned}
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-teal-500 font-sans disabled:opacity-80"
              placeholder="Pharmacotherapy, laboratory orders, diagnostic imaging, follow-up interval..."
            />
          </div>

          {/* Attestation & Signature Box */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={DOCTOR_PROFILE.avatarUrl}
                alt="Dr. Sarah Jenkins"
                className="w-12 h-12 rounded-full object-cover border border-teal-500/50"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>{DOCTOR_PROFILE.name}</span>
                  <span className="text-[10px] bg-slate-800 text-teal-300 px-1.5 py-0.2 rounded font-mono">
                    NPI: {DOCTOR_PROFILE.npiNumber}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  {DOCTOR_PROFILE.title} · {DOCTOR_PROFILE.hospitalAffiliation}
                </div>
              </div>
            </div>

            {isSigned ? (
              <div className="text-right">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Encounter Digitally Locked</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1 font-mono">
                  Timestamp: {signedAt}
                </div>
              </div>
            ) : (
              <button
                onClick={handleSignEncounter}
                className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-2 shadow"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Apply Electronic Signature</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tab Content: Rx / Medications */}
      {activeTab === 'rx' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Active Outpatient Regimen</h2>
              <p className="text-xs text-slate-400">Current prescribed medications, refills, and dosing schedule.</p>
            </div>
            <button
              onClick={() => setShowRxModal(true)}
              className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Write e-Prescription (Rx)</span>
            </button>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Medication & Strength</th>
                  <th className="py-3 px-4">Sig / Instructions</th>
                  <th className="py-3 px-4">Route</th>
                  <th className="py-3 px-4">Prescribed By</th>
                  <th className="py-3 px-4">Refills</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {patient.currentMedications.map(med => (
                  <tr key={med.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-semibold text-white">
                      {med.name} <span className="font-mono text-teal-300 font-normal">{med.dosage}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {med.frequency}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {med.route}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {med.prescribedBy}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-200">
                      {med.refillsRemaining} remaining
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950 text-emerald-300 border border-emerald-800/50">
                        {med.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: ICD-10 Diagnoses */}
      {activeTab === 'diagnoses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Chronic & Acute Problem List</h2>
              <p className="text-xs text-slate-400">Active clinical diagnoses billed under ICD-10-CM coding.</p>
            </div>
            <button
              onClick={() => setShowDiagModal(true)}
              className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add ICD-10 Diagnosis</span>
            </button>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">ICD-10 Code</th>
                  <th className="py-3 px-4">Diagnostic Description</th>
                  <th className="py-3 px-4">Classification</th>
                  <th className="py-3 px-4">Onset Date</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {patient.activeDiagnoses.map((diag, i) => (
                  <tr key={i} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono font-bold text-teal-300">
                      {diag.icd10}
                    </td>
                    <td className="py-3 px-4 font-medium text-white">
                      {diag.description}
                    </td>
                    <td className="py-3 px-4 text-slate-400 capitalize">
                      {diag.type}
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono">
                      {diag.onsetDate}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-950 text-blue-300 border border-blue-800/50">
                        {diag.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: Vitals History */}
      {activeTab === 'vitals_history' && (
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4">
          <h2 className="text-sm font-bold text-white">Longitudinal Vitals Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Encounter Date</th>
                  <th className="py-3 px-4">Blood Pressure</th>
                  <th className="py-3 px-4">Pulse (HR)</th>
                  <th className="py-3 px-4">SpO2</th>
                  <th className="py-3 px-4">Temp</th>
                  <th className="py-3 px-4">Weight</th>
                  <th className="py-3 px-4">BMI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {patient.vitalsHistory.map((v, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 font-mono">
                    <td className="py-3 px-4 font-sans font-medium text-slate-200">
                      {v.recordedAt}
                    </td>
                    <td className="py-3 px-4 text-white font-bold">
                      {v.bloodPressureSystolic}/{v.bloodPressureDiastolic} mmHg
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {v.heartRate} bpm
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {v.oxygenSaturation}%
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {v.temperature}°F
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {v.weightLbs} lbs
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {v.bmi}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Write Rx Prescription Modal */}
      {showRxModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-teal-400" />
                <h3 className="text-base font-bold text-white">e-Prescribe (Rx) Routing</h3>
              </div>
              <button
                onClick={() => setShowRxModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {rxWarning && (
              <div className="p-3 bg-red-950/80 border border-red-800 rounded-lg text-red-200 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{rxWarning}</span>
              </div>
            )}

            <form onSubmit={handlePrescribeSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Medication Generic / Brand Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Lisinopril, Amlodipine, Amoxicillin..."
                  value={rxDrugName}
                  onChange={(e) => handleRxDrugChange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Dosage / Strength</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 10 mg, 250 mg"
                    value={rxDosage}
                    onChange={(e) => setRxDosage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Refills Authorized</label>
                  <input
                    type="number"
                    min={0}
                    max={12}
                    value={rxRefills}
                    onChange={(e) => setRxRefills(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Sig (Instructions for Patient)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Take 1 tablet by mouth daily in the morning"
                  value={rxFrequency}
                  onChange={(e) => setRxFrequency(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400">
                Authorized prescriber: <strong className="text-white">{DOCTOR_PROFILE.name}</strong> · DEA/NPI valid.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRxModal(false)}
                  className="px-3 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold shadow"
                >
                  Authorize & Transmit Rx
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Diagnosis Modal */}
      {showDiagModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Add ICD-10 Clinical Diagnosis</h3>
              <button onClick={() => setShowDiagModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddDiagnosisSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">ICD-10 Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. I10, E11.9, J45.20"
                  value={diagCode}
                  onChange={(e) => setDiagCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white uppercase font-mono focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Diagnostic Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Essential hypertension, Type 2 diabetes"
                  value={diagDesc}
                  onChange={(e) => setDiagDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Classification</label>
                <select
                  value={diagType}
                  onChange={(e) => setDiagType(e.target.value as 'chronic' | 'acute')}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="chronic">Chronic Condition</option>
                  <option value="acute">Acute Illness / Injury</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDiagModal(false)}
                  className="px-3 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold"
                >
                  Add to Problem List
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
