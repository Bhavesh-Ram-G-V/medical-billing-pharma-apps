import React from 'react';
import { DOCTOR_PROFILE } from '../../data/mockClinicalData';
import { Stethoscope, Calendar, FileText, Tablet, Activity, Video, Users, Building, ShieldCheck } from 'lucide-react';

export type ActiveTab = 'dashboard' | 'chart' | 'tablet' | 'labs' | 'telehealth' | 'patients' | 'portal';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenDoctorModal: () => void;
  patientQueueCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenDoctorModal,
  patientQueueCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-teal-600/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base font-bold tracking-tight text-white flex items-center gap-2">
              <span>Dr. Sarah Jenkins, MD</span>
              <span className="text-xs font-normal text-teal-400 bg-teal-950/80 border border-teal-700/40 px-2 py-0.5 rounded">
                General Medicine
              </span>
            </div>
            <div className="text-xs text-slate-400">
              Trinity Health Medical Center · Suite 304
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-950/60 p-1 rounded-lg border border-slate-800/80">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Clinic Schedule</span>
            {patientQueueCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-teal-900/90 text-teal-200 text-[10px] rounded-full font-mono">
                {patientQueueCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('chart')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'chart'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Active Chart (EMR)</span>
          </button>

          <button
            onClick={() => setActiveTab('tablet')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'tablet'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Doctor's Tablet</span>
            <span className="text-[10px] font-mono bg-teal-500/20 text-teal-300 px-1 rounded">
              Bedside
            </span>
          </button>

          <button
            onClick={() => setActiveTab('labs')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'labs'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Labs & ECG</span>
          </button>

          <button
            onClick={() => setActiveTab('telehealth')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'telehealth'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Telehealth</span>
          </button>

          <button
            onClick={() => setActiveTab('patients')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'patients'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Patient Records</span>
          </button>

          <button
            onClick={() => setActiveTab('portal')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'portal'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Clinic & Booking</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenDoctorModal}
            className="flex items-center gap-2 p-1.5 pr-3 rounded-lg border border-slate-700/80 bg-slate-800/70 hover:bg-slate-700/60 transition-colors text-left"
            title="View Physician Credentials"
          >
            <img
              src={DOCTOR_PROFILE.avatarUrl}
              alt="Dr. Sarah Jenkins, MD"
              className="w-8 h-8 rounded-full object-cover border border-teal-500/50"
              referrerPolicy="no-referrer"
            />
            <div className="hidden sm:block">
              <div className="text-xs font-semibold text-white leading-tight flex items-center gap-1">
                <span>Dr. Sarah Jenkins</span>
                <ShieldCheck className="w-3 h-3 text-teal-400" />
              </div>
              <div className="text-[10px] text-slate-400 leading-tight">Attending MD</div>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile navigation tab strip */}
      <div className="lg:hidden flex overflow-x-auto gap-2 px-4 py-2 border-t border-slate-800 bg-slate-950/80 text-xs">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-3 py-1 rounded whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-teal-600 text-white' : 'text-slate-400'}`}
        >
          Schedule ({patientQueueCount})
        </button>
        <button
          onClick={() => setActiveTab('chart')}
          className={`px-3 py-1 rounded whitespace-nowrap ${activeTab === 'chart' ? 'bg-teal-600 text-white' : 'text-slate-400'}`}
        >
          Active Chart
        </button>
        <button
          onClick={() => setActiveTab('tablet')}
          className={`px-3 py-1 rounded whitespace-nowrap ${activeTab === 'tablet' ? 'bg-teal-600 text-white' : 'text-slate-400'}`}
        >
          Tablet Mode
        </button>
        <button
          onClick={() => setActiveTab('labs')}
          className={`px-3 py-1 rounded whitespace-nowrap ${activeTab === 'labs' ? 'bg-teal-600 text-white' : 'text-slate-400'}`}
        >
          Labs & ECG
        </button>
        <button
          onClick={() => setActiveTab('telehealth')}
          className={`px-3 py-1 rounded whitespace-nowrap ${activeTab === 'telehealth' ? 'bg-teal-600 text-white' : 'text-slate-400'}`}
        >
          Telehealth
        </button>
        <button
          onClick={() => setActiveTab('patients')}
          className={`px-3 py-1 rounded whitespace-nowrap ${activeTab === 'patients' ? 'bg-teal-600 text-white' : 'text-slate-400'}`}
        >
          Patients
        </button>
        <button
          onClick={() => setActiveTab('portal')}
          className={`px-3 py-1 rounded whitespace-nowrap ${activeTab === 'portal' ? 'bg-teal-600 text-white' : 'text-slate-400'}`}
        >
          Booking Portal
        </button>
      </div>
    </header>
  );
};
