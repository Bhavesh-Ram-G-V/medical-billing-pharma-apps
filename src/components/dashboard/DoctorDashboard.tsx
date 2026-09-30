import React, { useState } from 'react';
import { Appointment, Patient } from '../../types/clinical';
import { DOCTOR_PROFILE } from '../../data/mockClinicalData';
import { 
  Clock, 
  Calendar, 
  FileText, 
  Tablet, 
  Video, 
  AlertCircle, 
  CheckCircle2, 
  UserCheck, 
  Plus, 
  Search,
  Activity,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface DoctorDashboardProps {
  appointments: Appointment[];
  patients: Patient[];
  onSelectPatientAndOpenChart: (patient: Patient) => void;
  onSelectPatientAndOpenTablet: (patient: Patient) => void;
  onStartTelehealth: (patient: Patient) => void;
  onUpdateAppointmentStatus: (appointmentId: string, newStatus: Appointment['status']) => void;
  onOpenNewApptModal: () => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  appointments,
  patients,
  onSelectPatientAndOpenChart,
  onSelectPatientAndOpenTablet,
  onStartTelehealth,
  onUpdateAppointmentStatus,
  onOpenNewApptModal
}) => {
  const [filter, setFilter] = useState<'all' | 'checked-in' | 'in-exam-room' | 'telehealth' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const todayAppointments = appointments.filter(a => a.date === 'Today');

  const filteredAppointments = todayAppointments.filter(appt => {
    const matchesSearch = 
      appt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appt.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appt.reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    if (filter === 'all') return true;
    if (filter === 'checked-in') return appt.status === 'checked-in';
    if (filter === 'in-exam-room') return appt.status === 'in-exam-room' || appt.status === 'with-doctor';
    if (filter === 'telehealth') return appt.type === 'Telehealth Consult';
    if (filter === 'completed') return appt.status === 'completed';
    return true;
  });

  const checkedInCount = todayAppointments.filter(a => a.status === 'checked-in').length;
  const inExamCount = todayAppointments.filter(a => a.status === 'in-exam-room' || a.status === 'with-doctor').length;
  const completedCount = todayAppointments.filter(a => a.status === 'completed').length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Clinician Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950/40 rounded-xl border border-slate-800 p-6 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={DOCTOR_PROFILE.avatarUrl}
              alt="Dr. Sarah Jenkins"
              className="w-16 h-16 rounded-full object-cover border-2 border-teal-500/60 shadow-md"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-tight">
                  Welcome back, Dr. Jenkins
                </h1>
                <span className="text-xs bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded font-medium">
                  On Duty · Suite 304
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                You have <strong className="text-white tabular-nums">{todayAppointments.length} patients</strong> scheduled for today. 
                <span className="text-teal-400 font-medium"> {inExamCount} ready in exam rooms</span>, and 
                <span className="text-amber-400 font-medium"> 1 urgent acute consult</span> waiting triage.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenNewApptModal}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Walk-In / Triage</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Scheduled Today</span>
            <Calendar className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            {todayAppointments.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Standard 8:00 AM – 5:00 PM session
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Waiting Room</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-400 font-mono tabular-nums">
            {checkedInCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Checked-in & vitals recorded
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>In Exam Rooms</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">
            {inExamCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Ready for physician encounter
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Encounters Finished</span>
            <CheckCircle2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            {completedCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Notes signed & charts filed
          </div>
        </div>
      </div>

      {/* Main Clinical Schedule Area */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
        {/* Table Controls */}
        <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800/80 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                filter === 'all' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Schedule ({todayAppointments.length})
            </button>
            <button
              onClick={() => setFilter('in-exam-room')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                filter === 'in-exam-room' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Exam Rooms ({inExamCount})
            </button>
            <button
              onClick={() => setFilter('checked-in')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                filter === 'checked-in' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Checked In ({checkedInCount})
            </button>
            <button
              onClick={() => setFilter('telehealth')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                filter === 'telehealth' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Telehealth
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                filter === 'completed' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Completed ({completedCount})
            </button>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search patient or MRN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        {/* Appointment Queue List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-3 px-4">Time & Room</th>
                <th className="py-3 px-4">Patient Demographics</th>
                <th className="py-3 px-4">Visit Type & Reason</th>
                <th className="py-3 px-4">Vitals Snapshot</th>
                <th className="py-3 px-4">Status & Progression</th>
                <th className="py-3 px-4 text-right">Clinical Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No appointments match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((appt) => {
                  const patient = patients.find(p => p.id === appt.patientId);

                  return (
                    <tr 
                      key={appt.id} 
                      className={`hover:bg-slate-800/40 transition-colors ${
                        appt.status === 'with-doctor' ? 'bg-teal-950/20' : ''
                      }`}
                    >
                      {/* Time & Room */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-white font-mono tabular-nums text-sm">
                          {appt.time}
                        </div>
                        <div className="text-[11px] text-teal-400 font-medium mt-0.5">
                          {appt.room}
                        </div>
                      </td>

                      {/* Patient Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {appt.patientAvatar ? (
                            <img
                              src={appt.patientAvatar}
                              alt={appt.patientName}
                              className="w-9 h-9 rounded-full object-cover border border-slate-700"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300">
                              {appt.patientName.split(' ').map(n => n[0]).join('')}
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-white text-sm">
                              {appt.patientName}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {appt.age} y/o {appt.gender} · <span className="font-mono text-slate-300">{appt.mrn}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Visit Reason */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="font-medium text-slate-200">{appt.type}</span>
                          {appt.priority === 'urgent' && (
                            <span className="text-[10px] bg-red-950/80 text-red-300 border border-red-700/50 px-1.5 py-0.2 rounded font-semibold">
                              Urgent
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2">
                          {appt.reason}
                        </p>
                      </td>

                      {/* Vitals Snapshot */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {appt.vitals ? (
                          <div className="space-y-0.5 font-mono text-[11px] text-slate-300">
                            <div>
                              BP: <span className="text-white font-semibold">{appt.vitals.bloodPressureSystolic}/{appt.vitals.bloodPressureDiastolic}</span> mmHg
                            </div>
                            <div>
                              HR: <span className="text-white">{appt.vitals.heartRate}</span> bpm · O2: <span className="text-white">{appt.vitals.oxygenSaturation}%</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-500 italic text-[11px]">Awaiting Triage</span>
                        )}
                      </td>

                      {/* Status Dropdown/Toggle */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          value={appt.status}
                          onChange={(e) => onUpdateAppointmentStatus(appt.id, e.target.value as Appointment['status'])}
                          className={`text-xs px-2.5 py-1 rounded-md border font-medium bg-slate-950 focus:outline-none ${
                            appt.status === 'with-doctor'
                              ? 'text-teal-300 border-teal-500/50 bg-teal-950/40'
                              : appt.status === 'in-exam-room'
                              ? 'text-emerald-300 border-emerald-500/50 bg-emerald-950/30'
                              : appt.status === 'checked-in'
                              ? 'text-blue-300 border-blue-500/50 bg-blue-950/30'
                              : appt.status === 'completed'
                              ? 'text-slate-400 border-slate-700 bg-slate-900'
                              : 'text-slate-400 border-slate-700'
                          }`}
                        >
                          <option value="scheduled">Scheduled</option>
                          <option value="checked-in">Checked In</option>
                          <option value="in-exam-room">In Exam Room</option>
                          <option value="with-doctor">With Doctor</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {appt.type === 'Telehealth Consult' ? (
                            <button
                              onClick={() => patient && onStartTelehealth(patient)}
                              className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white font-medium flex items-center gap-1 transition-colors"
                              title="Join Video Room"
                            >
                              <Video className="w-3.5 h-3.5" />
                              <span>Join Call</span>
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => patient && onSelectPatientAndOpenChart(patient)}
                                className="px-2.5 py-1 rounded bg-teal-600 hover:bg-teal-500 text-white font-medium flex items-center gap-1 transition-colors"
                                title="Open Full EMR Chart"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>Chart</span>
                              </button>

                              <button
                                onClick={() => patient && onSelectPatientAndOpenTablet(patient)}
                                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                                title="Open on Doctor's Rounding Tablet"
                              >
                                <Tablet className="w-3.5 h-3.5 text-teal-400" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Clinical Bulletins & Rapid Reference */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3">
            <AlertCircle className="w-4 h-4" />
            <span>Pending Clinical Actions</span>
          </div>
          <div className="space-y-3 text-xs">
            <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-900/40 text-amber-200">
              <div className="font-semibold text-white">Review Fasting Lipid Panel</div>
              <p className="text-[11px] text-amber-300/80 mt-0.5">
                Eleanor Vance (MRN-84920) · CMP and Lipid profile ready for physician sign-off.
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-red-950/20 border border-red-900/40 text-red-200">
              <div className="font-semibold text-white">Urgent Acute Triage: David Kim</div>
              <p className="text-[11px] text-red-300/80 mt-0.5">
                SpO2 96% with productive cough. Room 4 preparation requested by clinical nurse.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 uppercase tracking-wider mb-3">
            <Activity className="w-4 h-4" />
            <span>Today's Preventive Quality Care</span>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0"></span>
              <span><strong>Mammography reminder:</strong> Due for Eleanor Vance (Annual Wellness).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0"></span>
              <span><strong>A1c Retest:</strong> Marcus Chen scheduled for diabetic follow-up.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0"></span>
              <span><strong>Flu & COVID booster vaccines:</strong> Stock replenished in Suite 304 refrigerator.</span>
            </li>
          </ul>
        </div>

        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Dr. Jenkins' Clinic Portal</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Patients can book primary care appointments, request prescription renewals, and view clinic hours through your public portal page.
            </p>
          </div>
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Accepting new patients</span>
            <span className="text-teal-400 font-semibold flex items-center gap-1">
              Active <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
