import React from 'react';
import { DOCTOR_PROFILE } from '../../data/mockClinicalData';
import { 
  X, 
  ShieldCheck, 
  Award, 
  Building, 
  Stethoscope, 
  Calendar, 
  Mail, 
  Phone, 
  CheckCircle2 
} from 'lucide-react';

interface DoctorBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DoctorBadgeModal: React.FC<DoctorBadgeModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl space-y-4">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-slate-900 p-6 border-b border-slate-800 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-4">
            <img
              src={DOCTOR_PROFILE.avatarUrl}
              alt="Dr. Sarah Jenkins, MD"
              className="w-20 h-20 rounded-2xl object-cover border-2 border-teal-500/60 shadow-lg"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {DOCTOR_PROFILE.name}
                </h2>
                <ShieldCheck className="w-5 h-5 text-teal-400" />
              </div>
              <div className="text-xs text-teal-300 font-medium mt-0.5">
                {DOCTOR_PROFILE.title}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                {DOCTOR_PROFILE.department}
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 pt-2 space-y-4 text-xs text-slate-300">
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-sans">NPI Number</span>
              <span className="text-white font-bold">{DOCTOR_PROFILE.npiNumber}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-sans">Medical License</span>
              <span className="text-white font-bold">{DOCTOR_PROFILE.badgeNumber}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-sans">Clinic Location</span>
              <span className="text-white font-sans">{DOCTOR_PROFILE.officeSuite}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-sans">Clinical Experience</span>
              <span className="text-teal-400 font-bold">{DOCTOR_PROFILE.yearsExperience} Years</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white uppercase text-[11px] tracking-wider mb-2 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-teal-400" />
              <span>Medical Credentials & Fellowships</span>
            </h3>
            <ul className="space-y-1.5">
              {DOCTOR_PROFILE.credentials.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white uppercase text-[11px] tracking-wider mb-2 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-teal-400" />
              <span>Hospital Affiliation & Practice</span>
            </h3>
            <p className="text-slate-400 leading-relaxed">
              Active attending physician with full clinical admitting privileges at <strong className="text-white">{DOCTOR_PROFILE.hospitalAffiliation}</strong>. Directs outpatient internal medicine clinics and ambulatory resident training.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-teal-400" />
              <span>{DOCTOR_PROFILE.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-teal-400" />
              <span>{DOCTOR_PROFILE.contactEmail}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
