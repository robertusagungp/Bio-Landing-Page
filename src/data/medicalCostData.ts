export interface MedicalCostEntry {
  min: number;
  max: number;
  breakdownPct: {
    room: number;
    doctor: number;
    diagnostics: number;
    medication: number;
    procedure: number;
    other: number;
  };
}

export interface CityCostMultiplier {
  [city: string]: number;
}

export const CITY_MULTIPLIERS: CityCostMultiplier = {
  'Jakarta': 1.25,
  'Surabaya': 1.10,
  'Bandung': 1.05,
  'Medan': 1.00,
  'Kota Lainnya': 0.90,
};

export const HOSPITAL_TIER_MULTIPLIERS: { [tier: string]: number } = {
  'basic_private': 0.85,    // Swasta Tipe C / Standar
  'mid_private': 1.15,      // Swasta Tipe B / Menengah Populer
  'premium_private': 1.65,  // Swasta Kelas A / Internasional
};

export const BASE_SCENARIOS_DATA: {
  [scenarioKey: string]: {
    name: string;
    description: string;
    baseMin: number;
    baseMax: number;
    dayMultiplier: { [stayRange: string]: number };
    breakdownPct: {
      room: number;
      doctor: number;
      diagnostics: number;
      medication: number;
      procedure: number;
      other: number;
    };
  };
} = {
  'mild_inpatient': {
    name: 'Rawat Inap Ringan (DB / Tifus / Gastroenteritis)',
    description: 'Perawatan medis umum dengan observasi cairan, cek laboratorium berkala, dan obat injeksi.',
    baseMin: 7_000_000,
    baseMax: 16_000_000,
    dayMultiplier: {
      '1-2': 0.65,
      '3-5': 1.0,
      '6-10': 1.7,
      '10+': 2.4,
    },
    breakdownPct: {
      room: 0.25,
      doctor: 0.15,
      diagnostics: 0.20,
      medication: 0.30,
      procedure: 0.05,
      other: 0.05,
    },
  },
  'simple_surgery': {
    name: 'Operasi Sederhana / Sedang (Apendiks / Hernia / Batu Empedu)',
    description: 'Tindakan bedah terencana atau darurat dengan anestesi, ruang operasi, dan pemulihan pasca tindakan.',
    baseMin: 22_000_000,
    baseMax: 48_000_000,
    dayMultiplier: {
      '1-2': 0.80,
      '3-5': 1.0,
      '6-10': 1.5,
      '10+': 2.1,
    },
    breakdownPct: {
      room: 0.18,
      doctor: 0.22,
      diagnostics: 0.15,
      medication: 0.15,
      procedure: 0.25,
      other: 0.05,
    },
  },
  'serious_inpatient': {
    name: 'Perawatan Serius / ICU / Komplikasi Akut',
    description: 'Kondisi membutuhkan pemantauan intensif (ICU/HCU), peralatan penunjang hidup, dan visit multi-spesialis.',
    baseMin: 55_000_000,
    baseMax: 120_000_000,
    dayMultiplier: {
      '1-2': 0.60,
      '3-5': 1.0,
      '6-10': 1.8,
      '10+': 2.7,
    },
    breakdownPct: {
      room: 0.28,
      doctor: 0.20,
      diagnostics: 0.18,
      medication: 0.22,
      procedure: 0.07,
      other: 0.05,
    },
  },
  'major_treatment': {
    name: 'Tindakan Kritis / Bedah Jantung / Onkologi Awal',
    description: 'Tindakan invasif kompleks dengan tim bedah khusus, alat medis canggih, dan terapi intensif bertahap.',
    baseMin: 120_000_000,
    baseMax: 280_000_000,
    dayMultiplier: {
      '1-2': 0.70,
      '3-5': 1.0,
      '6-10': 1.6,
      '10+': 2.3,
    },
    breakdownPct: {
      room: 0.15,
      doctor: 0.25,
      diagnostics: 0.15,
      medication: 0.15,
      procedure: 0.25,
      other: 0.05,
    },
  },
};
