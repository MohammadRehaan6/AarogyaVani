export type LanguageCode =
  | 'en'
  | 'hi'
  | 'te'
  | 'ta'
  | 'bn'
  | 'mr'
  | 'gu'
  | 'kn'
  | 'ml'
  | 'pa'
  | 'ur'
  | 'or';

export interface SupportedLanguage {
  code: LanguageCode;
  name: string;
  nativeName: string;
  scriptGreeting: string;
  phoneticGreeting: string;
  flagOrIcon: string;
  speechCode: string;
  samplePhrase: string;
}

export type MetricStatus = 'low' | 'normal' | 'high' | 'critical-low' | 'critical-high';

export interface LabMetric {
  id: string;
  name: string;
  category: 'Blood & Hematology' | 'Metabolic & Sugar' | 'Cardiovascular & Vitals' | 'Kidney & Renal' | 'Liver & Enzymes' | 'Electrolytes';
  patientValue: number;
  unit: string;
  healthyNormalMin: number;
  healthyNormalMax: number;
  healthyIdealBaseline: number; // e.g. 100 for index, or exact optimal value
  healthyBaselineNote: string;
  status: MetricStatus;
  percentageVariance: number; // e.g. -30% lower than healthy baseline
  plainExplanation: string;
  translatedExplanation?: string;
  organAffected: string;
}

export interface DiseaseDiagnosis {
  name: string;
  translatedName: string;
  category: string;
  stageName: string; // e.g. "Stage 2 Moderate", "Grade 1 Mild Anemia", "Uncontrolled Stage 2"
  stageLevel: 1 | 2 | 3 | 4;
  totalStages: number;
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Critical';
  stageDescription: string;
  translatedStageDescription: string;
  whatItMeansForYou: string;
  translatedWhatItMeans: string;
  warningSigns: string[];
  translatedWarningSigns?: string[];
  followUpDays: number;
  followUpNote: string;
}

export interface DietRecommendation {
  vegProteins: {
    name: string;
    translatedName: string;
    portion: string;
    benefit: string;
    icon: string;
  }[];
  nonVegProteins: {
    name: string;
    translatedName: string;
    portion: string;
    benefit: string;
    icon: string;
  }[];
  healingVeggies: {
    name: string;
    translatedName: string;
    whyItHelps: string;
    preparationTip: string;
  }[];
  superfoodsAndSeeds: {
    name: string;
    translatedName: string;
    dosage: string;
    benefit: string;
  }[];
  foodsToStrictlyAvoid: {
    name: string;
    translatedName: string;
    reason: string;
  }[];
}

export interface ExercisePlan {
  dailyWalkingMinutes: number;
  walkingTip: string;
  suryaNamaskarRounds: number;
  suryaNamaskarGuidance: string;
  pranayama: {
    name: string;
    translatedName: string;
    durationMinutes: number;
    howToPerform: string;
    healingFocus: string;
  }[];
  conditionSafeExercises: {
    name: string;
    translatedName: string;
    frequency: string;
    caution: string;
  }[];
}

export type AdministrationRoute =
  | 'swallow-water'
  | 'dissolve-water'
  | 'chew-tablet'
  | 'sublingual-tongue'
  | 'tonic-shake'
  | 'eye-drops'
  | 'topical-inhaler';

export interface MedicineScheduleItem {
  id: string;
  medicineName: string; // e.g., "Pantoprazole (P40)" or "Metformin SR"
  genericName: string;
  dosageStrength: string; // e.g., "40 mg" (and contrast with 20mg or 60mg)
  dosageStrengthReason: string; // why 40mg vs 20mg for this stage
  timingSlot: {
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
    night: boolean;
  };
  mealRelation: 'before-breakfast-empty-stomach' | 'after-breakfast' | 'before-lunch' | 'after-lunch' | 'before-dinner' | 'after-dinner' | 'bedtime' | 'as-needed';
  mealRelationLabel: string;
  mealRelationTranslated: string;
  shelfLifeAndExpiry: {
    unopenedShelfLife: string; // e.g. "24 months from manufacturing date"
    afterOpeningRule: string; // e.g. "Strictly discard 28 days after breaking seal" for eye drops
    storageCondition: string; // e.g. "Store below 25°C away from direct sunlight"
    isSpecialExpiryWarning: boolean;
  };
  administrationMode: {
    type: AdministrationRoute;
    title: string;
    translatedTitle: string;
    stepByStepInstructions: string[];
    translatedInstructions?: string[];
    criticalCaution: string; // e.g. "Do not swallow directly; wait till completely dissolved under tongue"
  };
}

export interface DischargeReportAnalysis {
  reportId: string;
  reportType: 'Blood Test (CBC)' | 'Diabetic & Metabolic Profile' | 'Cardiovascular & BP' | 'Urine & Renal Function' | 'Discharge Summary & Prescription' | 'Custom Scan';
  patientName: string;
  age: number;
  gender: string;
  scanTimestamp: string;
  summaryInPlainLanguage: string;
  summaryInChosenLanguage: string;
  overallHealthScore: number; // 0 - 100 benchmark
  metrics: LabMetric[];
  diagnosis: DiseaseDiagnosis;
  dietPlan: DietRecommendation;
  exercisePlan: ExercisePlan;
  medicines: MedicineScheduleItem[];
  clinicianVerification: {
    isVerified: boolean;
    verifiedByDoctorName?: string;
    verifiedAt?: string;
    notes?: string;
    checklistPassed: {
      medicineNamesPreserved: boolean;
      timingAccurate: boolean;
      warningSignsClear: boolean;
      followUpDatePreserved: boolean;
    };
  };
}
