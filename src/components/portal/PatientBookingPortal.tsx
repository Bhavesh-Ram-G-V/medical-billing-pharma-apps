import React, { useState } from 'react';
import { DOCTOR_PROFILE } from '../../data/mockClinicalData';
import { Appointment, Patient } from '../../types/clinical';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Award, 
  ShieldCheck, 
  Stethoscope, 
  Video, 
  Building,
  Sparkles
} from 'lucide-react';

interface PatientBookingPortalProps {
  onBookAppointment: (appointment: Appointment, patientInfo?: { name: string; email: string; phone: string }) => void;
  onSwitchToDoctorView: () => void;
}

export const PatientBookingPortal: React.FC<PatientBookingPortalProps> = ({
  onBookAppointment,
  onSwitchToDoctorView
}) => {
  const [visitType, setVisitType] = useState<'In-Person' | 'Telehealth'>('In-Person');
  const [reasonCategory, setReasonCategory] = useState<'Annual Wellness' | 'Follow-up' | 'Acute Care' | 'Telehealth Consult'>('Annual Wellness');
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedTime, setSelectedTime] = useState('02:30 PM');
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientReason, setPatientReason] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName) return;

    const newAppt: Appointment = {
      id: `apt-${Date.now()}`,
      patientId: 'pt-001', // defaults to active or creates placeholder
      patientName: patientName,
      age: 45,
      gender: 'Female',
      mrn: `MRN-${Math.floor(10000 + Math.random() * 90000)}`,
      time: selectedTime,
      date: selectedDate,
      type: visitType === 'Telehealth' ? 'Telehealth Consult' : reasonCategory,
      room: visitType === 'Telehealth' ? 'Virtual Clinic 1' : 'Exam Room 2',
      status: 'scheduled',
      reason: patientReason || `${reasonCategory} with Dr. Sarah Jenkins`,
      priority: reasonCategory === 'Acute Care' ? 'urgent' : 'routine'
    };

    onBookAppointment(newAppt, { name: patientName, email: patientEmail, phone: patientPhone });
    setBookingConfirmed(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Top Banner Notice */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-teal-300">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>Patient-Facing Clinical Portal · Dr. Sarah Jenkins, MD Practice Profile</span>
        </div>
        <button
          onClick={onSwitchToDoctorView}
          className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow transition-colors"
        >
          Return to Clinician EHR
        </button>
      </div>

      {/* Hero: Doctor Profile & Clinic Banner */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        {/* Clinic Photo Banner */}
        <div className="h-56 sm:h-72 w-full relative">
          <img
            src={DOCTOR_PROFILE.clinicBannerUrl}
            alt="Trinity Health Clinic Pavilion"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

          <div className="absolute bottom-4 left-6 flex items-center gap-2 text-xs text-slate-300 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/60">
            <Building className="w-3.5 h-3.5 text-teal-400" />
            <span>Trinity Health Outpatient Pavilion B · Suite 304</span>
          </div>
        </div>

        {/* Doctor Details Bar */}
        <div className="p-6 sm:p-8 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 -mt-20 sm:-mt-24 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              <img
                src={DOCTOR_PROFILE.avatarUrl}
                alt="Dr. Sarah Jenkins, MD"
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border-4 border-slate-900 shadow-2xl ring-2 ring-teal-500/60"
                referrerPolicy="no-referrer"
              />
              <div className="mt-2 sm:mt-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    {DOCTOR_PROFILE.name}
                  </h1>
                  <span className="text-xs bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Board Certified</span>
                  </span>
                </div>
                <div className="text-sm text-slate-300 font-medium mt-1">
                  {DOCTOR_PROFILE.title} · {DOCTOR_PROFILE.specialty}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {DOCTOR_PROFILE.hospitalAffiliation} · {DOCTOR_PROFILE.yearsExperience} Years Clinical Experience
                </div>
              </div>
            </div>

            <div className="flex flex-col text-xs text-slate-400 gap-1 sm:text-right">
              <div>Phone: <strong className="text-white">{DOCTOR_PROFILE.phone}</strong></div>
              <div>Hours: <strong className="text-teal-300">{DOCTOR_PROFILE.clinicHours}</strong></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-800 text-xs">
            <div>
              <h2 className="font-semibold text-white uppercase text-[11px] tracking-wider mb-2 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-teal-400" />
                <span>Education & Board Certifications</span>
              </h2>
              <ul className="space-y-1.5 text-slate-300">
                {DOCTOR_PROFILE.credentials.map((c, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-teal-400 font-bold">✓</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-semibold text-white uppercase text-[11px] tracking-wider mb-2 flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-teal-400" />
                <span>Clinical Focus & Services</span>
              </h2>
              <ul className="space-y-1.5 text-slate-300">
                <li>• Comprehensive Annual Physicals & Preventive Health</li>
                <li>• Hypertension & Cardiovascular Risk Titration</li>
                <li>• Type 2 Diabetes Management & Continuous Monitoring</li>
                <li>• Acute Respiratory & General Medical Illness</li>
                <li>• Geriatric Wellness & Chronic Disease Co-management</li>
              </ul>
            </div>

            <div>
              <h2 className="font-semibold text-white uppercase text-[11px] tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>Accepted Insurance Providers</span>
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {['Blue Cross Blue Shield', 'Aetna PPO/HMO', 'UnitedHealthcare', 'Cigna', 'Medicare Part B', 'Humana', 'Oscar'].map((ins, i) => (
                  <span key={i} className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 text-[11px]">
                    {ins}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form Widget */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-400" />
            <span>Schedule an Appointment with Dr. Sarah Jenkins</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Choose your preferred appointment format, date, and time. Directly syncs with Dr. Jenkins' clinic calendar.
          </p>
        </div>

        {bookingConfirmed ? (
          <div className="p-6 rounded-xl bg-teal-950/40 border border-teal-700/60 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-teal-500/20 text-teal-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">
              Appointment Successfully Scheduled!
            </h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Your visit with <strong>Dr. Sarah Jenkins, MD</strong> has been confirmed for <strong>{selectedDate} at {selectedTime}</strong> ({visitType}).
              A confirmation packet and pre-visit health intake questionnaire have been routed to your email.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setBookingConfirmed(false)}
                className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow"
              >
                Book Another Appointment
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            {/* Visit Format */}
            <div>
              <label className="block text-slate-300 font-semibold mb-2">1. Choose Visit Format</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setVisitType('In-Person')}
                  className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                    visitType === 'In-Person'
                      ? 'bg-teal-600/20 border-teal-500 text-white shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Building className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-sm text-white">In-Person Clinic Visit</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Trinity Health Medical Center · Suite 304</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setVisitType('Telehealth')}
                  className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                    visitType === 'Telehealth'
                      ? 'bg-teal-600/20 border-teal-500 text-white shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Video className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-sm text-white">HD Virtual Telehealth</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Secure video call from phone or desktop</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Visit Reason Category */}
            <div>
              <label className="block text-slate-300 font-semibold mb-2">2. Reason for Visit</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'Annual Wellness', label: 'Annual Physical', desc: 'Comprehensive exam' },
                  { id: 'Follow-up', label: 'Follow-Up Visit', desc: 'Lab & medication check' },
                  { id: 'Acute Care', label: 'Acute Sick Visit', desc: 'Cough, fever, rash' },
                  { id: 'Telehealth Consult', label: 'Consultation', desc: 'Virtual second opinion' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setReasonCategory(item.id as any)}
                    className={`p-2.5 rounded-lg border text-left transition-colors ${
                      reasonCategory === item.id
                        ? 'bg-slate-800 border-teal-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-white">{item.label}</div>
                    <div className="text-[10px] text-slate-500">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Date & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">3. Select Appointment Date</label>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="Today">Today (Next Available)</option>
                  <option value="Tomorrow">Tomorrow</option>
                  <option value="In 2 Days">In 2 Days</option>
                  <option value="Next Monday">Next Monday</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">4. Select Time Slot</label>
                <div className="flex flex-wrap gap-2">
                  {['09:00 AM', '10:30 AM', '01:15 PM', '02:30 PM', '04:00 PM'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedTime(t)}
                      className={`px-3 py-2 rounded-lg font-mono text-xs transition-colors ${
                        selectedTime === t
                          ? 'bg-teal-600 text-white font-bold'
                          : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Patient Personal Details */}
            <div className="pt-2 border-t border-slate-800 space-y-3">
              <label className="block text-slate-300 font-semibold">5. Patient Identification & Contact</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Full Legal Name *"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    required
                    placeholder="Email Address *"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    required
                    placeholder="Mobile Phone Number *"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <textarea
                  rows={2}
                  placeholder="Briefly describe your symptoms or reason for visit..."
                  value={patientReason}
                  onChange={(e) => setPatientReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-[11px] text-slate-400">
                🔒 HIPAA Secure booking · Dr. Jenkins will be notified immediately
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg transition-colors"
              >
                Confirm & Reserve Appointment
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
