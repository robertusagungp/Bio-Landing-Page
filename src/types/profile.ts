export type AgeRange = '18-24' | '25-29' | '30-34' | '35-39' | '40-49' | '50+';
export type ActivityLevel = '0' | '1-2' | '3-4' | '5+';
export type SleepDuration = '<5' | '5-6' | '6-7' | '7-9' | '>9';
export type StressLevel = 'low' | 'moderate' | 'high' | 'very_high';
export type SmokingStatus = 'yes' | 'no';
export type NutritionFrequency = 'rarely' | 'sometimes' | 'regularly' | 'abundant';
export type SittingTime = '<4' | '4-6' | '7-9' | '>9';
export type MorningEnergy = 'sluggish' | 'average' | 'good' | 'optimal';
export type OverwhelmedFreq = 'rarely' | 'sometimes' | 'often' | 'always';

export type MonthlyExpenseRange = '<5jt' | '5-10jt' | '10-20jt' | '20-30jt' | '>30jt';
export type MonthlyIncomeRange = '<10jt' | '10-20jt' | '20-35jt' | '35-50jt' | '>50jt';
export type EmergencyFundsMonths = '<1' | '1-3' | '3-6' | '6-12' | '12+';
export type DependentsCount = '0' | '1' | '2' | '3+';
export type IncomeStability = 'very_stable' | 'quite_stable' | 'variable' | 'highly_uncertain';
export type DebtRatio = '<10%' | '10-30%' | '30-50%' | '>50%';
export type SavingHabit = 'rarely' | 'leftovers' | 'consistent_10_20' | 'aggressive_20_plus';
export type RelationshipStatus = 'single' | 'married_no_kids' | 'married_with_kids' | 'single_parent';
export type HouseholdIncomeSources = 'single' | 'dual' | 'multiple';
export type PrimaryIncomeStopScenario = 'other_sufficient' | 'exists_insufficient' | 'no_other_income';

export type BiologicalSex = 'male' | 'female';
export type FamilyHistoryCondition = 'diabetes' | 'cardiovascular' | 'cancer' | 'cholesterol' | 'other';
export type LastHealthCheckTime = '<6m' | '6-12m' | '1-2y' | '>2y' | 'never';

export interface UserProfile {
  ageRange?: AgeRange;
  exactAge?: number;
  activity?: ActivityLevel;
  sleep?: SleepDuration;
  stress?: StressLevel;
  smoking?: SmokingStatus;
  nutrition?: NutritionFrequency;
  sittingTime?: SittingTime;
  morningEnergy?: MorningEnergy;
  feelingOverwhelmed?: OverwhelmedFreq;
  
  monthlyExpenseRange?: MonthlyExpenseRange;
  monthlyExpenseAmount?: number;
  monthlyIncomeRange?: MonthlyIncomeRange;
  liquidSavingsMonths?: EmergencyFundsMonths;
  liquidSavingsAmount?: number;
  debtRatio?: DebtRatio;
  savingHabit?: SavingHabit;
  dependents?: DependentsCount;
  incomeStability?: IncomeStability;
  relationshipStatus?: RelationshipStatus;
  householdIncomeSources?: HouseholdIncomeSources;
  primaryIncomeStop6Months?: PrimaryIncomeStopScenario;
  
  biologicalSex?: BiologicalSex;
  familyHistory?: 'yes' | 'no';
  familyConditions?: FamilyHistoryCondition[];
  lastHealthCheck?: LastHealthCheckTime;
}

export type ScoreCategory = 'Needs Attention' | 'Building Foundation' | 'Good Foundation' | 'Strong' | 'Very Strong';

export interface ScoreMeta {
  score: number;
  category: ScoreCategory;
  categoryLabelId: string;
  badgeColorClass: string;
}

export interface LifeReadinessResult {
  overallScore: number;
  category: ScoreCategory;
  categoryLabelId: string;
  subtitle: string;
  pillars: {
    health: number;
    money: number;
    emergency: number;
    family: number;
  };
  strengths: string[];
  watchAreas: string[];
  biggestVulnerability: {
    title: string;
    description: string;
  };
  whatIfScenarios: {
    title: string;
    description: string;
    impactDescription: string;
    severity: 'low' | 'moderate' | 'high';
  }[];
  nextSteps: string[];
  weakestPillar: 'health' | 'money' | 'emergency' | 'family';
}

export interface LifestyleAgeResult {
  actualAge: number;
  lifestyleAge: number;
  differenceYears: number; // e.g. +4 or -2
  contributors: {
    name: string;
    impact: 'positive' | 'neutral' | 'negative';
    detail: string;
  }[];
  biggestImpact: string;
  smallChanges: string[];
}

export interface WellnessResult {
  overallScore: number;
  category: ScoreCategory;
  categoryLabelId: string;
  subscores: {
    movement: number;
    sleep: number;
    nutrition: number;
    recovery: number;
    lifestyle: number;
  };
  strength: string;
  bottleneck: string;
  highestPotentialImprovement: string;
  lowestComponent: 'movement' | 'sleep' | 'nutrition' | 'recovery' | 'lifestyle';
}

export interface FinancialHealthResult {
  overallScore: number;
  category: ScoreCategory;
  categoryLabelId: string;
  profileLabel: string;
  profileLabelDescription: string;
  subscores: {
    cashFlow: number;
    emergency: number;
    debt: number;
    savingHabit: number;
    resilience: number;
  };
  stressTest: {
    oneMonth: 'green' | 'yellow' | 'red';
    threeMonths: 'green' | 'yellow' | 'red';
    sixMonths: 'green' | 'yellow' | 'red';
    explanation: string;
  };
  deepInsight: string;
}

export interface EmergencyRunwayResult {
  runwayMonths: number;
  monthlyExpense: number;
  liquidSavings: number;
  status: 'critical' | 'minimal' | 'adequate' | 'robust' | 'exceptional';
  statusLabel: string;
  scenarios: {
    label: string;
    remainingMonths: number;
    difference: number;
    note: string;
  }[];
  keyInsight: string;
  calculationBreakdown: {
    formula: string;
    assumptions: string[];
  };
}

export interface MedicalCostBreakdown {
  room: number;
  doctor: number;
  diagnostics: number;
  medication: number;
  procedure: number;
  other: number;
}

export interface MedicalScenarioResult {
  city: string;
  hospitalCategory: string;
  scenario: string;
  lengthOfStay: string;
  estimatedMin: number;
  estimatedMax: number;
  estimatedMid: number;
  breakdown: MedicalCostBreakdown;
  emergencyImpact?: {
    runwayBefore: number;
    runwayAfter: number;
    savingsBefore: number;
    savingsAfter: number;
  };
  riskInsight: string;
}

export interface FamilyReadinessResult {
  overallScore: number;
  category: ScoreCategory;
  categoryLabelId: string;
  subscores: {
    dailyNeeds: number;
    emergency: number;
    incomeBackup: number;
    dependents: number;
    flexibility: number;
  };
  strongestPoint: string;
  biggestDependency: string;
  interruptionTimeline: {
    month: number;
    status: 'Strong' | 'Manageable' | 'Tight' | 'Vulnerable';
    note: string;
  }[];
  riskEducation: string[];
}

export interface HealthChecklistResult {
  keepDoing: string[];
  worthWatching: string[];
  worthDiscussing: string[];
  disclaimer: string;
}

export interface ProtectionGapResult {
  overallScore: number;
  status: 'safe' | 'moderate_gap' | 'high_gap' | 'critical_gap';
  statusLabel: string;
  summary: string;
  whyExplanation: string;
  vulnerabilityPillars: {
    name: string;
    level: 'Aman' | 'Waspada' | 'Kritis';
    score: number;
    description: string;
  }[];
  recommendations: {
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    suitableVehicle: string;
  }[];
  isAdequatelyProtected: boolean;
  neutralNote: string;
}

export type ActiveToolId = 
  | 'life-readiness' 
  | 'lifestyle-age' 
  | 'wellness-score' 
  | 'financial-health' 
  | 'emergency-checker' 
  | 'medical-simulator' 
  | 'family-readiness' 
  | 'health-checklist'
  | 'protection-gap';

export interface StoredResults {
  lifeReadiness?: LifeReadinessResult;
  lifestyleAge?: LifestyleAgeResult;
  wellness?: WellnessResult;
  financialHealth?: FinancialHealthResult;
  emergencyRunway?: EmergencyRunwayResult;
  medicalScenario?: MedicalScenarioResult;
  familyReadiness?: FamilyReadinessResult;
  healthChecklist?: HealthChecklistResult;
  protectionGap?: ProtectionGapResult;
  lastCompletedTool?: ActiveToolId;
}
