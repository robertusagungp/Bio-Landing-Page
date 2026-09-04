import { UserProfile, FamilyReadinessResult } from '../../types/profile';
import { getScoreCategory } from '../formatters';

export const calculateFamilyReadiness = (profile: UserProfile): FamilyReadinessResult => {
  // 1. Daily Needs subscore
  let dailyNeeds = 65;
  if (profile.monthlyExpenseRange === '<5jt' || profile.monthlyExpenseRange === '5-10jt') dailyNeeds = 80;
  else if (profile.monthlyExpenseRange === '10-20jt') dailyNeeds = 70;
  else dailyNeeds = 60;

  // 2. Emergency subscore
  let emergency = 50;
  if (profile.liquidSavingsMonths === '12+') emergency = 95;
  else if (profile.liquidSavingsMonths === '6-12') emergency = 85;
  else if (profile.liquidSavingsMonths === '3-6') emergency = 70;
  else if (profile.liquidSavingsMonths === '1-3') emergency = 45;
  else emergency = 25;

  // 3. Income Backup subscore
  let incomeBackup = 50;
  if (profile.householdIncomeSources === 'multiple') incomeBackup = 92;
  else if (profile.householdIncomeSources === 'dual') incomeBackup = 78;
  else incomeBackup = 45; // single earner

  if (profile.primaryIncomeStop6Months === 'other_sufficient') incomeBackup = Math.min(100, incomeBackup + 15);
  else if (profile.primaryIncomeStop6Months === 'no_other_income') incomeBackup = Math.max(20, incomeBackup - 20);

  // 4. Dependents subscore (more dependents = higher readiness requirement)
  let dependentsScore = 70;
  if (profile.dependents === '0') dependentsScore = 95;
  else if (profile.dependents === '1') dependentsScore = 80;
  else if (profile.dependents === '2') dependentsScore = 65;
  else dependentsScore = 50; // 3+

  // 5. Flexibility subscore
  let flexibility = 60;
  if (emergency >= 70 && incomeBackup >= 65) flexibility = 88;
  else if (emergency >= 50 || incomeBackup >= 60) flexibility = 68;
  else flexibility = 40;

  const overall = Math.round(
    dailyNeeds * 0.18 +
    emergency * 0.26 +
    incomeBackup * 0.26 +
    dependentsScore * 0.15 +
    flexibility * 0.15
  );

  const meta = getScoreCategory(overall);

  // Strongest and biggest dependency
  let strongestPoint = 'Komitmen pemenuhan kebutuhan primer keluarga berjalan secara tertib.';
  if (emergency >= 80) strongestPoint = 'Cadangan kas darurat yang solid menjadi peredam kejut pertama yang sangat bisa diandalkan.';
  else if (incomeBackup >= 75) strongestPoint = 'Diversifikasi sumber pemasukan rumah tangga memberi rasa tenang jika salah satu penghasilan tertahan.';
  else if (profile.dependents === '0' || profile.dependents === '1') strongestPoint = 'Struktur tanggungan keluarga yang terukur menjaga beban kebutuhan tetap gesit.';

  let biggestDependency = 'Stabilitas pendapatan pencari nafkah utama.';
  if (incomeBackup < 55) {
    biggestDependency = 'Ketergantungan penuh pada satu pencari nafkah (single earner) tanpa penyangga pemasukan alternatif.';
  } else if (emergency < 50) {
    biggestDependency = 'Bantalan kas darurat keluarga yang masih terbatas untuk menahan jeda kebutuhan lebih dari 90 hari.';
  }

  // Interruption timeline (Months 1, 3, 6, 9, 12)
  type TimelineStatus = 'Strong' | 'Manageable' | 'Tight' | 'Vulnerable';
  const getTimelineStatus = (month: number): { status: TimelineStatus; note: string } => {
    let runwayMonths = 3.5;
    if (profile.liquidSavingsMonths === '12+') runwayMonths = 12;
    else if (profile.liquidSavingsMonths === '6-12') runwayMonths = 8;
    else if (profile.liquidSavingsMonths === '3-6') runwayMonths = 4.5;
    else if (profile.liquidSavingsMonths === '1-3') runwayMonths = 2;
    else if (profile.liquidSavingsMonths === '<1') runwayMonths = 0.8;

    const hasBackup = profile.primaryIncomeStop6Months === 'other_sufficient' || profile.householdIncomeSources === 'multiple';
    const effectiveRunway = hasBackup ? runwayMonths * 1.6 : runwayMonths;

    if (month <= effectiveRunway * 0.6) {
      return { status: 'Strong', note: 'Kas operasional keluarga aman, gaya hidup berjalan seperti biasa.' };
    }
    if (month <= effectiveRunway) {
      return { status: 'Manageable', note: 'Mulai perlu penyesuaian belanja diskresioner dan penghematan pos sekunder.' };
    }
    if (month <= effectiveRunway + 2) {
      return { status: 'Tight', note: 'Cadangan kas mendekati batas kritis, kebutuhan primer mulai terpangkas.' };
    }
    return { status: 'Vulnerable', note: 'Keluarga berada di zona defisit dan membutuhkan bantuan likuiditas eksternal.' };
  };

  const interruptionTimeline = [
    { month: 1, ...getTimelineStatus(1) },
    { month: 3, ...getTimelineStatus(3) },
    { month: 6, ...getTimelineStatus(6) },
    { month: 9, ...getTimelineStatus(9) },
    { month: 12, ...getTimelineStatus(12) },
  ];

  const riskEducation = [
    'Bantalan Kas Darurat Likuid (3–12 bulan pengeluaran keluarga di rekening terpisah)',
    'Diversifikasi Arus Kas (pendapatan pasangan, bisnis sampingan, atau passive income)',
    'Aset Investasi yang Dapat Dicairkan Bertahap',
    'Manfaat Tunjangan Kesehatan & Ketenagakerjaan dari Kantor/Pemberi Kerja',
    'Proteksi Finansial Terstruktur (untuk risiko besar yang tidak sanggup ditanggung kas biasa)',
  ];

  return {
    overallScore: overall,
    category: meta.category,
    categoryLabelId: meta.labelId,
    subscores: {
      dailyNeeds,
      emergency,
      incomeBackup,
      dependents: dependentsScore,
      flexibility,
    },
    strongestPoint,
    biggestDependency,
    interruptionTimeline,
    riskEducation,
  };
};
