import { UserProfile, HealthChecklistResult } from '../types/profile';

export const evaluateHealthChecklist = (profile: UserProfile): HealthChecklistResult => {
  const keepDoing: string[] = [];
  const worthWatching: string[] = [];
  const worthDiscussing: string[] = [];

  // Activity
  if (profile.activity === '3-4' || profile.activity === '5+') {
    keepDoing.push('Konsistensi aktivitas fisik mingguan sudah sangat baik untuk mendukung metabolisme dan ketahanan kardiovaskular.');
  } else if (profile.activity === '1-2') {
    worthWatching.push('Frekuensi gerak masih di level minimal. Menambah 1–2 sesi jalan cepat atau latihan beban ringan per minggu dapat memberi lonjakan manfaat energi harian.');
  } else if (profile.activity === '0') {
    worthWatching.push('Tingkat aktivitas fisik tergolong sangat minim (sedentary). Memulai dengan kebiasaan jalan 15–20 menit setiap hari sangat disarankan untuk menjaga sensitivitas insulin.');
  }

  // Sleep
  if (profile.sleep === '7-9') {
    keepDoing.push('Durasi tidur 7–9 jam berada di rentang optimal untuk pemulihan seluler, regulasi hormon kortisol, dan konsolidasi memori.');
  } else if (profile.sleep === '<5' || profile.sleep === '5-6') {
    worthWatching.push('Durasi istirahat malam cenderung defisit. Kurang tidur kronis sering kali tidak terasa, namun secara bertahap memengaruhi tekanan darah, imunitas, dan regulasi gula darah.');
  }

  // Nutrition
  if (profile.nutrition === 'regularly' || profile.nutrition === 'abundant') {
    keepDoing.push('Asupan serat, buah, dan sayuran sudah menjadi bagian rutin dari pola makan sehari-hari.');
  } else if (profile.nutrition === 'rarely') {
    worthWatching.push('Konsumsi sayur, buah, dan serat alami masih relatif jarang. Menambah porsi serat di setiap jam makan utama membantu stabilitas kolesterol dan kesehatan mikrobioma usus.');
  }

  // Smoking
  if (profile.smoking === 'no') {
    keepDoing.push('Bebas dari paparan rokok dan nikotin merupakan salah satu proteksi jangka panjang terbesar bagi pembuluh darah dan paru-paru.');
  } else if (profile.smoking === 'yes') {
    worthDiscussing.push('Riwayat merokok aktif: Mungkin bermanfaat untuk mendiskusikan pemeriksaan fungsi paru sederhana (spirometri) atau profil kardiovaskular berkala dengan dokter.');
  }

  // Family history factors
  if (profile.familyHistory === 'yes' && profile.familyConditions && profile.familyConditions.length > 0) {
    if (profile.familyConditions.includes('diabetes')) {
      worthDiscussing.push('Riwayat keluarga dengan Diabetes Melitus: Pertimbangkan untuk memeriksa HbA1c dan Glukosa Darah Puasa secara berkala untuk memantau metabolisme gula lebih dini.');
    }
    if (profile.familyConditions.includes('cardiovascular')) {
      worthDiscussing.push('Riwayat keluarga dengan Hipertensi / Masalah Jantung: Bermanfaat untuk memantau tekanan darah secara teratur dan berdiskusi dengan dokter mengenai profil lipid lengkap.');
    }
    if (profile.familyConditions.includes('cholesterol')) {
      worthDiscussing.push('Riwayat keluarga dengan Dislipidemia / Kolesterol tinggi: Pertimbangkan panel fraksi lipid (Kolesterol Total, LDL, HDL, Trigliserida) pada medical check-up berikutnya.');
    }
    if (profile.familyConditions.includes('cancer')) {
      worthDiscussing.push('Riwayat keluarga dengan Onkologi / Kanker tertentu: Pertimbangkan skrining rutin yang relevan dengan usia dan riwayat keluarga bersama dokter spesialis.');
    }
    if (profile.familyConditions.includes('other')) {
      worthDiscussing.push('Riwayat kesehatan genetik lainnya: Informasikan riwayat keluarga ini kepada dokter saat melakukan medical check-up rutin.');
    }
  } else if (profile.familyHistory === 'yes') {
    worthDiscussing.push('Memiliki riwayat kesehatan keluarga: Membicarakan pola kesehatan keluarga dengan dokter membantu menentukan parameter skrining pencegahan yang paling relevan.');
  }

  // Medical Check Up recency
  if (profile.lastHealthCheck === '<6m' || profile.lastHealthCheck === '6-12m') {
    keepDoing.push('Kebiasaan melakukan pemeriksaan kesehatan berkala (Medical Check-Up) dalam 12 bulan terakhir adalah langkah preventif yang luar biasa.');
  } else if (profile.lastHealthCheck === '>2y' || profile.lastHealthCheck === 'never') {
    worthDiscussing.push('Pemeriksaan lab / check-up umum belum dilakukan dalam 2 tahun terakhir (atau belum pernah): Pertimbangkan paket medical check-up dasar (tekanan darah, profil darah lengkap, gula darah, profil lipid, fungsi ginjal & hati) sebagai baseline kesehatan pribadi.');
  } else if (profile.lastHealthCheck === '1-2y') {
    worthWatching.push('Sudah lebih dari 1 tahun sejak check-up terakhir. Menjadwalkan evaluasi rutin tahunan membantu mendeteksi tren perubahan parameter tubuh sebelum menjadi keluhan.');
  }

  // Age specific considerations
  if (profile.ageRange === '35-39' || profile.ageRange === '40-49' || profile.ageRange === '50+') {
    worthWatching.push('Memasuki usia 35+: Metabolisme basal mulai melambat dan massa otot menurun secara alami. Latihan kekuatan otot (resistance training) 2x seminggu menjadi prioritas penting selain kardio.');
  }

  // Fallbacks if lists are sparse
  if (keepDoing.length === 0) {
    keepDoing.push('Langkah awal untuk mulai mengamati pola kebiasaan harian secara sadar dan objektif.');
  }
  if (worthWatching.length === 0) {
    worthWatching.push('Pertahankan keseimbangan antara beban kerja dan waktu pemulihan (recovery) agar tidak terjadi kelelahan kumulatif.');
  }
  if (worthDiscussing.length === 0) {
    worthDiscussing.push('Pemeriksaan fisik tahunan standar bersama dokter untuk memvalidasi tekanan darah dan parameter metabolik rutin.');
  }

  return {
    keepDoing,
    worthWatching,
    worthDiscussing,
    disclaimer: 'Informasi ini bersifat edukatif dan bukan diagnosis, rekomendasi medis pribadi, atau pengganti konsultasi dengan tenaga kesehatan. Interpretasi hasil laboratorium dan tindakan medis selalu memerlukan evaluasi dokter yang berwenang.',
  };
};
