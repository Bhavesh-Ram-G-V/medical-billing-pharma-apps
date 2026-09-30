export interface BillableMedication {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  form: 'Tablet' | 'Capsule' | 'Inhaler' | 'Solution' | 'Oral Suspension';
  category: 'Antibiotic' | 'Cardiovascular' | 'Endocrine' | 'Respiratory' | 'Gastrointestinal' | 'Neurology / Mental Health';
  defaultQuantity: number;
  daysSupply: number;
  retailPrice: number; // in USD
  insuranceCoverageRate: number; // e.g. 0.80 for 80% coverage
  tier: 1 | 2 | 3;
  commonIndication: string;
}

export interface InsuranceOption {
  id: string;
  name: string;
  planType: string;
  defaultDiscountRate: number;
}

export const INSURANCE_OPTIONS: InsuranceOption[] = [
  { id: 'bcbs-ppo', name: 'Blue Cross Blue Shield (Preferred PPO)', planType: 'Commercial PPO', defaultDiscountRate: 0.80 },
  { id: 'aetna-choice', name: 'Aetna Choice POS II', planType: 'Commercial POS', defaultDiscountRate: 0.75 },
  { id: 'medicare-d', name: 'Medicare Part D Standard Rx', planType: 'Federal Medicare', defaultDiscountRate: 0.85 },
  { id: 'uhc-optum', name: 'UnitedHealthcare OptumRx', planType: 'Commercial PPO', defaultDiscountRate: 0.78 },
  { id: 'cigna-rx', name: 'Cigna Express Scripts Comprehensive', planType: 'Commercial PPO', defaultDiscountRate: 0.82 },
  { id: 'self-pay', name: 'Uninsured / Self-Pay (Clinic Sliding Scale)', planType: 'Self-Pay Discount', defaultDiscountRate: 0.35 }
];

export const CATALOG_MEDICATIONS: BillableMedication[] = [
  {
    id: 'med-amox-500',
    name: 'Amoxicillin',
    genericName: 'Amoxicillin Trihydrate',
    dosage: '500 mg',
    form: 'Capsule',
    category: 'Antibiotic',
    defaultQuantity: 30,
    daysSupply: 10,
    retailPrice: 28.50,
    insuranceCoverageRate: 0.85,
    tier: 1,
    commonIndication: 'Bacterial upper respiratory infection, otitis media, streptococcal pharyngitis'
  },
  {
    id: 'med-amox-875',
    name: 'Amoxicillin-Clavulanate (Augmentin)',
    genericName: 'Amoxicillin / Clavulanate Potassium',
    dosage: '875 / 125 mg',
    form: 'Tablet',
    category: 'Antibiotic',
    defaultQuantity: 20,
    daysSupply: 10,
    retailPrice: 54.00,
    insuranceCoverageRate: 0.80,
    tier: 1,
    commonIndication: 'Sinusitis, acute exacerbation of chronic bronchitis'
  },
  {
    id: 'med-met-500',
    name: 'Metformin HCl',
    genericName: 'Metformin Hydrochloride',
    dosage: '500 mg',
    form: 'Tablet',
    category: 'Endocrine',
    defaultQuantity: 60,
    daysSupply: 30,
    retailPrice: 24.00,
    insuranceCoverageRate: 0.90,
    tier: 1,
    commonIndication: 'Type 2 Diabetes Mellitus glycemic control'
  },
  {
    id: 'med-met-850',
    name: 'Metformin HCl ER',
    genericName: 'Metformin Hydrochloride Extended Release',
    dosage: '850 mg',
    form: 'Tablet',
    category: 'Endocrine',
    defaultQuantity: 60,
    daysSupply: 30,
    retailPrice: 38.00,
    insuranceCoverageRate: 0.85,
    tier: 1,
    commonIndication: 'Type 2 Diabetes Mellitus extended release'
  },
  {
    id: 'med-lis-10',
    name: 'Lisinopril',
    genericName: 'Lisinopril ACE Inhibitor',
    dosage: '10 mg',
    form: 'Tablet',
    category: 'Cardiovascular',
    defaultQuantity: 30,
    daysSupply: 30,
    retailPrice: 22.00,
    insuranceCoverageRate: 0.90,
    tier: 1,
    commonIndication: 'Essential hypertension, heart failure post-MI'
  },
  {
    id: 'med-lis-20',
    name: 'Lisinopril',
    genericName: 'Lisinopril ACE Inhibitor',
    dosage: '20 mg',
    form: 'Tablet',
    category: 'Cardiovascular',
    defaultQuantity: 30,
    daysSupply: 30,
    retailPrice: 26.50,
    insuranceCoverageRate: 0.90,
    tier: 1,
    commonIndication: 'Essential hypertension blood pressure titration'
  },
  {
    id: 'med-ator-20',
    name: 'Atorvastatin (Lipitor)',
    genericName: 'Atorvastatin Calcium',
    dosage: '20 mg',
    form: 'Tablet',
    category: 'Cardiovascular',
    defaultQuantity: 30,
    daysSupply: 30,
    retailPrice: 46.00,
    insuranceCoverageRate: 0.85,
    tier: 1,
    commonIndication: 'Hyperlipidemia, atherosclerotic cardiovascular disease prevention'
  },
  {
    id: 'med-ator-40',
    name: 'Atorvastatin (Lipitor)',
    genericName: 'Atorvastatin Calcium',
    dosage: '40 mg',
    form: 'Tablet',
    category: 'Cardiovascular',
    defaultQuantity: 30,
    daysSupply: 30,
    retailPrice: 58.00,
    insuranceCoverageRate: 0.85,
    tier: 1,
    commonIndication: 'High-intensity statin therapy for coronary risk'
  },
  {
    id: 'med-alb-hfa',
    name: 'Albuterol HFA (ProAir / Ventolin)',
    genericName: 'Albuterol Sulfate Inhalation Aerosol',
    dosage: '90 mcg/actuation (8.5g canister)',
    form: 'Inhaler',
    category: 'Respiratory',
    defaultQuantity: 1,
    daysSupply: 30,
    retailPrice: 72.00,
    insuranceCoverageRate: 0.75,
    tier: 2,
    commonIndication: 'Bronchospasm relief in asthma and exercise-induced asthma'
  },
  {
    id: 'med-omep-20',
    name: 'Omeprazole (Prilosec)',
    genericName: 'Omeprazole Delayed-Release',
    dosage: '20 mg',
    form: 'Capsule',
    category: 'Gastrointestinal',
    defaultQuantity: 30,
    daysSupply: 30,
    retailPrice: 32.00,
    insuranceCoverageRate: 0.80,
    tier: 1,
    commonIndication: 'Gastroesophageal reflux disease (GERD), peptic ulcer'
  },
  {
    id: 'med-amlo-5',
    name: 'Amlodipine Besylate (Norvasc)',
    genericName: 'Amlodipine Besylate Calcium Channel Blocker',
    dosage: '5 mg',
    form: 'Tablet',
    category: 'Cardiovascular',
    defaultQuantity: 30,
    daysSupply: 30,
    retailPrice: 19.50,
    insuranceCoverageRate: 0.90,
    tier: 1,
    commonIndication: 'Hypertension, coronary artery vasospasm prophylaxis'
  },
  {
    id: 'med-levo-50',
    name: 'Levothyroxine Sodium (Synthroid)',
    genericName: 'Levothyroxine Sodium T4 Hormone',
    dosage: '50 mcg (0.05 mg)',
    form: 'Tablet',
    category: 'Endocrine',
    defaultQuantity: 30,
    daysSupply: 30,
    retailPrice: 36.00,
    insuranceCoverageRate: 0.85,
    tier: 1,
    commonIndication: 'Primary hypothyroidism thyroid hormone replacement'
  },
  {
    id: 'med-losar-50',
    name: 'Losartan Potassium (Cozaar)',
    genericName: 'Losartan Potassium ARB',
    dosage: '50 mg',
    form: 'Tablet',
    category: 'Cardiovascular',
    defaultQuantity: 30,
    daysSupply: 30,
    retailPrice: 24.00,
    insuranceCoverageRate: 0.88,
    tier: 1,
    commonIndication: 'Hypertension, diabetic nephropathy renal protection'
  },
  {
    id: 'med-gaba-300',
    name: 'Gabapentin (Neurontin)',
    genericName: 'Gabapentin',
    dosage: '300 mg',
    form: 'Capsule',
    category: 'Neurology / Mental Health',
    defaultQuantity: 90,
    daysSupply: 30,
    retailPrice: 42.00,
    insuranceCoverageRate: 0.82,
    tier: 1,
    commonIndication: 'Neuropathic pain, diabetic peripheral neuropathy'
  },
  {
    id: 'med-azith-250',
    name: 'Azithromycin (Zithromax Z-Pak)',
    genericName: 'Azithromycin Macrolide',
    dosage: '250 mg (6 tablets)',
    form: 'Tablet',
    category: 'Antibiotic',
    defaultQuantity: 6,
    daysSupply: 5,
    retailPrice: 35.00,
    insuranceCoverageRate: 0.85,
    tier: 1,
    commonIndication: 'Community-acquired pneumonia, acute bacterial exacerbations'
  },
  {
    id: 'med-sert-50',
    name: 'Sertraline HCl (Zoloft)',
    genericName: 'Sertraline Hydrochloride SSRI',
    dosage: '50 mg',
    form: 'Tablet',
    category: 'Neurology / Mental Health',
    defaultQuantity: 30,
    daysSupply: 30,
    retailPrice: 29.00,
    insuranceCoverageRate: 0.85,
    tier: 1,
    commonIndication: 'Major depressive disorder, generalized anxiety disorder'
  }
];
