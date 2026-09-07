import { ProtectionGapResult } from '../../types/profile';

export interface ProtectionGapInputs {
  emergency_status?: string;
  dependents_status?: string;
  office_coverage?: string;
  personal_protection?: string;
  income_dependency?: string;
  major_medical_exposure?: string;
}

export function calculateProtectionGap(inputs: ProtectionGapInputs): ProtectionGapResult {
  const {
    emergency_status = '1-3 bln',
    dependents_status = 'spouse_kids',
    office_coverage = 'bpjs_only',
    personal_protection = 'none',
    income_dependency = 'single_earner',
    major_medical_exposure = 'moderate',
  } = inputs;

  // 1. Emergency Fund Resilience (0 - 25)
  let emergencyScore = 15;
  if (emergency_status === '<1 bln') emergencyScore = 5;
  else if (emergency_status === '1-3 bln') emergencyScore = 12;
  else if (emergency_status === '3-6 bln') emergencyScore = 20;
  else if (emergency_status === '6+ bln') emergencyScore = 25;

  // 2. Medical Expense Coverage (0 - 25)
  let medicalScore = 10;
  if (office_coverage === 'office_comprehensive' || personal_protection === 'private_comprehensive') {
    medicalScore = 25;
  } else if (office_coverage === 'office_standard' || personal_protection === 'private_traditional') {
    medicalScore = 18;
  } else if (office_coverage === 'bpjs_only' || personal_protection === 'bpjs_active') {
    medicalScore = 14;
  } else {
    medicalScore = 4;
  }

  // Adjust medical score by exposure
  if (major_medical_exposure === 'high' && medicalScore < 22) {
    medicalScore = Math.max(4, medicalScore - 4);
  }

  // 3. Income Interruption & Family Continuity (0 - 25)
  let familyScore = 15;
  if (dependents_status === 'none' || income_dependency === 'no_dependents') {
    familyScore = 25; // No dependents means low income continuity pressure
  } else if (income_dependency === 'passive_exists') {
    familyScore = 22;
  } else if (income_dependency === 'dual_equal') {
    familyScore = 18;
  } else {
    // single earner
    if (dependents_status === 'large_family') {
      familyScore = 6;
    } else if (dependents_status === 'spouse_kids') {
      familyScore = 10;
    } else {
      familyScore = 13;
    }
  }

  // 4. Independence from Employer (0 - 25)
  let independenceScore = 12;
  if (personal_protection === 'private_comprehensive') {
    independenceScore = 25;
  } else if (personal_protection === 'private_traditional') {
    independenceScore = 18;
  } else if (office_coverage === 'none' && personal_protection === 'none') {
    independenceScore = 3;
  } else {
    // Relies purely on office
    independenceScore = 10;
  }

  const overallScore = Math.min(100, emergencyScore + medicalScore + familyScore + independenceScore);

  // Status calculation
  let status: 'safe' | 'moderate_gap' | 'high_gap' | 'critical_gap' = 'moderate_gap';
  let statusLabel = 'Ada Gap Menengah';
  let summary = '';
  let whyExplanation = '';
  let isAdequatelyProtected = false;
  let neutralNote = '';

  if (overallScore >= 80) {
    status = 'safe';
    statusLabel = 'Fondasi Proteksi Solid';
    isAdequatelyProtected = true;
    summary = 'Kondisi proteksimu saat ini sudah cukup kokoh. Mayoritas risiko harian dan medis tercover dengan baik.';
    whyExplanation = 'Kamu memiliki cadangan kas darurat yang sehat didukung oleh jaring pengaman medis yang memadai. Beban tanggungan dan ketergantungan income juga terkontrol dengan baik.';
    neutralNote = 'Transparan & Jujur: Berdasarkan profil ini, kamu TIDAK mendesak membutuhkan produk proteksi tambahan. Cukup rawat dana darurat dan review polis yang ada secara berkala.';
  } else if (overallScore >= 60) {
    status = 'moderate_gap';
    statusLabel = 'Buffer Aman, Ada Sedikit Celah';
    summary = 'Fondasi dasarmu sudah berjalan, namun masih ada celah jika terjadi risiko kesehatan berbiaya besar atau jeda karir.';
    whyExplanation = 'Jaring pengamanmu saat ini sebagian besar bergantung pada fasilitas kantor atau BPJS. Jika terjadi perpindahan kerja atau tindakan medis khusus di luar plafon kantor, tabungan pribadimu berpotensi tergerus.';
    neutralNote = 'Prioritasmu adalah memperkuat dana darurat hingga 6 bulan pengeluaran sebelum mempertimbangkan proteksi komplementer.';
  } else if (overallScore >= 40) {
    status = 'high_gap';
    statusLabel = 'Ada Gap Proteksi Signifikan';
    summary = 'Terdapat kerentanan finansial yang nyata bila pencari nafkah sakit kritis atau pemasukan terhenti mendadak.';
    whyExplanation = 'Keluarga memiliki ketergantungan tinggi pada satu sumber nafkah, sementara buffer kas dan jaring pengaman kesehatan mandiri masih terbatas di bawah potensi risiko biaya nyata.';
    neutralNote = 'Risiko terbesar bukan biaya sehari-hari, melainkan biaya medis tak terduga (>Rp 50jt) yang bisa langsung menguras tabungan keluarga.';
  } else {
    status = 'critical_gap';
    statusLabel = 'Zona Sangat Rentan terhadap Kejutan Hidup';
    summary = 'Hampir seluruh risiko hidup saat ini ditanggung langsung oleh kas harian yang sangat terbatas.';
    whyExplanation = 'Ketiadaan dana darurat dan proteksi mandiri membuat kondisi keuangan keluarga sangat rapuh terhadap satu kejadian medis mendadak atau kehilangan mata pencaharian.';
    neutralNote = 'Langkah pertama tidak harus membeli asuransi mahal. Mulai dengan mengaktifkan BPJS Kesehatan dan mengamankan kas darurat 1 bulan pertama.';
  }

  // Pillar evaluations
  const vulnerabilityPillars = [
    {
      name: 'Kekuatan Kas Darurat Mandiri',
      score: emergencyScore,
      level: (emergencyScore >= 20 ? 'Aman' : emergencyScore >= 12 ? 'Waspada' : 'Kritis') as 'Aman' | 'Waspada' | 'Kritis',
      description:
        emergencyScore >= 20
          ? 'Mampu menyerap pengeluaran mendadak skala kecil hingga menengah tanpa berutang.'
          : 'Buffer kas darurat berpotensi habis dalam 1–2 bulan bila terjadi pengeluaran tidak terduga.',
    },
    {
      name: 'Perlindungan Biaya Medis Besar',
      score: medicalScore,
      level: (medicalScore >= 20 ? 'Aman' : medicalScore >= 14 ? 'Waspada' : 'Kritis') as 'Aman' | 'Waspada' | 'Kritis',
      description:
        medicalScore >= 20
          ? 'Tercakup oleh plafon kesehatan yang memadai atau asuransi murni sesuai tagihan.'
          : 'Risiko selisih biaya (out-of-pocket) masih tinggi jika terjadi rawat inap atau tindakan bedah spesialis.',
    },
    {
      name: 'Kesinambungan Nafkah Keluarga',
      score: familyScore,
      level: (familyScore >= 20 ? 'Aman' : familyScore >= 12 ? 'Waspada' : 'Kritis') as 'Aman' | 'Waspada' | 'Kritis',
      description:
        familyScore >= 20
          ? 'Keluarga memiliki diversifikasi nafkah atau tidak memiliki ketergantungan tunggal yang berat.'
          : 'Keluarga sangat bergantung pada satu sumber income; risiko tinggi bila terjadi interupsi nafkah.',
    },
    {
      name: 'Independensi dari Fasilitas Kantor',
      score: independenceScore,
      level: (independenceScore >= 20 ? 'Aman' : independenceScore >= 12 ? 'Waspada' : 'Kritis') as 'Aman' | 'Waspada' | 'Kritis',
      description:
        independenceScore >= 20
          ? 'Memiliki jaring pengaman mandiri yang tetap aktif meskipun resign, pensiun, atau berganti profesi.'
          : 'Sangat bergantung pada kantor. Begitu masa kerja berakhir, seluruh jaring pengaman langsung nonaktif.',
    },
  ];

  // Actionable objective recommendations
  const recommendations = [];

  if (emergencyScore < 20) {
    recommendations.push({
      priority: 'high' as const,
      title: 'Bangun Tabungan Darurat ke Level 3–6 Bulan',
      description: 'Ini adalah benteng pertahanan lapis pertama untuk risiko-risiko rutin skala Rp 2–10 juta.',
      suitableVehicle: 'Tabungan likuid terpisah / Reksadana Pasar Uang',
    });
  }

  if (medicalScore < 20) {
    recommendations.push({
      priority: (emergencyScore < 12 ? 'medium' : 'high') as const,
      title: 'Tutup Risiko Biaya Medis Katastropik (>Rp 50–100 Juta)',
      description: 'Pastikan BPJS selalu aktif, dan evaluasi proteksi rawat inap murni (as-charged) agar kas tidak terkuras saat sakit berat.',
      suitableVehicle: 'BPJS Kesehatan Mandiri + Asuransi Kesehatan Murni Sesuai Tagihan',
    });
  }

  if (familyScore < 18 && dependents_status !== 'none') {
    recommendations.push({
      priority: 'high' as const,
      title: 'Amankan Pengganti Nafkah untuk Tanggungan (Uang Pertanggungan)',
      description: 'Jika kamu pencari nafkah utama, pastikan keluarga memiliki buffer biaya hidup minimal 3–5 tahun jika terjadi risiko tutup usia.',
      suitableVehicle: 'Asuransi Jiwa Berjangka (Term Life) murni berbiaya terjangkau',
    });
  }

  if (isAdequatelyProtected) {
    recommendations.push({
      priority: 'low' as const,
      title: 'Audit Polis dan Porsi Investasi Berkala',
      description: 'Pertahankan disiplin arus kas dan tinjau ulang proteksi hanya jika ada perubahan signifikan (misal: lahir anak baru atau kenaikan cicilan).',
      suitableVehicle: 'Review berkala 1x setahun',
    });
  }

  return {
    overallScore,
    status,
    statusLabel,
    summary,
    whyExplanation,
    vulnerabilityPillars,
    recommendations,
    isAdequatelyProtected,
    neutralNote,
  };
}
