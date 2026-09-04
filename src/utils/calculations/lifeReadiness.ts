import { UserProfile, LifeReadinessResult } from '../../types/profile';
import { getScoreCategory } from '../formatters';

export const calculateLifeReadiness = (profile: UserProfile): LifeReadinessResult => {
  // 1. Health Pillar (0-100)
  let health = 50;
  if (profile.activity === '5+') health += 22;
  else if (profile.activity === '3-4') health += 16;
  else if (profile.activity === '1-2') health += 6;
  else health -= 10;

  if (profile.sleep === '7-9') health += 18;
  else if (profile.sleep === '6-7') health += 8;
  else if (profile.sleep === '5-6') health -= 5;
  else if (profile.sleep === '<5') health -= 16;

  if (profile.stress === 'low') health += 10;
  else if (profile.stress === 'high') health -= 8;
  else if (profile.stress === 'very_high') health -= 16;

  health = Math.max(25, Math.min(98, health));

  // 2. Money Pillar (0-100)
  let money = 55;
  if (profile.incomeStability === 'very_stable') money += 20;
  else if (profile.incomeStability === 'quite_stable') money += 10;
  else if (profile.incomeStability === 'variable') money -= 6;
  else if (profile.incomeStability === 'highly_uncertain') money -= 18;

  if (profile.monthlyExpenseRange === '<5jt' || profile.monthlyExpenseRange === '5-10jt') money += 15;
  else if (profile.monthlyExpenseRange === '10-20jt') money += 5;
  else money -= 5;

  money = Math.max(20, Math.min(96, money));

  // 3. Emergency Pillar (0-100)
  let emergency = 40;
  if (profile.liquidSavingsMonths === '12+') emergency = 95;
  else if (profile.liquidSavingsMonths === '6-12') emergency = 86;
  else if (profile.liquidSavingsMonths === '3-6') emergency = 68;
  else if (profile.liquidSavingsMonths === '1-3') emergency = 44;
  else emergency = 22;

  // 4. Family Pillar (0-100)
  let family = 60;
  if (profile.dependents === '0') {
    family = 85;
  } else if (profile.dependents === '1') {
    family = emergency >= 65 ? 78 : 62;
  } else if (profile.dependents === '2') {
    family = emergency >= 70 ? 72 : 54;
  } else {
    family = emergency >= 80 ? 68 : 45;
  }

  if (profile.incomeStability === 'very_stable' || profile.incomeStability === 'quite_stable') {
    family = Math.min(95, family + 8);
  } else {
    family = Math.max(25, family - 10);
  }

  // Overall Score
  const overall = Math.round(
    health * 0.28 +
    money * 0.24 +
    emergency * 0.26 +
    family * 0.22
  );

  const meta = getScoreCategory(overall);

  // Subtitle
  let subtitle = 'Fondasi cukup baik, tetapi ada beberapa area yang perlu diperkuat.';
  if (overall >= 80) subtitle = 'Fondasi hidup dan kesiapan risikomu berada dalam kategori sangat kokoh.';
  else if (overall < 50) subtitle = 'Kondisi saat ini memiliki beberapa titik kerapuhan yang perlu prioritas pembenahan.';

  // Determine weakest pillar
  const pillarScores = [
    { key: 'health' as const, name: 'Kesehatan & Gaya Hidup', score: health },
    { key: 'money' as const, name: 'Stabilitas Arus Kas', score: money },
    { key: 'emergency' as const, name: 'Cadangan Darurat', score: emergency },
    { key: 'family' as const, name: 'Kesiapan Tanggungan Keluarga', score: family },
  ];

  pillarScores.sort((a, b) => a.score - b.score);
  const weakest = pillarScores[0];
  const strongest = pillarScores[pillarScores.length - 1];

  const strengths = [
    `${strongest.name} (${strongest.score}/100) menjadi tiang penopang paling kokoh dalam kesiapan harianmu saat ini.`,
    'Tingkat kesadaranmu untuk melakukan self-assessment berkala adalah indikator penting manajemen risiko pribadi.',
  ];

  const watchAreas = [
    `${weakest.name} (${weakest.score}/100) memerlukan perhatian strategis agar tidak menjadi mata rantai terlemah saat krisis datang.`,
    overall < 70 
      ? 'Korelasi antara kebiasaan fisik dan buffer finansial perlu diperkuat secara beriringan.'
      : 'Pastikan pencapaian fondasi yang baik ini terlindungi dari peristiwa ekstrem tunggal.',
  ];

  let biggestVulnerability = {
    title: 'Ketahanan Dana Darurat (Emergency Resilience)',
    description: 'Cadangan finansial masih cukup sensitif terhadap pengeluaran besar atau jeda pemasukan selama beberapa bulan.',
  };

  if (weakest.key === 'health') {
    biggestVulnerability = {
      title: 'Pemulihan Fisik & Manajemen Tekanan (Health Reserve)',
      description: 'Defisit tidur atau minimnya aktivitas fisik mengurangi daya tahan tubuh jangka panjang terhadap risiko penyakit degeneratif.',
    };
  } else if (weakest.key === 'money') {
    biggestVulnerability = {
      title: 'Diversifikasi & Stabilitas Pendapatan (Cash Flow Risk)',
      description: 'Ketergantungan pada stabilitas arus kas yang berfluktuasi memerlukan buffer likuiditas yang lebih tebal dari rata-rata.',
    };
  } else if (weakest.key === 'family') {
    biggestVulnerability = {
      title: 'Perlindungan Tanggungan Keluarga (Family Dependency)',
      description: 'Kebutuhan masa depan tanggungan keluarga memerlukan rencana kontinuitas jika pencari nafkah utama mengalami hambatan produktif.',
    };
  }

  // Interactive What If Scenarios
  const whatIfScenarios = [
    {
      title: 'A. Pengeluaran Tak Terduga Rp25 Juta',
      description: 'Perbaikan rumah darurat, kendaraan, atau kebutuhan keluarga besar yang wajib diselesaikan segera.',
      impactDescription: emergency >= 70 
        ? 'Dapat diserap dengan aman oleh kas darurat tanpa mengorbankan pos kebutuhan lain.' 
        : 'Akan mengikis sebagian besar kas likuid dan memangkas runway hingga ke batas waspada.',
      severity: emergency >= 70 ? ('low' as const) : ('moderate' as const),
    },
    {
      title: 'B. Tidak Ada Pemasukan Selama 3 Bulan',
      description: 'Jeda pergantian karier, proyek bisnis tertunda, atau masa pemulihan istirahat.',
      impactDescription: profile.liquidSavingsMonths === '6-12' || profile.liquidSavingsMonths === '12+'
        ? 'Bantalan kas likuid mencukupi kebutuhan pokok dengan aman selama masa transisi.'
        : 'Memaksa pengetatan ekstrem gaya hidup atau pencairan aset tabungan masa depan lebih cepat.',
      severity: (profile.liquidSavingsMonths === '6-12' || profile.liquidSavingsMonths === '12+') ? ('low' as const) : ('high' as const),
    },
    {
      title: 'C. Biaya Medis Tak Terduga Rp50 Juta',
      description: 'Rawat inap spesialis, tindakan pembedahan mendadak, atau komplikasi medis akut.',
      impactDescription: 'Satu kejadian medis berbiaya Rp50 juta dapat menghabiskan 50–100% kas darurat rata-rata keluarga muda di Indonesia.',
      severity: 'high' as const,
    },
    {
      title: 'D. Biaya Medis Disertai Gangguan Pemasukan',
      description: 'Kombinasi antara tagihan kuitansi perawatan rumah sakit dan kehilangan pendapatan saat pemulihan.',
      impactDescription: 'Merupakan skenario benturan ganda (double shock) yang paling sering menggoyahkan struktur keuangan jangka panjang.',
      severity: 'high' as const,
    },
  ];

  // 3 Next Steps
  const nextSteps = [
    weakest.key === 'emergency' 
      ? 'Perkuat emergency runway likuid minimal 3–6 bulan di rekening terpisah.'
      : 'Perbaiki area dengan skor terendah untuk menyeimbangkan keempat pilar kesiapan.',
    'Pisahkan instrumen kebutuhan operasional harian dari cadangan proteksi risiko besar.',
    'Review kembali kebiasaan tidur & istirahat mingguan sebagai langkah preventif kesehatan paling hemat biaya.',
  ];

  return {
    overallScore: overall,
    category: meta.category,
    categoryLabelId: meta.labelId,
    subtitle,
    pillars: {
      health,
      money,
      emergency,
      family,
    },
    strengths,
    watchAreas,
    biggestVulnerability,
    whatIfScenarios,
    nextSteps,
    weakestPillar: weakest.key,
  };
};
