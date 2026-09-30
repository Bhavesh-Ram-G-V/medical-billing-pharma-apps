import { Patient, Appointment, LabPanel, SOAPNote } from '../types/clinical';

export const DOCTOR_PROFILE = {
  name: 'Dr. Sarah Jenkins, MD',
  title: 'Attending Physician & Clinical Director',
  specialty: 'Internal & General Medicine',
  badgeNumber: 'MD-84921-GM',
  npiNumber: '1942083921',
  hospitalAffiliation: 'Trinity Health Medical Center',
  department: 'Division of Primary Care & Outpatient Medicine',
  officeSuite: 'Suite 304, Pavilion B',
  credentials: [
    'M.D. — Johns Hopkins University School of Medicine',
    'Residency — Massachusetts General Hospital, Internal Medicine',
    'Board Certified in Internal Medicine (ABIM)',
    'Fellow of the American College of Physicians (FACP)'
  ],
  avatarUrl: '/src/assets/images/doctor_sarah_jenkins_1790788432480.jpg',
  clinicBannerUrl: '/src/assets/images/clinic_reception_interior_1790788443152.jpg',
  yearsExperience: 12,
  languages: ['English', 'Spanish', 'Hindi'],
  contactEmail: 'sarah.jenkins@trinityhealth.org',
  phone: '(555) 782-4401',
  clinicHours: 'Mon - Fri: 8:00 AM – 5:00 PM'
};

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pt-001',
    mrn: 'MRN-84920',
    firstName: 'Eleanor',
    lastName: 'Vance',
    dob: '1972-04-12',
    age: 54,
    gender: 'Female',
    avatar: '/src/assets/images/patient_eleanor_avatar_1790788453372.jpg',
    phone: '(555) 392-8172',
    email: 'eleanor.vance@icloud.com',
    address: '412 Oakridge Lane, Springfield, IL',
    insuranceProvider: 'Blue Cross Blue Shield PPO',
    policyNumber: 'BCBS-9948271-01',
    allergies: [
      { allergen: 'Penicillin', reaction: 'Maculopapular Rash & Urticaria', severity: 'severe' },
      { allergen: 'Sulfa Drugs', reaction: 'Mild Nausea & Photosensitivity', severity: 'mild' }
    ],
    activeDiagnoses: [
      { icd10: 'I10', description: 'Essential (primary) hypertension', type: 'chronic', onsetDate: '2021-03-15', status: 'active' },
      { icd10: 'E78.5', description: 'Hyperlipidemia, unspecified', type: 'chronic', onsetDate: '2022-08-10', status: 'active' },
      { icd10: 'M17.11', description: 'Unilateral primary osteoarthritis, right knee', type: 'chronic', onsetDate: '2024-01-20', status: 'active' }
    ],
    currentMedications: [
      { id: 'med-1', name: 'Lisinopril', dosage: '20 mg', frequency: 'Once daily PO', route: 'Oral', startDate: '2021-03-20', prescribedBy: 'Dr. Sarah Jenkins, MD', refillsRemaining: 3, status: 'active' },
      { id: 'med-2', name: 'Atorvastatin', dosage: '20 mg', frequency: 'Once daily at bedtime PO', route: 'Oral', startDate: '2022-08-15', prescribedBy: 'Dr. Sarah Jenkins, MD', refillsRemaining: 4, status: 'active' },
      { id: 'med-3', name: 'Meloxicam', dosage: '7.5 mg', frequency: 'Daily PRN with food', route: 'Oral', startDate: '2024-01-25', prescribedBy: 'Dr. Sarah Jenkins, MD', refillsRemaining: 1, status: 'active' }
    ],
    vitalsHistory: [
      {
        bloodPressureSystolic: 126,
        bloodPressureDiastolic: 82,
        heartRate: 72,
        respiratoryRate: 16,
        temperature: 98.4,
        oxygenSaturation: 99,
        bmi: 24.2,
        weightLbs: 148,
        heightInches: 66,
        recordedAt: 'Today, 08:45 AM'
      },
      {
        bloodPressureSystolic: 134,
        bloodPressureDiastolic: 86,
        heartRate: 76,
        respiratoryRate: 16,
        temperature: 98.6,
        oxygenSaturation: 98,
        bmi: 24.5,
        weightLbs: 150,
        heightInches: 66,
        recordedAt: '3 months ago'
      },
      {
        bloodPressureSystolic: 138,
        bloodPressureDiastolic: 88,
        heartRate: 78,
        respiratoryRate: 18,
        temperature: 98.2,
        oxygenSaturation: 98,
        bmi: 24.8,
        weightLbs: 152,
        heightInches: 66,
        recordedAt: '6 months ago'
      }
    ],
    lastVisit: 'Today',
    primaryCarePhysician: 'Dr. Sarah Jenkins, MD',
    emergencyContact: {
      name: 'Thomas Vance',
      relation: 'Spouse',
      phone: '(555) 392-8173'
    }
  },
  {
    id: 'pt-002',
    mrn: 'MRN-77319',
    firstName: 'Marcus',
    lastName: 'Chen',
    dob: '1984-11-23',
    age: 41,
    gender: 'Male',
    phone: '(555) 619-2041',
    email: 'm.chen.arch@gmail.com',
    address: '88 Harbor Boulevard, Suite 12',
    insuranceProvider: 'Aetna Choice POS II',
    policyNumber: 'AET-49210-99',
    allergies: [
      { allergen: 'Latex', reaction: 'Contact dermatitis', severity: 'moderate' }
    ],
    activeDiagnoses: [
      { icd10: 'E11.9', description: 'Type 2 diabetes mellitus without complications', type: 'chronic', onsetDate: '2023-05-12', status: 'active' },
      { icd10: 'G43.909', description: 'Migraine, unspecified, not intractable', type: 'acute', onsetDate: '2025-02-10', status: 'active' }
    ],
    currentMedications: [
      { id: 'med-4', name: 'Metformin HCl', dosage: '850 mg', frequency: 'Twice daily with meals', route: 'Oral', startDate: '2023-05-15', prescribedBy: 'Dr. Sarah Jenkins, MD', refillsRemaining: 2, status: 'active' },
      { id: 'med-5', name: 'Sumatriptan', dosage: '50 mg', frequency: 'At onset of migraine, max 100mg/day', route: 'Oral', startDate: '2025-02-12', prescribedBy: 'Dr. Sarah Jenkins, MD', refillsRemaining: 5, status: 'active' }
    ],
    vitalsHistory: [
      {
        bloodPressureSystolic: 122,
        bloodPressureDiastolic: 78,
        heartRate: 68,
        respiratoryRate: 15,
        temperature: 98.6,
        oxygenSaturation: 99,
        bmi: 26.1,
        weightLbs: 182,
        heightInches: 70,
        recordedAt: 'Today, 09:30 AM'
      }
    ],
    lastVisit: 'Today',
    primaryCarePhysician: 'Dr. Sarah Jenkins, MD',
    emergencyContact: {
      name: 'Grace Chen',
      relation: 'Sister',
      phone: '(555) 619-2045'
    }
  },
  {
    id: 'pt-003',
    mrn: 'MRN-91044',
    firstName: 'Sophia',
    lastName: 'Rodriguez',
    dob: '1995-08-30',
    age: 31,
    gender: 'Female',
    phone: '(555) 441-9821',
    email: 'sophia.rodriguez@designco.org',
    address: '1240 Cedar Crest Way',
    insuranceProvider: 'UnitedHealthcare Choice Plus',
    policyNumber: 'UHC-819321-44',
    allergies: [],
    activeDiagnoses: [
      { icd10: 'J45.20', description: 'Mild intermittent asthma, uncomplicated', type: 'chronic', onsetDate: '2019-10-01', status: 'active' },
      { icd10: 'R53.83', description: 'Other fatigue / persistent exhaustion', type: 'acute', onsetDate: '2026-08-15', status: 'active' }
    ],
    currentMedications: [
      { id: 'med-6', name: 'Albuterol HFA Inhaler', dosage: '90 mcg/actuation', frequency: '1-2 puffs Q4-6H PRN wheezing', route: 'Inhalation', startDate: '2019-10-05', prescribedBy: 'Dr. Sarah Jenkins, MD', refillsRemaining: 6, status: 'active' }
    ],
    vitalsHistory: [
      {
        bloodPressureSystolic: 116,
        bloodPressureDiastolic: 74,
        heartRate: 74,
        respiratoryRate: 14,
        temperature: 98.7,
        oxygenSaturation: 99,
        bmi: 22.0,
        weightLbs: 130,
        heightInches: 65,
        recordedAt: 'Today, 10:15 AM'
      }
    ],
    lastVisit: 'Today',
    primaryCarePhysician: 'Dr. Sarah Jenkins, MD',
    emergencyContact: {
      name: 'Elena Rodriguez',
      relation: 'Mother',
      phone: '(555) 441-9820'
    }
  },
  {
    id: 'pt-004',
    mrn: 'MRN-65821',
    firstName: 'David',
    lastName: 'Kim',
    dob: '1968-02-14',
    age: 58,
    gender: 'Male',
    phone: '(555) 882-1940',
    email: 'dkim.engineer@techlink.net',
    address: '730 Magnolia Terrace',
    insuranceProvider: 'Cigna Health and Life',
    policyNumber: 'CGN-194029-02',
    allergies: [
      { allergen: 'Aspirin', reaction: 'Bronchospasm & wheezing', severity: 'severe' }
    ],
    activeDiagnoses: [
      { icd10: 'J20.9', description: 'Acute bronchitis, unspecified', type: 'acute', onsetDate: '2026-09-27', status: 'active' },
      { icd10: 'K21.9', description: 'Gastro-esophageal reflux disease without esophagitis', type: 'chronic', onsetDate: '2020-04-10', status: 'active' }
    ],
    currentMedications: [
      { id: 'med-7', name: 'Omeprazole', dosage: '20 mg', frequency: 'Once daily before breakfast', route: 'Oral', startDate: '2020-04-12', prescribedBy: 'Dr. Sarah Jenkins, MD', refillsRemaining: 4, status: 'active' }
    ],
    vitalsHistory: [
      {
        bloodPressureSystolic: 132,
        bloodPressureDiastolic: 84,
        heartRate: 84,
        respiratoryRate: 20,
        temperature: 99.8,
        oxygenSaturation: 96,
        bmi: 27.4,
        weightLbs: 195,
        heightInches: 71,
        recordedAt: 'Today, 11:00 AM'
      }
    ],
    lastVisit: 'Today',
    primaryCarePhysician: 'Dr. Sarah Jenkins, MD',
    emergencyContact: {
      name: 'Jennifer Kim',
      relation: 'Spouse',
      phone: '(555) 882-1941'
    }
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-101',
    patientId: 'pt-001',
    patientName: 'Eleanor Vance',
    patientAvatar: '/src/assets/images/patient_eleanor_avatar_1790788453372.jpg',
    age: 54,
    gender: 'Female',
    mrn: 'MRN-84920',
    time: '09:00 AM',
    date: 'Today',
    type: 'Annual Wellness',
    room: 'Exam Room 3',
    status: 'with-doctor',
    reason: 'Annual comprehensive physical exam & blood pressure medication titration review',
    priority: 'routine',
    vitals: INITIAL_PATIENTS[0].vitalsHistory[0]
  },
  {
    id: 'apt-102',
    patientId: 'pt-002',
    patientName: 'Marcus Chen',
    age: 41,
    gender: 'Male',
    mrn: 'MRN-77319',
    time: '09:45 AM',
    date: 'Today',
    type: 'Follow-up',
    room: 'Exam Room 1',
    status: 'in-exam-room',
    reason: 'Type 2 Diabetes 3-month HbA1c review & migraine frequency discussion',
    priority: 'routine',
    vitals: INITIAL_PATIENTS[1].vitalsHistory[0]
  },
  {
    id: 'apt-103',
    patientId: 'pt-003',
    patientName: 'Sophia Rodriguez',
    age: 31,
    gender: 'Female',
    mrn: 'MRN-91044',
    time: '10:30 AM',
    date: 'Today',
    type: 'Telehealth Consult',
    room: 'Virtual Clinic 2',
    status: 'checked-in',
    reason: 'Unexplained chronic fatigue, lab follow-up for ferritin & TSH levels',
    priority: 'routine',
    vitals: INITIAL_PATIENTS[2].vitalsHistory[0]
  },
  {
    id: 'apt-104',
    patientId: 'pt-004',
    patientName: 'David Kim',
    age: 58,
    gender: 'Male',
    mrn: 'MRN-65821',
    time: '11:15 AM',
    date: 'Today',
    type: 'Acute Care',
    room: 'Exam Room 4',
    status: 'checked-in',
    reason: 'Persistent productive cough for 5 days, low-grade fever, chest tightness',
    priority: 'urgent',
    vitals: INITIAL_PATIENTS[3].vitalsHistory[0]
  },
  {
    id: 'apt-105',
    patientId: 'pt-001',
    patientName: 'Eleanor Vance',
    age: 54,
    gender: 'Female',
    mrn: 'MRN-84920',
    time: '02:00 PM',
    date: 'Tomorrow',
    type: 'Follow-up',
    room: 'Virtual Clinic 1',
    status: 'scheduled',
    reason: 'Post-lipid panel Telehealth consultation',
    priority: 'routine'
  }
];

export const INITIAL_SOAP_NOTE: SOAPNote = {
  subjective: `Patient is a 54-year-old female presenting for her scheduled annual preventive health examination and follow-up on essential hypertension and hyperlipidemia.

Patient reports feeling generally well over the past 6 months. Home blood pressure logs have remained controlled, averaging 124–130 systolic and 80–84 diastolic on Lisinopril 20mg daily. Denies chest pain, palpitations, orthopnea, shortness of breath, or lower extremity edema. Reports mild right knee stiffness in the mornings which improves after 15 minutes of movement, consistent with mild osteoarthritis. 

Diet: Mediterranean-style diet, moderating sodium intake. Exercise: Walks 30 minutes 4 days/week. No tobacco use, alcohol 1-2 glasses of wine weekly.`,
  objective: {
    general: 'Alert, oriented x4, pleasant, well-nourished, in no acute distress.',
    heent: 'Normocephalic, atraumatic. Pupils equal, round, reactive to light and accommodation. Oropharynx clear, moist mucous membranes, no exudates.',
    cardiovascular: 'Regular rate and rhythm. S1 and S2 present and normal. No murmurs, gallops, rubs, or carotid bruits. Peripheral pulses 2+ bilaterally.',
    pulmonary: 'Clear to auscultation bilaterally. No wheezes, rales, or rhonchi. Normal unlabored respiratory effort.',
    abdominal: 'Soft, non-tender, non-distended. Bowel sounds normoactive in all four quadrants. No hepatosplenomegaly or rebound tenderness.',
    neurological: 'Cranial nerves II-XII grossly intact. Motor strength 5/5 throughout. Normal gait and stance.',
    extremities: 'No cyanosis, clubbing, or peripheral edema. Right knee with mild crepitus, no joint effusion or erythema. Full range of motion preserved.'
  },
  assessment: `1. Essential Hypertension (ICD-10: I10) — Well controlled on Lisinopril 20mg PO daily. Target BP < 130/80 achieved.
2. Hyperlipidemia (ICD-10: E78.5) — Stable on Atorvastatin 20mg PO QHS. Lipid panel ordered today for annual monitoring.
3. Unilateral Primary Osteoarthritis, Right Knee (ICD-10: M17.11) — Stable, managed conservatively with PRN Meloxicam and low-impact activity.
4. Health Maintenance — Due for routine screening colonoscopy and annual mammogram.`,
  plan: `1. Continue Lisinopril 20 mg PO once daily. Continue home BP logging.
2. Continue Atorvastatin 20 mg PO at bedtime. 
3. Fasting Lipid Panel & Comprehensive Metabolic Panel (CMP) drawn in clinic today.
4. 12-Lead Electrocardiogram (ECG) performed in clinic — review rhythm strip today.
5. Mammography referral ordered. Patient opted to schedule colonoscopy next month.
6. Continue 30 min daily walking, low-impact exercise for knee joint preservation.
7. Follow-up in clinic in 6 months, or sooner if home BP exceeds 140/90 repeatedly.`,
  isSigned: false
};

export const INITIAL_LAB_PANELS: LabPanel[] = [
  {
    id: 'lab-001',
    patientId: 'pt-001',
    panelName: 'Comprehensive Metabolic Panel (CMP)',
    collectedAt: 'Today, 08:50 AM',
    orderedBy: 'Dr. Sarah Jenkins, MD',
    status: 'completed',
    items: [
      { name: 'Sodium', value: 140, unit: 'mmol/L', referenceRange: '135 - 145', status: 'normal' },
      { name: 'Potassium', value: 4.2, unit: 'mmol/L', referenceRange: '3.5 - 5.0', status: 'normal' },
      { name: 'Chloride', value: 102, unit: 'mmol/L', referenceRange: '96 - 106', status: 'normal' },
      { name: 'Carbon Dioxide (CO2)', value: 24, unit: 'mmol/L', referenceRange: '23 - 29', status: 'normal' },
      { name: 'Blood Urea Nitrogen (BUN)', value: 16, unit: 'mg/dL', referenceRange: '7 - 20', status: 'normal' },
      { name: 'Serum Creatinine', value: 0.88, unit: 'mg/dL', referenceRange: '0.50 - 1.10', status: 'normal' },
      { name: 'eGFR (CKD-EPI)', value: 88, unit: 'mL/min/1.73m²', referenceRange: '> 60', status: 'normal' },
      { name: 'Fasting Glucose', value: 92, unit: 'mg/dL', referenceRange: '70 - 99', status: 'normal' },
      { name: 'Calcium', value: 9.4, unit: 'mg/dL', referenceRange: '8.5 - 10.2', status: 'normal' },
      { name: 'Total Bilirubin', value: 0.6, unit: 'mg/dL', referenceRange: '0.1 - 1.2', status: 'normal' },
      { name: 'ALT (SGPT)', value: 22, unit: 'U/L', referenceRange: '7 - 35', status: 'normal' },
      { name: 'AST (SGOT)', value: 20, unit: 'U/L', referenceRange: '8 - 33', status: 'normal' }
    ]
  },
  {
    id: 'lab-002',
    patientId: 'pt-001',
    panelName: 'Lipid Profile (Fasting)',
    collectedAt: 'Today, 08:50 AM',
    orderedBy: 'Dr. Sarah Jenkins, MD',
    status: 'completed',
    items: [
      { name: 'Total Cholesterol', value: 184, unit: 'mg/dL', referenceRange: '< 200', status: 'normal' },
      { name: 'Triglycerides', value: 135, unit: 'mg/dL', referenceRange: '< 150', status: 'normal' },
      { name: 'HDL Cholesterol ("Good")', value: 58, unit: 'mg/dL', referenceRange: '> 50', status: 'normal' },
      { name: 'LDL Cholesterol (Calculated)', value: 99, unit: 'mg/dL', referenceRange: '< 100', status: 'normal' },
      { name: 'Non-HDL Cholesterol', value: 126, unit: 'mg/dL', referenceRange: '< 130', status: 'normal' }
    ]
  },
  {
    id: 'lab-003',
    patientId: 'pt-002',
    panelName: 'Hemoglobin A1c (Glycated Hb)',
    collectedAt: 'Today, 09:35 AM',
    orderedBy: 'Dr. Sarah Jenkins, MD',
    status: 'completed',
    items: [
      { name: 'Hemoglobin A1c', value: 6.8, unit: '%', referenceRange: '< 5.7 (Prediabetes: 5.7-6.4, Diabetes: ≥6.5)', status: 'high' },
      { name: 'Estimated Avg Glucose (eAG)', value: 148, unit: 'mg/dL', referenceRange: '70 - 126', status: 'high' }
    ]
  }
];
