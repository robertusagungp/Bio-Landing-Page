import { ScoreCategory } from '../types/profile';

export const formatRupiah = (amount: number, compact: boolean = false): string => {
  if (compact) {
    if (amount >= 1_000_000_000) {
      return `Rp${(amount / 1_000_000_000).toFixed(1).replace('.0', '')} Miliar`;
    }
    if (amount >= 1_000_000) {
      return `Rp${(amount / 1_000_000).toFixed(0)} Juta`;
    }
    if (amount >= 1_000) {
      return `Rp${(amount / 1_000).toFixed(0)} Ribu`;
    }
    return `Rp${amount.toLocaleString('id-ID')}`;
  }
  return `Rp${amount.toLocaleString('id-ID')}`;
};

export const getScoreCategory = (score: number): {
  category: ScoreCategory;
  labelId: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  pillColor: string;
} => {
  if (score < 40) {
    return {
      category: 'Needs Attention',
      labelId: 'Perlu Perhatian Khusus',
      colorClass: 'text-terracotta',
      bgClass: 'bg-terracotta/10',
      borderClass: 'border-terracotta/30',
      pillColor: '#D9795F'
    };
  }
  if (score < 60) {
    return {
      category: 'Building Foundation',
      labelId: 'Membangun Fondasi',
      colorClass: 'text-mustard-dark',
      bgClass: 'bg-mustard/15',
      borderClass: 'border-mustard/40',
      pillColor: '#D5A64A'
    };
  }
  if (score < 75) {
    return {
      category: 'Good Foundation',
      labelId: 'Fondasi Cukup Baik',
      colorClass: 'text-teal-brand',
      bgClass: 'bg-teal-brand/10',
      borderClass: 'border-teal-brand/30',
      pillColor: '#174C45'
    };
  }
  if (score < 90) {
    return {
      category: 'Strong',
      labelId: 'Kuat & Terstruktur',
      colorClass: 'text-sage-dark',
      bgClass: 'bg-sage/20',
      borderClass: 'border-sage/40',
      pillColor: '#769B82'
    };
  }
  return {
    category: 'Very Strong',
    labelId: 'Sangat Kuat & Resilien',
    colorClass: 'text-teal-dark',
    bgClass: 'bg-teal-brand/15',
    borderClass: 'border-teal-brand/40',
    pillColor: '#0F342F'
  };
};

const WA_NUMBER = '6287797877931';

export const getWhatsAppLink = (context?: 'life-readiness' | 'financial-health' | 'emergency' | 'lifestyle' | 'medical' | 'family' | 'default'): string => {
  let message = 'Halo Kak Robert, saya baru mencoba salah satu tools di website dan ingin berdiskusi mengenai hasil saya.';
  
  if (context === 'life-readiness') {
    message = 'Halo Kak Robert, saya sudah mencoba Life Readiness Score dan ingin memahami hasil saya lebih lanjut.';
  } else if (context === 'financial-health') {
    message = 'Halo Kak Robert, saya sudah mencoba Financial Health Score dan ingin berdiskusi mengenai hasilnya.';
  } else if (context === 'emergency') {
    message = 'Halo Kak Robert, saya sudah mencoba Emergency Fund Checker dan ingin memahami hasilnya lebih lanjut.';
  } else if (context === 'lifestyle') {
    message = 'Halo Kak Robert, saya sudah mencoba Lifestyle & Wellness Score dan ingin berdiskusi lebih lanjut.';
  } else if (context === 'medical') {
    message = 'Halo Kak Robert, saya sudah mencoba Medical Cost Scenario Simulator dan ingin berdiskusi mengenai ketahanan dana saya.';
  } else if (context === 'family') {
    message = 'Halo Kak Robert, saya sudah mencoba Family Readiness Score dan ingin berdiskusi mengenai kesiapan keluarga.';
  }

  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
};
