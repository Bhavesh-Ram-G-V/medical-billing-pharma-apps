export interface Vitals {
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  heartRate: number;
  respiratoryRate: number;
  temperature: number; // in Fahrenheit
  oxygenSaturation: number; // percentage
  bmi: number;
  weightLbs: number;
  heightInches: number;
  recordedAt: string;
}

export interface Allergy {
  allergen: string;
  reaction: string;
  severity: 'mild' | 'moderate' | 'severe';
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  route: string;
  startDate: string;
  prescribedBy: string;
  refillsRemaining: number;
  status: 'active' | 'discontinued' | 'completed';
}

export interface Diagnosis {
  icd10: string;
  description: string;
  type: 'chronic' | 'acute';
  onsetDate: string;
  status: 'active' | 'resolved';
}

export interface SOAPNote {
  subjective: string;
  objective: {
    general: string;
    heent: string;
    cardiovascular: string;
    pulmonary: string;
    abdominal: string;
    neurological: string;
    extremities: string;
  };
  assessment: string;
  plan: string;
  isSigned: boolean;
  signedAt?: string;
  signedBy?: string;
}

export interface LabResultItem {
  name: string;
  value: number | string;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'low' | 'high' | 'critical';
}

export interface LabPanel {
  id: string;
  patientId: string;
  panelName: string;
  collectedAt: string;
  orderedBy: string;
  status: 'pending' | 'completed' | 'reviewed';
  reviewedBy?: string;
  reviewedAt?: string;
  doctorNotes?: string;
  items: LabResultItem[];
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatar?: string;
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  mrn: string;
  time: string;
  date: string;
  type: 'Annual Wellness' | 'Follow-up' | 'Acute Care' | 'Chronic Care' | 'Telehealth Consult';
  room: string;
  status: 'scheduled' | 'checked-in' | 'in-exam-room' | 'with-doctor' | 'completed' | 'cancelled';
  reason: string;
  priority: 'routine' | 'urgent' | 'elevated';
  vitals?: Vitals;
}

export interface Patient {
  id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  dob: string;
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  avatar?: string;
  phone: string;
  email: string;
  address: string;
  insuranceProvider: string;
  policyNumber: string;
  allergies: Allergy[];
  activeDiagnoses: Diagnosis[];
  currentMedications: Medication[];
  vitalsHistory: Vitals[];
  lastVisit: string;
  primaryCarePhysician: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
}
