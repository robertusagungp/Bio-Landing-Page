import { UserProfile, LifestyleAgeResult } from '../../types/profile';

export const calculateLifestyleAge = (profile: UserProfile): LifestyleAgeResult => {
  // Approximate baseline age from range or exact
  let baseAge = 30;
  if (profile.exactAge) {
    baseAge = profile.exactAge;
  } else if (profile.ageRange) {
    switch (profile.ageRange) {
      case '18-24': baseAge = 22; break;
      case '25-29': baseAge = 27; break;
      case '30-34': baseAge = 32; break;
      case '35-39': baseAge = 37; break;
      case '40-49': baseAge = 44; break;
      case '50+': baseAge = 54; break;
    }
  }

  let ageDelta = 0;
  const contributors: { name: string; impact: 'positive' | 'neutral' | 'negative'; detail: string; weight: number }[] = [];

  // 1. Physical Activity
  if (profile.activity === '5+') {
    ageDelta -= 2.5;
    contributors.push({ name: 'Aktivitas Fisik', impact: 'positive', detail: 'Sangat aktif (5+ hari/minggu), menjaga fungsi kardiovaskular', weight: -2.5 });
  } else if (profile.activity === '3-4') {
    ageDelta -= 1.5;
    contributors.push({ name: 'Aktivitas Fisik', impact: 'positive', detail: 'Konsisten (3-4 hari/minggu), metabolisme terjaga baik', weight: -1.5 });
  } else if (profile.activity === '1-2') {
    ageDelta += 0.5;
    contributors.push({ name: 'Aktivitas Fisik', impact: 'neutral', detail: 'Cukup minim (1-2 hari/minggu), masih ada ruang peningkatan', weight: 0.5 });
  } else {
    ageDelta += 2.0;
    contributors.push({ name: 'Aktivitas Fisik', impact: 'negative', detail: 'Sangat sedikit gerak aktif, memperlambat sirkulasi & metabolisme', weight: 2.0 });
  }

  // 2. Sleep Duration
  if (profile.sleep === '7-9') {
    ageDelta -= 1.5;
    contributors.push({ name: 'Kualitas & Durasi Tidur', impact: 'positive', detail: '7–9 jam optimal untuk regenerasi sel & stabilitas hormon', weight: -1.5 });
  } else if (profile.sleep === '6-7') {
    ageDelta += 0.0;
    contributors.push({ name: 'Kualitas & Durasi Tidur', impact: 'neutral', detail: '6–7 jam cukup wajar, namun mendekati batas bawah pemulihan', weight: 0.0 });
  } else if (profile.sleep === '5-6') {
    ageDelta += 1.5;
    contributors.push({ name: 'Kualitas & Durasi Tidur', impact: 'negative', detail: '5–6 jam tidur menyebabkan akumulasi kelelahan terselubung', weight: 1.5 });
  } else if (profile.sleep === '<5') {
    ageDelta += 3.0;
    contributors.push({ name: 'Kualitas & Durasi Tidur', impact: 'negative', detail: 'Kurang dari 5 jam secara signifikan memicu stres oksidatif sel', weight: 3.0 });
  } else {
    ageDelta += 0.5;
    contributors.push({ name: 'Kualitas & Durasi Tidur', impact: 'neutral', detail: '>9 jam kadang mengindikasikan kualitas tidur kurang dalam', weight: 0.5 });
  }

  // 3. Smoking
  if (profile.smoking === 'no') {
    ageDelta -= 1.0;
    contributors.push({ name: 'Paparan Asap & Rokok', impact: 'positive', detail: 'Bebas dari nikotin & tar, menjaga elastisitas pembuluh darah', weight: -1.0 });
  } else if (profile.smoking === 'yes') {
    ageDelta += 3.0;
    contributors.push({ name: 'Paparan Asap & Rokok', impact: 'negative', detail: 'Merokok aktif mempercepat penuaan endotel pembuluh darah', weight: 3.0 });
  }

  // 4. Nutrition (Fruits / Veggies)
  if (profile.nutrition === 'abundant' || profile.nutrition === 'regularly') {
    ageDelta -= 1.0;
    contributors.push({ name: 'Nutrisi & Serat Alami', impact: 'positive', detail: 'Asupan antioksidan & mikronutrien harian sangat memadai', weight: -1.0 });
  } else if (profile.nutrition === 'sometimes') {
    ageDelta += 0.5;
    contributors.push({ name: 'Nutrisi & Serat Alami', impact: 'neutral', detail: 'Konsumsi serat & mikronutrien belum selalu konsisten harian', weight: 0.5 });
  } else {
    ageDelta += 1.5;
    contributors.push({ name: 'Nutrisi & Serat Alami', impact: 'negative', detail: 'Jarang sayur/buah, defisit antioksidan dan enzim mikrobioma', weight: 1.5 });
  }

  // 5. Stress Level
  if (profile.stress === 'low') {
    ageDelta -= 1.0;
    contributors.push({ name: 'Manajemen Stres & Tekanan', impact: 'positive', detail: 'Tingkat ketenangan baik, level hormon kortisol seimbang', weight: -1.0 });
  } else if (profile.stress === 'moderate') {
    ageDelta += 0.0;
    contributors.push({ name: 'Manajemen Stres & Tekanan', impact: 'neutral', detail: 'Stres harian dalam batas terkendali tanpa gejala fisik akut', weight: 0.0 });
  } else if (profile.stress === 'high') {
    ageDelta += 1.5;
    contributors.push({ name: 'Manajemen Stres & Tekanan', impact: 'negative', detail: 'Tekanan tinggi berkepanjangan memicu beban alostatik tubuh', weight: 1.5 });
  } else if (profile.stress === 'very_high') {
    ageDelta += 2.5;
    contributors.push({ name: 'Manajemen Stres & Tekanan', impact: 'negative', detail: 'Stres sangat tinggi kronis mempercepat degradasi selular', weight: 2.5 });
  }

  const roundedDelta = Math.round(ageDelta * 10) / 10;
  const lifestyleAge = Math.max(18, Math.round(baseAge + roundedDelta));

  // Determine biggest negative contributor or biggest positive
  const sortedByNegative = [...contributors].sort((a, b) => b.weight - a.weight);
  const worstFactor = sortedByNegative[0];

  let biggestImpact = '';
  if (worstFactor && worstFactor.weight > 0.5) {
    biggestImpact = `${worstFactor.name} menjadi faktor yang paling menahan skor kebiasaanmu dan menambah beban usia lifestyle.`;
  } else {
    biggestImpact = 'Pola kebiasaan harianmu secara keseluruhan sangat mendukung kebugaran tubuh lebih muda daripada usia KTP.';
  }

  // Generate 3 actionable small changes
  const smallChanges: string[] = [];
  if (profile.sleep === '<5' || profile.sleep === '5-6') {
    smallChanges.push('Geser jam tidur 30 menit lebih awal malam ini untuk menambah siklus deep sleep.');
  }
  if (profile.activity === '0' || profile.activity === '1-2') {
    smallChanges.push('Mulai target jalan santai 20 menit per hari tanpa perlu ke gym.');
  }
  if (profile.stress === 'high' || profile.stress === 'very_high') {
    smallChanges.push('Sisihkan 10 menit transisi "disconnect" tanpa layar ponsel sebelum tidur malam.');
  }
  if (profile.nutrition === 'rarely' || profile.nutrition === 'sometimes') {
    smallChanges.push('Tambahkan satu porsi buah potong atau sayur segar pada makan siang.');
  }
  if (profile.smoking === 'yes') {
    smallChanges.push('Batasi 2 batang rokok pertama di pagi hari dengan menggantinya segelas air hangat.');
  }
  if (smallChanges.length < 3) {
    smallChanges.push('Jaga hidrasi minimal 2 liter air mineral sepanjang jam kerja produktif.');
  }

  return {
    actualAge: baseAge,
    lifestyleAge,
    differenceYears: Math.round(lifestyleAge - baseAge),
    contributors: contributors.map(({ name, impact, detail }) => ({ name, impact, detail })),
    biggestImpact,
    smallChanges: smallChanges.slice(0, 3),
  };
};
