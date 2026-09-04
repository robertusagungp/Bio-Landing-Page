import { UserProfile, EmergencyRunwayResult } from '../../types/profile';
import { formatRupiah } from '../formatters';

export const calculateEmergencyRunway = (profile: UserProfile): EmergencyRunwayResult => {
  // Resolve monthly expense amount
  let expense = 8_000_000;
  if (profile.monthlyExpenseAmount && profile.monthlyExpenseAmount > 0) {
    expense = profile.monthlyExpenseAmount;
  } else if (profile.monthlyExpenseRange) {
    switch (profile.monthlyExpenseRange) {
      case '<5jt': expense = 4_000_000; break;
      case '5-10jt': expense = 7_500_000; break;
      case '10-20jt': expense = 14_000_000; break;
      case '20-30jt': expense = 24_000_000; break;
      case '>30jt': expense = 38_000_000; break;
    }
  }

  // Resolve liquid savings amount
  let savings = 35_000_000;
  if (profile.liquidSavingsAmount && profile.liquidSavingsAmount > 0) {
    savings = profile.liquidSavingsAmount;
  } else if (profile.liquidSavingsMonths) {
    let monthsMult = 4;
    switch (profile.liquidSavingsMonths) {
      case '<1': monthsMult = 0.8; break;
      case '1-3': monthsMult = 2.0; break;
      case '3-6': monthsMult = 4.5; break;
      case '6-12': monthsMult = 8.0; break;
      case '12+': monthsMult = 14.0; break;
    }
    savings = Math.round(expense * monthsMult);
  }

  const rawRunway = expense > 0 ? savings / expense : 0;
  const runwayMonths = Math.round(rawRunway * 10) / 10;

  let status: 'critical' | 'minimal' | 'adequate' | 'robust' | 'exceptional' = 'adequate';
  let statusLabel = 'Cukup Memadai';

  if (runwayMonths < 2.0) {
    status = 'critical';
    statusLabel = 'Zona Sangat Rentan (<2 bulan)';
  } else if (runwayMonths < 3.5) {
    status = 'minimal';
    statusLabel = 'Buffer Minimal (2–3 bulan)';
  } else if (runwayMonths < 6.0) {
    status = 'adequate';
    statusLabel = 'Fondasi Sehat (3–6 bulan)';
  } else if (runwayMonths < 12.0) {
    status = 'robust';
    statusLabel = 'Sangat Tangguh (6–12 bulan)';
  } else {
    status = 'exceptional';
    statusLabel = 'Buffer Ekstra Kuat (12+ bulan)';
  }

  // Scenarios impact
  const shock25jtSavings = Math.max(0, savings - 25_000_000);
  const shock25jtRunway = Math.round((shock25jtSavings / expense) * 10) / 10;

  const shock50jtSavings = Math.max(0, savings - 50_000_000);
  const shock50jtRunway = Math.round((shock50jtSavings / expense) * 10) / 10;

  const threeMonthsRemaining = Math.max(0, Math.round((runwayMonths - 3) * 10) / 10);
  const sixMonthsRemaining = Math.max(0, Math.round((runwayMonths - 6) * 10) / 10);

  const scenarios = [
    {
      label: 'Kondisi Normal Saat Ini',
      remainingMonths: runwayMonths,
      difference: 0,
      note: 'Daya tahan kas likuid menghadapi pengeluaran rutin tanpa ada tambahan penghasilan.',
    },
    {
      label: 'Kejutan Pengeluaran Mendadak Rp25 Juta',
      remainingMonths: shock25jtRunway,
      difference: Math.round((shock25jtRunway - runwayMonths) * 10) / 10,
      note: `Pengeluaran mendadak memangkas cadangan menjadi ${formatRupiah(shock25jtSavings, true)}.`,
    },
    {
      label: 'Kejutan Medis / Renovasi Darurat Rp50 Juta',
      remainingMonths: shock50jtRunway,
      difference: Math.round((shock50jtRunway - runwayMonths) * 10) / 10,
      note: shock50jtSavings === 0 
        ? 'Pengeluaran ini melampaui seluruh cadangan kas likuid yang tersedia.' 
        : `Runway menyusut drastis ke ${shock50jtRunway} bulan.`,
    },
    {
      label: 'Jeda Pemasukan Selama 3 Bulan Penuh',
      remainingMonths: threeMonthsRemaining,
      difference: -3,
      note: threeMonthsRemaining <= 0 
        ? 'Kas likuid habis sebelum bulan ke-3 tercapai.' 
        : `Setelah 3 bulan bertahan, tersisa buffer aman ${threeMonthsRemaining} bulan.`,
    },
  ];

  let keyInsight = '';
  if (runwayMonths >= 6.0) {
    keyInsight = `Cadangan kasmu (${runwayMonths} bulan) tergolong sangat kokoh untuk kebutuhan rutin. Namun jika terjadi satu pengeluaran besar Rp50 juta, runway berkurang menjadi ${shock50jtRunway} bulan.`;
  } else if (runwayMonths >= 3.0) {
    keyInsight = `Dana daruratmu (${runwayMonths} bulan) cukup untuk kondisi stabil. Tetapi satu goncangan darurat Rp25–50 juta berpotensi menghabiskan sebagian besar bantalan keuanganmu.`;
  } else {
    keyInsight = `Daya tahan kas likuidmu saat ini (${runwayMonths} bulan) membutuhkan prioritas utama. Satu penundaan gaji atau tagihan mendadak akan langsung memberi tekanan pada kebutuhan sehari-hari.`;
  }

  return {
    runwayMonths,
    monthlyExpense: expense,
    liquidSavings: savings,
    status,
    statusLabel,
    scenarios,
    keyInsight,
    calculationBreakdown: {
      formula: 'Emergency Runway (Bulan) = Total Kas Likuid ÷ Pengeluaran Rutin Bulanan',
      assumptions: [
        `Pengeluaran bulanan diestimasi sebesar ${formatRupiah(expense)}`,
        `Total simpanan likuid (tabungan & deposito cair) diestimasi sebesar ${formatRupiah(savings)}`,
        'Asumsi gaya hidup tetap sama selama masa darurat tanpa pemotongan biaya drastis',
        'Belum memperhitungkan potensi likuidasi aset non-kas (reksadana/saham/emas)',
      ],
    },
  };
};
