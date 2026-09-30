import React, { useState } from 'react';
import { Patient } from '../../types/clinical';
import { 
  Users, 
  Search, 
  Plus, 
  FileText, 
  AlertTriangle, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  Heart, 
  ShieldCheck,
  X
} from 'lucide-react';

interface PatientDirectoryProps {
  patients: Patient[];
  onSelectPatientAndOpenChart: (patient: Patient) => void;
  onAddNewPatient: (newPatient: Patient) => void;
}

export const PatientDirectory: React.FC<PatientDirectoryProps> = ({
  patients,
  onSelectPatientAndOpenChart,
  onAddNewPatient
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(patients[0]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    gender: 'Female' as Patient['gender'],
    phone: '',
    email: '',
    address: '',
    insuranceProvider: 'Blue Cross Blue Shield',
    policyNumber: ''
  });

  const filteredPatients = patients.filter(pt => {
    const matchesSearch =
      `${pt.firstName} ${pt.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pt.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pt.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedCondition === 'all') return true;
    return pt.activeDiagnoses.some(d => d.description.toLowerCase().includes(selectedCondition.toLowerCase()));
  });

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.dob) return;

    const birthYear = new Date(formData.dob).getFullYear();
    const age = new Date().getFullYear() - birthYear;

    const newPt: Patient = {
      id: `pt-${Date.now()}`,
      mrn: `MRN-${Math.floor(10000 + Math.random() * 90000)}`,
      firstName: formData.firstName,
      lastName: formData.lastName,
      dob: formData.dob,
      age: Math.max(1, age),
      gender: formData.gender,
      phone: formData.phone || '(555) 000-0000',
      email: formData.email || `${formData.firstName.toLowerCase()}@example.com`,
      address: formData.address || 'Springfield, IL',
      insuranceProvider: formData.insuranceProvider,
      policyNumber: formData.policyNumber || `POL-${Math.floor(100000 + Math.random() * 900000)}`,
      allergies: [],
      activeDiagnoses: [],
      currentMedications: [],
      vitalsHistory: [
        {
          bloodPressureSystolic: 120,
          bloodPressureDiastolic: 80,
          heartRate: 72,
          respiratoryRate: 16,
          temperature: 98.6,
          oxygenSaturation: 99,
          bmi: 23.5,
          weightLbs: 150,
          heightInches: 67,
          recordedAt: 'Today'
        }
      ],
      lastVisit: 'New Registration',
      primaryCarePhysician: 'Dr. Sarah Jenkins, MD',
      emergencyContact: {
        name: 'Emergency Contact',
        relation: 'Family',
        phone: '(555) 000-0001'
      }
    };

    onAddNewPatient(newPt);
    setSelectedPatient(newPt);
    setShowAddModal(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 rounded-xl border border-slate-800 p-5">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-400" />
            <span>Patient Registry & Longitudinal Records</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Total active cohort: <strong className="text-white tabular-nums">{patients.length} patients</strong> under Dr. Sarah Jenkins' primary care panel.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-400 font-medium">Chronic Registry Filter:</span>
          {['all', 'hypertension', 'diabetes', 'asthma', 'osteoarthritis'].map((cond) => (
            <button
              key={cond}
              onClick={() => setSelectedCondition(cond)}
              className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-colors ${
                selectedCondition === cond
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cond}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search patient, MRN, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* Main Grid: Patient List & Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Patient List */}
        <div className="space-y-2">
          {filteredPatients.map((pt) => {
            const isSelected = pt.id === selectedPatient?.id;
            return (
              <div
                key={pt.id}
                onClick={() => setSelectedPatient(pt)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-800 border-teal-500/60 shadow-md'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  {pt.avatar ? (
                    <img
                      src={pt.avatar}
                      alt={pt.firstName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-700 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white text-xs shrink-0">
                      {pt.firstName[0]}{pt.lastName[0]}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-white text-sm truncate">
                        {pt.firstName} {pt.lastName}
                      </div>
                      <span className="text-[10px] font-mono text-teal-400 bg-teal-950/60 px-1.5 py-0.5 rounded border border-teal-800/40">
                        {pt.mrn}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 mt-0.5">
                      {pt.age} y/o {pt.gender} · DOB: {pt.dob}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1">
                      {pt.activeDiagnoses.map((diag, i) => (
                        <span key={i} className="text-[10px] bg-slate-950 text-slate-300 px-1.5 py-0.5 rounded border border-slate-800">
                          {diag.icd10}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Selected Patient In-Depth Record */}
        <div className="lg:col-span-2">
          {selectedPatient ? (
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div className="flex items-center gap-4">
                  {selectedPatient.avatar ? (
                    <img
                      src={selectedPatient.avatar}
                      alt={selectedPatient.firstName}
                      className="w-16 h-16 rounded-xl object-cover border-2 border-teal-500/50"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-white text-xl">
                      {selectedPatient.firstName[0]}{selectedPatient.lastName[0]}
                    </div>
                  )}

                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {selectedPatient.firstName} {selectedPatient.lastName}
                    </h2>
                    <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                      <span>MRN: <strong className="text-teal-400 font-mono">{selectedPatient.mrn}</strong></span>
                      <span>DOB: <strong>{selectedPatient.dob}</strong> ({selectedPatient.age} yo)</span>
                      <span>Gender: <strong>{selectedPatient.gender}</strong></span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onSelectPatientAndOpenChart(selectedPatient)}
                  className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-2 shadow"
                >
                  <FileText className="w-4 h-4" />
                  <span>Open Active EMR Chart</span>
                </button>
              </div>

              {/* Demographics & Insurance info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                    Contact & Address
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <Phone className="w-3.5 h-3.5 text-teal-400" />
                    <span>{selectedPatient.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <Mail className="w-3.5 h-3.5 text-teal-400" />
                    <span>{selectedPatient.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <MapPin className="w-3.5 h-3.5 text-teal-400" />
                    <span>{selectedPatient.address}</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                    Insurance & Coverage
                  </div>
                  <div className="text-slate-200 font-medium">
                    {selectedPatient.insuranceProvider}
                  </div>
                  <div className="text-slate-400 font-mono">
                    Policy: {selectedPatient.policyNumber}
                  </div>
                  <div className="text-teal-300 text-[11px]">
                    Verified Active Coverage · In-Network
                  </div>
                </div>
              </div>

              {/* Allergies & Current Regimen */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-red-400 uppercase tracking-wider mb-2">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Allergies ({selectedPatient.allergies.length})</span>
                  </div>
                  {selectedPatient.allergies.length === 0 ? (
                    <div className="text-xs text-slate-400">No known drug allergies.</div>
                  ) : (
                    <div className="space-y-1.5">
                      {selectedPatient.allergies.map((a, i) => (
                        <div key={i} className="text-xs text-slate-300">
                          <strong className="text-red-300">{a.allergen}:</strong> {a.reaction} ({a.severity})
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-2">
                    Active Medications ({selectedPatient.currentMedications.length})
                  </div>
                  {selectedPatient.currentMedications.length === 0 ? (
                    <div className="text-xs text-slate-400">No active prescriptions.</div>
                  ) : (
                    <div className="space-y-1.5">
                      {selectedPatient.currentMedications.map(m => (
                        <div key={m.id} className="text-xs text-slate-300">
                          <strong className="text-white">{m.name} {m.dosage}</strong> — {m.frequency}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Chronic Diagnoses */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Active Problem List
                </div>
                <div className="space-y-2">
                  {selectedPatient.activeDiagnoses.map((d, i) => (
                    <div key={i} className="flex items-center justify-between text-xs p-2 rounded bg-slate-900 border border-slate-800">
                      <div>
                        <span className="font-mono text-teal-400 font-bold mr-2">{d.icd10}</span>
                        <span className="text-slate-200">{d.description}</span>
                      </div>
                      <span className="text-slate-400 font-mono text-[11px]">Onset {d.onsetDate}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Add New Patient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Register New Patient</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreatePatient} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as Patient['gender'] })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="(555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="patient@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Insurance Provider</label>
                <input
                  type="text"
                  placeholder="e.g. Blue Cross Blue Shield, Aetna, Medicare"
                  value={formData.insuranceProvider}
                  onChange={(e) => setFormData({ ...formData, insuranceProvider: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-teal-600 hover:bg-teal-500 text-white font-bold"
                >
                  Complete Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
