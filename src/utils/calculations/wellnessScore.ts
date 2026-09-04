import { UserProfile, WellnessResult } from '../../types/profile';
import { getScoreCategory } from '../formatters';

export const calculateWellnessScore = (profile: UserProfile): WellnessResult => {
  // Movement subscore (0-100)
  let movement = 50;
  if (profile.activity === '5+') movement = 95;
  else if (profile.activity === '3-4') movement = 82;
  else if (profile.activity === '1-2') movement = 60;
  else movement = 38;

  // Sitting time modifier
  if (profile.sittingTime === '>9') movement = Math.max(25, movement - 15);
  else if (profile.sittingTime === '7-9') movement = Math.max(30, movement - 8);
  else if (profile.sittingTime === '<4') movement = Math.min(100, movement + 5);

  // Sleep subscore (0-100)
  let sleep = 50;
  if (profile.sleep === '7-9') sleep = 92;
  else if (profile.sleep === '6-7') sleep = 78;
  else if (profile.sleep === '5-6') sleep = 55;
  else if (profile.sleep === '<5') sleep = 35;
  else sleep = 70; // >9

  // Nutrition subscore (0-100)
  let nutrition = 50;
  if (profile.nutrition === 'abundant') nutrition = 95;
  else if (profile.nutrition === 'regularly') nutrition = 85;
  else if (profile.nutrition === 'sometimes') nutrition = 62;
  else nutrition = 40;

  // Recovery subscore (0-100) based on morning energy & overwhelm
  let recovery = 60;
  if (profile.morningEnergy === 'optimal') recovery += 20;
  else if (profile.morningEnergy === 'good') recovery += 10;
  else if (profile.morningEnergy === 'average') recovery += 0;
  else if (profile.morningEnergy === 'sluggish') recovery -= 18;

  if (profile.feelingOverwhelmed === 'rarely') recovery += 15;
  else if (profile.feelingOverwhelmed === 'sometimes') recovery += 0;
  else if (profile.feelingOverwhelmed === 'often') recovery -= 15;
  else if (profile.feelingOverwhelmed === 'always') recovery -= 25;
  recovery = Math.max(20, Math.min(100, recovery));

  // Lifestyle subscore (0-100) based on stress & smoking
  let lifestyle = 60;
  if (profile.stress === 'low') lifestyle += 20;
  else if (profile.stress === 'moderate') lifestyle += 10;
  else if (profile.stress === 'high') lifestyle -= 12;
  else if (profile.stress === 'very_high') lifestyle -= 22;

  if (profile.smoking === 'no') lifestyle += 15;
  else if (profile.smoking === 'yes') lifestyle -= 20;
  lifestyle = Math.max(20, Math.min(100, lifestyle));

  // Overall score: weighted average
  const overall = Math.round(
    movement * 0.22 +
    sleep * 0.24 +
    nutrition * 0.18 +
    recovery * 0.18 +
    lifestyle * 0.18
  );

  const meta = getScoreCategory(overall);

  // Determine lowest component
  const components: { key: 'movement' | 'sleep' | 'nutrition' | 'recovery' | 'lifestyle'; label: string; score: number }[] = [
    { key: 'movement', label: 'Gerak & Aktivitas Fisik', score: movement },
    { key: 'sleep', label: 'Durasi & Kualitas Tidur', score: sleep },
    { key: 'nutrition', label: 'Pola Nutrisi Harian', score: nutrition },
    { key: 'recovery', label: 'Energi Pemulihan (Recovery)', score: recovery },
    { key: 'lifestyle', label: 'Manajemen Stres & Kebiasaan', score: lifestyle },
  ];

  components.sort((a, b) => a.score - b.score);
  const lowest = components[0];
  const highest = components[components.length - 1];

  let strength = `${highest.label} (${highest.score}/100) menjadi modal utama kebugaran harianmu saat ini.`;
  let bottleneck = `${lowest.label} (${lowest.score}/100) menjadi penahan utama yang paling membatasi energi dan kebugaranmu.`;

  let highestPotentialImprovement = '';
  switch (lowest.key) {
    case 'movement':
      highestPotentialImprovement = 'Menambahkan jeda berdiri 2 menit tiap jam kerja dan jalan kaki 20 menit per hari akan langsung menaikkan ritme sirkulasi darahmu.';
      break;
    case 'sleep':
      highestPotentialImprovement = 'Menjaga jadwal tidur yang konsisten di jam yang sama meningkatkan proporsi deep sleep tanpa perlu menambah waktu tidur berlebihan.';
      break;
    case 'nutrition':
      highestPotentialImprovement = 'Fokus pada satu perubahan sederhana: pastikan selalu ada sayuran hijau atau buah segar saat jam makan siang.';
      break;
    case 'recovery':
      highestPotentialImprovement = 'Perbaiki transisi malam hari dengan mengurangi stimulasi layar gawai 30 menit sebelum tidur agar bangun pagi lebih segar.';
      break;
    case 'lifestyle':
      highestPotentialImprovement = 'Lakukan latihan pernapasan teratur 5 menit di sela-sela jam kerja sibuk untuk menurunkan aktivitas saraf simpatik (respons stres).';
      break;
  }

  return {
    overallScore: overall,
    category: meta.category,
    categoryLabelId: meta.labelId,
    subscores: {
      movement,
      sleep,
      nutrition,
      recovery,
      lifestyle,
    },
    strength,
    bottleneck,
    highestPotentialImprovement,
    lowestComponent: lowest.key,
  };
};
