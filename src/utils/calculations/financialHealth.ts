import { UserProfile, FinancialHealthResult } from '../../types/profile';
import { getScoreCategory } from '../formatters';

export const calculateFinancialHealth = (profile: UserProfile): FinancialHealthResult => {
  // 1. Cash Flow subscore (based on gap between income and expense)
  let cashFlow = 70;
  const incomeTier = profile.monthlyIncomeRange || '10-20jt';
  const expenseTier = profile.monthlyExpenseRange || '5-10jt';

  // Compare tiers simply
  const tierValue = (t: string) => {
    if (t.includes('<5') || t.includes('<10')) return 1;
    if (t.includes('5-10') || t.includes('10-20')) return 2;
    if (t.includes('10-20') || t.includes('20-35')) return 3;
    if (t.includes('20-30') || t.includes('35-50')) return 4;
    return 5;
  };

  const incVal = tierValue(incomeTier);
  const expVal = tierValue(expenseTier);
  const diff = incVal - expVal;

  if (diff >= 2) cashFlow = 92;
  else if (diff === 1) cashFlow = 80;
  else if (diff === 0) cashFlow = 62;
  else cashFlow = 35; // spending equals or exceeds income

  // 2. Emergency subscore
  let emergency = 50;
  if (profile.liquidSavingsMonths === '12+') emergency = 96;
  else if (profile.liquidSavingsMonths === '6-12') emergency = 88;
  else if (profile.liquidSavingsMonths === '3-6') emergency = 72;
  else if (profile.liquidSavingsMonths === '1-3') emergency = 48;
  else emergency = 22; // <1 month

  // 3. Debt subscore
  let debt = 70;
  if (profile.debtRatio === '<10%') debt = 95;
  else if (profile.debtRatio === '10-30%') debt = 82;
  else if (profile.debtRatio === '30-50%') debt = 52;
  else if (profile.debtRatio === '>50%') debt = 28;

  // 4. Saving Habit subscore
  let savingHabit = 50;
  if (profile.savingHabit === 'aggressive_20_plus') savingHabit = 95;
  else if (profile.savingHabit === 'consistent_10_20') savingHabit = 85;
  else if (profile.savingHabit === 'leftovers') savingHabit = 58;
  else savingHabit = 30; // rarely

  // 5. Resilience subscore (combines dependents, income stability, emergency buffer)
  let resilience = 60;
  if (profile.incomeStability === 'very_stable') resilience += 15;
  else if (profile.incomeStability === 'variable') resilience -= 8;
  else if (profile.incomeStability === 'highly_uncertain') resilience -= 20;

  if (profile.dependents === '0') resilience += 10;
  else if (profile.dependents === '2') resilience -= 8;
  else if (profile.dependents === '3+') resilience -= 15;

  if (emergency >= 80) resilience += 12;
  else if (emergency < 40) resilience -= 15;
  resilience = Math.max(20, Math.min(98, resilience));

  const overall = Math.round(
    cashFlow * 0.22 +
    emergency * 0.26 +
    debt * 0.20 +
    savingHabit * 0.16 +
    resilience * 0.16
  );

  const meta = getScoreCategory(overall);

  // Profile label assignment
  let profileLabel = 'Fondasi Bertumbuh';
  let profileLabelDescription = 'Kondisi keuangan berada dalam fase konstruksi dengan stabilitas harian yang mulai terbentuk.';

  if (cashFlow >= 80 && emergency < 55) {
    profileLabel = 'Cash Flow Kuat, Buffer Darurat Tipis';
    profileLabelDescription = 'Penghasilan bulanan sangat memadai, namun cadangan likuid saat ini masih rentan terhadap pengeluaran besar mendadak.';
  } else if (savingHabit >= 80 && (profile.incomeStability === 'variable' || profile.incomeStability === 'highly_uncertain')) {
    profileLabel = 'Disiplin Menabung, Ketergantungan Arus Kas Tinggi';
    profileLabelDescription = 'Kebiasaan menyisihkan dana sangat baik, namun sumber pemasukan membutuhkan diversifikasi perlindungan ekstra.';
  } else if (overall >= 78) {
    profileLabel = 'Struktur Resilien & Kokoh';
    profileLabelDescription = 'Keseimbangan antara pengeluaran, cadangan darurat, dan rasio utang berada di zona kesehatan finansial yang aman.';
  } else if (emergency < 40 || debt < 40) {
    profileLabel = 'Stabil di Permukaan, Rentan Terhadap Goncangan';
    profileLabelDescription = 'Rutinitas harian berjalan lancar, namun memiliki sensitivitas tinggi jika terjadi keterlambatan penghasilan atau biaya tak terduga.';
  }

  // Stress test scenarios
  let oneMonth: 'green' | 'yellow' | 'red' = 'green';
  let threeMonths: 'green' | 'yellow' | 'red' = 'yellow';
  let sixMonths: 'green' | 'yellow' | 'red' = 'red';

  if (profile.liquidSavingsMonths === '12+') {
    oneMonth = 'green';
    threeMonths = 'green';
    sixMonths = 'green';
  } else if (profile.liquidSavingsMonths === '6-12') {
    oneMonth = 'green';
    threeMonths = 'green';
    sixMonths = 'yellow';
  } else if (profile.liquidSavingsMonths === '3-6') {
    oneMonth = 'green';
    threeMonths = 'yellow';
    sixMonths = 'red';
  } else if (profile.liquidSavingsMonths === '1-3') {
    oneMonth = 'yellow';
    threeMonths = 'red';
    sixMonths = 'red';
  } else {
    oneMonth = 'red';
    threeMonths = 'red';
    sixMonths = 'red';
  }

  const stressExplanation = oneMonth === 'green' && threeMonths === 'green'
    ? 'Buffer kas likuid mampu menahan jeda pemasukan hingga lebih dari satu kuartal tanpa mengganggu gaya hidup dasar.'
    : 'Jeda pemasukan lebih dari 2–3 bulan akan mulai menekan pos belanja primer atau memicu penarikan instrumen jangka panjang.';

  // One deep personalized insight
  let deepInsight = '';
  if (emergency < 50 && (profile.dependents === '2' || profile.dependents === '3+')) {
    deepInsight = 'Dengan tanggungan keluarga, risiko terbesar bukan pada nominal pengeluaran bulanan, melainkan ketiadaan jeda waktu (time buffer) saat ada kebutuhan mendesak anak atau keluarga.';
  } else if (debt < 55) {
    deepInsight = 'Beban cicilan bulanan yang melebihi sepertiga penghasilan mengunci fleksibilitas arus kasmu, sehingga mempersempit ruang gerak jika pendapatan mengalami penundaan.';
  } else if (savingHabit < 50) {
    deepInsight = 'Menabung dari "sisa akhir bulan" biasanya jarang berhasil secara konsisten. Memindahkan 10% di awal tanggal gajian secara otomatis terbukti menggandakan resiliensi tabungan dalam 6 bulan.';
  } else {
    deepInsight = 'Arus kas dan cadanganmu sudah berada di jalur yang sehat. Titik penguatan berikutnya adalah memastikan aset likuid ini terlindungi dari satu kejadian medis atau risiko besar tunggal.';
  }

  return {
    overallScore: overall,
    category: meta.category,
    categoryLabelId: meta.labelId,
    profileLabel,
    profileLabelDescription,
    subscores: {
      cashFlow,
      emergency,
      debt,
      savingHabit,
      resilience,
    },
    stressTest: {
      oneMonth,
      threeMonths,
      sixMonths,
      explanation: stressExplanation,
    },
    deepInsight,
  };
};
