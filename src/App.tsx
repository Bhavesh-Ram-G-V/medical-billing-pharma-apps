/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar, ActiveTab } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DoctorDashboard } from './components/dashboard/DoctorDashboard';
import { PrescriptionBillingCreator } from './components/billing/PrescriptionBillingCreator';
import { ActiveEncounterChart } from './components/emr/ActiveEncounterChart';
import { ClinicalTabletView } from './components/tablet/ClinicalTabletView';
import { DiagnosticLabsView } from './components/labs/DiagnosticLabsView';
import { TelehealthView } from './components/telehealth/TelehealthView';
import { PatientDirectory } from './components/patients/PatientDirectory';
import { PatientBookingPortal } from './components/portal/PatientBookingPortal';
import { DoctorBadgeModal } from './components/common/DoctorBadgeModal';
import { 
  INITIAL_PATIENTS, 
  INITIAL_APPOINTMENTS, 
  INITIAL_SOAP_NOTE, 
  INITIAL_LAB_PANELS,
  DOCTOR_PROFILE
} from './data/mockClinicalData';
import { Patient, Appointment, SOAPNote, LabPanel, Medication, Diagnosis } from './types/clinical';
import { Plus, X, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [activePatient, setActivePatient] = useState<Patient>(INITIAL_PATIENTS[0]);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [soapNote, setSoapNote] = useState<SOAPNote>(INITIAL_SOAP_NOTE);
  const [labPanels, setLabPanels] = useState<LabPanel[]>(INITIAL_LAB_PANELS);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [isNewApptModalOpen, setIsNewApptModalOpen] = useState(false);
  const [billingToast, setBillingToast] = useState<string | null>(null);

  // New triage appointment form
  const [triagePatientId, setTriagePatientId] = useState(INITIAL_PATIENTS[0].id);
  const [triageReason, setTriageReason] = useState('');
  const [triagePriority, setTriagePriority] = useState<Appointment['priority']>('routine');
  const [triageTime, setTriageTime] = useState('11:45 AM');
  const [triageRoom, setTriageRoom] = useState('Exam Room 2');

  const handleSelectPatient = (patient: Patient) => {
    setActivePatient(patient);
  };

  const handleSelectPatientAndOpenChart = (patient: Patient) => {
    setActivePatient(patient);
    setActiveTab('chart');
  };

  const handleSelectPatientAndOpenTablet = (patient: Patient) => {
    setActivePatient(patient);
    setActiveTab('tablet');
  };

  const handleStartTelehealth = (patient: Patient) => {
    setActivePatient(patient);
    setActiveTab('telehealth');
  };

  const handleUpdateAppointmentStatus = (appointmentId: string, newStatus: Appointment['status']) => {
    setAppointments(prev =>
      prev.map(a => (a.id === appointmentId ? { ...a, status: newStatus } : a))
    );
  };

  const handleUpdateSoapNote = (newNote: SOAPNote) => {
    setSoapNote(newNote);
  };

  const handleAddMedication = (patientId: string, medication: Medication) => {
    setPatients(prev =>
      prev.map(p => {
        if (p.id === patientId) {
          return {
            ...p,
            currentMedications: [medication, ...p.currentMedications]
          };
        }
        return p;
      })
    );
    if (activePatient.id === patientId) {
      setActivePatient(prev => ({
        ...prev,
        currentMedications: [medication, ...prev.currentMedications]
      }));
    }
  };

  const handleAddDiagnosis = (patientId: string, diagnosis: Diagnosis) => {
    setPatients(prev =>
      prev.map(p => {
        if (p.id === patientId) {
          return {
            ...p,
            activeDiagnoses: [diagnosis, ...p.activeDiagnoses]
          };
        }
        return p;
      })
    );
    if (activePatient.id === patientId) {
      setActivePatient(prev => ({
        ...prev,
        activeDiagnoses: [diagnosis, ...prev.activeDiagnoses]
      }));
    }
  };

  const handleReviewPanel = (panelId: string, doctorNotes: string) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLabPanels(prev =>
      prev.map(p =>
        p.id === panelId
          ? {
              ...p,
              status: 'reviewed',
              reviewedBy: DOCTOR_PROFILE.name,
              reviewedAt: now,
              doctorNotes
            }
          : p
      )
    );
  };

  const handleAddNewPatient = (newPatient: Patient) => {
    setPatients(prev => [newPatient, ...prev]);
    setActivePatient(newPatient);
  };

  const handleBookAppointment = (newAppt: Appointment) => {
    setAppointments(prev => [newAppt, ...prev]);
  };

  const handleSendBillToPortal = (billingSummary: any) => {
    setBillingToast(`Statement #${billingSummary.billId} ($${billingSummary.finalOutOfPocket.toFixed(2)}) dispatched to ${billingSummary.patient.firstName}'s Portal.`);
    setTimeout(() => {
      setBillingToast(null);
    }, 6000);
  };

  const handleCreateTriageAppt = (e: React.FormEvent) => {
    e.preventDefault();
    const pt = patients.find(p => p.id === triagePatientId) || patients[0];
    const newAppt: Appointment = {
      id: `apt-${Date.now()}`,
      patientId: pt.id,
      patientName: `${pt.firstName} ${pt.lastName}`,
      patientAvatar: pt.avatar,
      age: pt.age,
      gender: pt.gender,
      mrn: pt.mrn,
      time: triageTime,
      date: 'Today',
      type: triagePriority === 'urgent' ? 'Acute Care' : 'Follow-up',
      room: triageRoom,
      status: 'checked-in',
      reason: triageReason || 'Same-day clinical triage',
      priority: triagePriority,
      vitals: pt.vitalsHistory[0]
    };

    setAppointments(prev => [newAppt, ...prev]);
    setIsNewApptModalOpen(false);
    setTriageReason('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Universal 3-Zone Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenDoctorModal={() => setIsDoctorModalOpen(true)}
        patientQueueCount={appointments.filter(a => a.date === 'Today' && a.status !== 'completed').length}
      />

      {/* Real-time Dispatch Toast */}
      {billingToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-teal-900 border-2 border-teal-400 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-semibold animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-teal-300" />
          <span>{billingToast}</span>
          <button onClick={() => setBillingToast(null)} className="ml-2 text-teal-200 hover:text-white">✕</button>
        </div>
      )}

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden">
        {/* Persistent Doctor's Workstation Sidebar on Desktop (hidden in public portal and full tablet focus) */}
        {activeTab !== 'portal' && activeTab !== 'tablet' && (
          <div className="hidden lg:block">
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              activePatient={activePatient}
              patients={patients}
              onSelectPatient={handleSelectPatient}
              appointments={appointments}
            />
          </div>
        )}

        {/* Viewport Content Router */}
        <main className="flex-1 overflow-y-auto bg-slate-950">
          {activeTab === 'dashboard' && (
            <DoctorDashboard
              appointments={appointments}
              patients={patients}
              activePatient={activePatient}
              onSelectPatient={handleSelectPatient}
              onSelectPatientAndOpenChart={handleSelectPatientAndOpenChart}
              onSelectPatientAndOpenTablet={handleSelectPatientAndOpenTablet}
              onStartTelehealth={handleStartTelehealth}
              onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
              onOpenNewApptModal={() => setIsNewApptModalOpen(true)}
            />
          )}

          {activeTab === 'billing' && (
            <div className="p-4 sm:p-6 w-full space-y-6">
              <PrescriptionBillingCreator
                patients={patients}
                activePatient={activePatient}
                onSelectPatient={handleSelectPatient}
                onSendBillToPortal={handleSendBillToPortal}
              />
            </div>
          )}

          {activeTab === 'chart' && (
            <ActiveEncounterChart
              patient={activePatient}
              soapNote={soapNote}
              onUpdateSoapNote={handleUpdateSoapNote}
              onAddMedication={handleAddMedication}
              onAddDiagnosis={handleAddDiagnosis}
            />
          )}

          {activeTab === 'tablet' && (
            <ClinicalTabletView
              patient={activePatient}
              patients={patients}
              onSelectPatient={handleSelectPatient}
              soapNote={soapNote}
              onUpdateSoapNote={handleUpdateSoapNote}
              onReturnToDesktop={() => setActiveTab('chart')}
            />
          )}

          {activeTab === 'labs' && (
            <DiagnosticLabsView
              labPanels={labPanels}
              patients={patients}
              onReviewPanel={handleReviewPanel}
            />
          )}

          {activeTab === 'telehealth' && (
            <TelehealthView
              patient={activePatient}
              onEndCall={() => setActiveTab('dashboard')}
              onOpenChart={() => setActiveTab('chart')}
            />
          )}

          {activeTab === 'patients' && (
            <PatientDirectory
              patients={patients}
              onSelectPatientAndOpenChart={handleSelectPatientAndOpenChart}
              onAddNewPatient={handleAddNewPatient}
            />
          )}

          {activeTab === 'portal' && (
            <PatientBookingPortal
              onBookAppointment={handleBookAppointment}
              onSwitchToDoctorView={() => setActiveTab('dashboard')}
            />
          )}
        </main>
      </div>

      {/* Doctor Credentials Dossier Modal */}
      <DoctorBadgeModal
        isOpen={isDoctorModalOpen}
        onClose={() => setIsDoctorModalOpen(false)}
      />

      {/* Add Triage / Walk-In Appointment Modal */}
      {isNewApptModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Add Walk-In / Triage Patient</h3>
              <button
                onClick={() => setIsNewApptModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTriageAppt} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Select Patient</label>
                <select
                  value={triagePatientId}
                  onChange={(e) => setTriagePatientId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-teal-500"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName} ({p.mrn})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Encounter Time</label>
                  <input
                    type="text"
                    value={triageTime}
                    onChange={(e) => setTriageTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Assigned Exam Room</label>
                  <select
                    value={triageRoom}
                    onChange={(e) => setTriageRoom(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="Exam Room 1">Exam Room 1</option>
                    <option value="Exam Room 2">Exam Room 2</option>
                    <option value="Exam Room 3">Exam Room 3</option>
                    <option value="Exam Room 4">Exam Room 4</option>
                    <option value="Triage Bay A">Triage Bay A</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Clinical Priority</label>
                <select
                  value={triagePriority}
                  onChange={(e) => setTriagePriority(e.target.value as Appointment['priority'])}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="routine">Routine</option>
                  <option value="elevated">Elevated Priority</option>
                  <option value="urgent">Urgent / Acute Care</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Presenting Chief Complaint</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Acute onset severe headache, sore throat, elevated blood pressure..."
                  value={triageReason}
                  onChange={(e) => setTriageReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewApptModalOpen(false)}
                  className="px-3 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold"
                >
                  Queue for Dr. Jenkins
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

