import React from 'react';
import { ActiveTab } from './Navbar';
import { Patient, Appointment } from '../../types/clinical';
import { 
  FileText, 
  Calendar, 
  Activity, 
  Video, 
  Users, 
  Tablet, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Stethoscope
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  activePatient: Patient;
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  appointments: Appointment[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  activePatient,
  patients,
  onSelectPatient,
  appointments
}) => {
  const currentAppt = appointments.find(a => a.patientId === activePatient.id);

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 text-slate-300 select-none">
      {/* Clinician Quick Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 uppercase tracking-wider mb-1">
          <Stethoscope className="w-3.5 h-3.5" />
          <span>Clinical Workstation</span>
        </div>
        <div className="text-sm font-bold text-white">Outpatient Suite 304</div>
        <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Station Active · Dr. S. Jenkins</span>
        </div>
      </div>

      {/* Main Nav Items */}
      <div className="p-3 border-b border-slate-800">
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-2 mb-1.5">
          Clinical Navigation
        </div>
        <nav className="space-y-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'bg-teal-600/20 text-teal-300 border border-teal-500/30'
                : 'hover:bg-slate-800/60 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-teal-400" />
              <span>Today's Clinic Queue</span>
            </div>
            <span className="px-1.5 py-0.5 text-[10px] rounded bg-slate-800 text-slate-400 font-mono">
              {appointments.filter(a => a.date === 'Today').length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('chart')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'chart'
                ? 'bg-teal-600/20 text-teal-300 border border-teal-500/30'
                : 'hover:bg-slate-800/60 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-blue-400" />
              <span>Active Patient EMR</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          </button>

          <button
            onClick={() => setActiveTab('tablet')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'tablet'
                ? 'bg-teal-600/20 text-teal-300 border border-teal-500/30'
                : 'hover:bg-slate-800/60 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Tablet className="w-4 h-4 text-emerald-400" />
              <span>Doctor's Tablet Mode</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">Handheld</span>
          </button>

          <button
            onClick={() => setActiveTab('labs')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'labs'
                ? 'bg-teal-600/20 text-teal-300 border border-teal-500/30'
                : 'hover:bg-slate-800/60 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Activity className="w-4 h-4 text-amber-400" />
              <span>Diagnostic Labs & ECG</span>
            </div>
            <span className="px-1.5 py-0.5 text-[10px] rounded bg-amber-500/20 text-amber-400 font-mono">
              1 Alert
            </span>
          </button>

          <button
            onClick={() => setActiveTab('telehealth')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'telehealth'
                ? 'bg-teal-600/20 text-teal-300 border border-teal-500/30'
                : 'hover:bg-slate-800/60 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Video className="w-4 h-4 text-purple-400" />
              <span>Telehealth Suite</span>
            </div>
            <span className="text-[10px] text-purple-400 font-mono">Ready</span>
          </button>

          <button
            onClick={() => setActiveTab('patients')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'patients'
                ? 'bg-teal-600/20 text-teal-300 border border-teal-500/30'
                : 'hover:bg-slate-800/60 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>Patient Directory</span>
            </div>
            <span className="px-1.5 py-0.5 text-[10px] rounded bg-slate-800 text-slate-400 font-mono">
              {patients.length}
            </span>
          </button>
        </nav>
      </div>

      {/* Active Patient In Focus */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/20">
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-2 mb-2 flex items-center justify-between">
          <span>Current In-Exam Patient</span>
          <span className="text-[10px] text-teal-400 font-mono">Exam Rm 3</span>
        </div>

        <div className="bg-slate-800/70 rounded-lg p-2.5 border border-slate-700/60">
          <div className="flex items-center gap-2.5">
            {activePatient.avatar ? (
              <img
                src={activePatient.avatar}
                alt={activePatient.firstName}
                className="w-9 h-9 rounded-full object-cover border border-slate-600"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white text-xs">
                {activePatient.firstName[0]}{activePatient.lastName[0]}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-white truncate">
                {activePatient.firstName} {activePatient.lastName}
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                {activePatient.age} yo {activePatient.gender} · {activePatient.mrn}
              </div>
            </div>
          </div>

          {currentAppt && (
            <div className="mt-2 pt-2 border-t border-slate-700/50 text-[11px] text-slate-300">
              <div className="flex items-center gap-1.5 text-teal-300 mb-1">
                <Clock className="w-3 h-3 shrink-0" />
                <span className="truncate">{currentAppt.type} ({currentAppt.time})</span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 italic">
                "{currentAppt.reason}"
              </p>
            </div>
          )}

          <div className="mt-2.5 flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('chart')}
              className="flex-1 py-1 px-2 rounded bg-teal-600 hover:bg-teal-500 text-white text-[11px] font-medium text-center transition-colors"
            >
              Open EMR
            </button>
            <button
              onClick={() => setActiveTab('tablet')}
              className="py-1 px-2 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px] font-medium transition-colors"
              title="Open on Doctor's Tablet"
            >
              Tablet
            </button>
          </div>
        </div>
      </div>

      {/* Patient Queue Quick-Switch */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-2 mb-2">
          Queue Quick-Select
        </div>
        <div className="space-y-1">
          {patients.map(p => {
            const isSelected = p.id === activePatient.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelectPatient(p)}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors text-xs ${
                  isSelected
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <div className="truncate">
                  <div className="font-medium truncate">{p.firstName} {p.lastName}</div>
                  <div className="text-[10px] text-slate-500">{p.mrn}</div>
                </div>
                {isSelected ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                ) : (
                  <span className="text-[10px] font-mono text-slate-500">{p.age}y</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer System Status */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-[11px] text-slate-400">
        <div className="flex items-center justify-between">
          <span>Trinity EHR v2026.4</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Encrypted
          </span>
        </div>
      </div>
    </aside>
  );
};
