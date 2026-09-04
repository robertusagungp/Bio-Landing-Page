import { UserProfile, MedicalScenarioResult, MedicalCostBreakdown } from '../../types/profile';
import { 
  BASE_SCENARIOS_DATA, 
  CITY_MULTIPLIERS, 
  HOSPITAL_TIER_MULTIPLIERS 
} from '../../data/medicalCostData';

export interface MedicalSimulatorInput {
  city: string;
  hospitalCategory: string; // 'basic_private' | 'mid_private' | 'premium_private'
  scenarioKey: string;     // 'mild_inpatient' | 'simple_surgery' | 'serious_inpatient' | 'major_treatment'
  lengthOfStay: string;    // '1-2' | '3-5' | '6-10' | '10+'
}

export const simulateMedicalCost = (
  input: MedicalSimulatorInput,
  profile?: UserProfile
): MedicalScenarioResult => {
  const scenarioData = BASE_SCENARIOS_DATA[input.scenarioKey] || BASE_SCENARIOS_DATA['mild_inpatient'];
  const cityMult = CITY_MULTIPLIERS[input.city] || 1.0;
  const tierMult = HOSPITAL_TIER_MULTIPLIERS[input.hospitalCategory] || 1.15;
  const dayMult = scenarioData.dayMultiplier[input.lengthOfStay] || 1.0;

  const totalMultiplier = cityMult * tierMult * dayMult;

  // Round to nearest 500,000 for realistic look
  const rawMin = Math.round((scenarioData.baseMin * totalMultiplier) / 500_000) * 500_000;
  const rawMax = Math.round((scenarioData.baseMax * totalMultiplier) / 500_000) * 500_000;
  const midPoint = Math.round((rawMin + rawMax) / 2);

  // Breakdown based on midPoint
  const breakdown: MedicalCostBreakdown = {
    room: Math.round(midPoint * scenarioData.breakdownPct.room),
    doctor: Math.round(midPoint * scenarioData.breakdownPct.doctor),
    diagnostics: Math.round(midPoint * scenarioData.breakdownPct.diagnostics),
    medication: Math.round(midPoint * scenarioData.breakdownPct.medication),
    procedure: Math.round(midPoint * scenarioData.breakdownPct.procedure),
    other: Math.round(midPoint * scenarioData.breakdownPct.other),
  };

  // Cross-tool emergency fund impact if user has profile data
  let emergencyImpact: MedicalScenarioResult['emergencyImpact'] = undefined;

  if (profile && (profile.monthlyExpenseRange || profile.monthlyExpenseAmount || profile.liquidSavingsAmount || profile.liquidSavingsMonths)) {
    let expense = 8_000_000;
    if (profile.monthlyExpenseAmount) expense = profile.monthlyExpenseAmount;
    else if (profile.monthlyExpenseRange) {
      switch (profile.monthlyExpenseRange) {
        case '<5jt': expense = 4_000_000; break;
        case '5-10jt': expense = 7_500_000; break;
        case '10-20jt': expense = 14_000_000; break;
        case '20-30jt': expense = 24_000_000; break;
        case '>30jt': expense = 38_000_000; break;
      }
    }

    let savings = 35_000_000;
    if (profile.liquidSavingsAmount) savings = profile.liquidSavingsAmount;
    else if (profile.liquidSavingsMonths) {
      let m = 4.5;
      if (profile.liquidSavingsMonths === '<1') m = 0.8;
      else if (profile.liquidSavingsMonths === '1-3') m = 2.0;
      else if (profile.liquidSavingsMonths === '3-6') m = 4.5;
      else if (profile.liquidSavingsMonths === '6-12') m = 8.0;
      else if (profile.liquidSavingsMonths === '12+') m = 14.0;
      savings = Math.round(expense * m);
    }

    const runwayBefore = Math.round((savings / expense) * 10) / 10;
    const savingsAfter = Math.max(0, savings - midPoint);
    const runwayAfter = Math.round((savingsAfter / expense) * 10) / 10;

    emergencyImpact = {
      runwayBefore,
      runwayAfter,
      savingsBefore: savings,
      savingsAfter,
    };
  }

  const riskInsight = 'Risiko finansial terbesar saat terjadi perawatan medis bukan hanya pada kuitansi rumah sakit, melainkan berapa banyak sisa cadangan kas keluarga yang masih bertahan untuk melanjutkan hidup setelah pasien keluar dari rumah sakit.';

  return {
    city: input.city,
    hospitalCategory: input.hospitalCategory,
    scenario: scenarioData.name,
    lengthOfStay: `${input.lengthOfStay} hari`,
    estimatedMin: rawMin,
    estimatedMax: rawMax,
    estimatedMid: midPoint,
    breakdown,
    emergencyImpact,
    riskInsight,
  };
};
