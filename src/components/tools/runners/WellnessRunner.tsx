import React, { useState } from 'react';
import { 
  UserProfile, 
  WellnessResult, 
  ActiveToolId, 
  SittingTime, 
  MorningEnergy, 
  OverwhelmedFreq 
} from '../../../types/profile';
import { calculateWellnessScore } from '../../../utils/calculations/wellnessScore';
import { updateStoredProfile, updateStoredResults } from '../../../utils/storage';
import { QuestionRunner, QuestionStep } from '../QuestionRunner';
import { ResultWrapper } from '../ResultWrapper';
import { ScoreRing } from '../ScoreRing';
import { ScoreBar } from '../ScoreBar';
import { CalculationAccordion } from '../CalculationAccordion';
import { Sparkles, Trophy, AlertCircle, ArrowUpRight } from 'lucide-react';

interface WellnessRunnerProps {
  initialProfile: UserProfile;
  savedResult?: WellnessResult;
  onNavigateToTool: (toolId: ActiveToolId) => void;
  onClose: () => void;
}

export const WellnessRunner: React.FC<WellnessRunnerProps> = ({
  initialProfile,
  savedResult,
  onNavigateToTool,
  onClose,
}) => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [result, setResult] = useState<WellnessResult | null>(savedResult || null);
  const [stepIndex, setStepIndex] = useState(0);

  // Dynamic question list: reuses activity, sleep, nutrition, stress from profile if already filled!
  const questions: QuestionStep[] = [];

  if (!profile.activity) {
    questions.push({
      id: 'activity',
      title: 'Berapa hari dalam seminggu kamu berolahraga / aktif bergerak?',
      subtitle: 'Minimal 30 menit jalan cepat, lari, sepeda, atau latihan kekuatan.',
      options: [
        { label: '0 hari (Sedentary / Jarang bergerak)', value: '0', icon: '🛋️' },
        { label: '1 – 2 hari per minggu', value: '1-2', icon: '🚶' },
        { label: '3 – 4 hari per minggu', value: '3-4', icon: '🏃' },
        { label: '5+ hari per minggu', value: '5+', icon: '⚡' },
      ],
    });
  }

  if (!profile.sleep) {
    questions.push({
      id: 'sleep',
      title: 'Berapa rata-rata jam tidur malammu?',
      subtitle: 'Menentukan efektivitas pemulihan sel dan hormon stres.',
      options: [
        { label: 'Kurang dari 5 jam', value: '<5', icon: '🥱' },
        { label: '5 – 6 jam', value: '5-6', icon: '⏰' },
        { label: '6 – 7 jam', value: '6-7', icon: '🌙' },
        { label: '7 – 9 jam (Ideal)', value: '7-9', icon: '✨' },
        { label: 'Lebih dari 9 jam', value: '>9', icon: '🛌' },
      ],
    });
  }

  // Wellness-specific questions:
  questions.push({
    id: 'sittingTime',
    title: 'Berapa total waktu kamu duduk dalam satu hari kerja?',
    subtitle: 'Waktu duduk lama tanpa jeda berdampak pada sirkulasi vena dan postur otot.',
    options: [
      { label: 'Kurang dari 4 jam', value: '<4', description: 'Banyak berdiri dan mobilitas aktif', icon: '🚶‍♂️' },
      { label: '4 – 6 jam', value: '4-6', description: 'Duduk wajar dengan jeda gerak berkala', icon: '🪑' },
      { label: '7 – 9 jam', value: '7-9', description: 'Pekerjaan meja kantor standar', icon: '💻' },
      { label: 'Lebih dari 9 jam', value: '>9', description: 'Hampir seluruh hari dihabiskan di depan layar', icon: '🖥️' },
    ],
  });

  questions.push({
    id: 'morningEnergy',
    title: 'Bagaimana tingkat energimu saat bangun tidur di pagi hari?',
    subtitle: 'Kualitas tidur lebih tercermin dari kesegaran saat bangun daripada jam di alarm.',
    options: [
      { label: 'Lesu & Sulit Bangun (Sluggish)', value: 'sluggish', description: 'Masih merasa mengantuk berat dan letih', icon: '😴' },
      { label: 'Biasa Saja / Butuh Kafein', value: 'average', description: 'Cukup fungsional setelah minum kopi/teh', icon: '☕' },
      { label: 'Cukup Segar & Bugar', value: 'good', description: 'Siap memulai aktivitas tanpa kelelahan berarti', icon: '🌤️' },
      { label: 'Sangat Berenergi & Segar Optimal', value: 'optimal', description: 'Bangun dengan tubuh ringan dan pikiran jernih', icon: '☀️' },
    ],
  });

  questions.push({
    id: 'feelingOverwhelmed',
    title: 'Seberapa sering kamu merasa kewalahan (overwhelmed) dalam seminggu?',
    subtitle: 'Mengukur kapasitas pemulihan mental terhadap tuntutan harian.',
    options: [
      { label: 'Hampir tidak pernah', value: 'rarely', description: 'Mampu memprioritaskan dan tetap tenang', icon: '🧘' },
      { label: 'Kadang-kadang (1-2x seminggu)', value: 'sometimes', description: 'Beban kerja wajar yang bisa diselesaikan', icon: '📝' },
      { label: 'Cukup sering (3-4x seminggu)', value: 'often', description: 'Merasa kejar-kejaran dengan deadline dan target', icon: '⌛' },
      { label: 'Hampir setiap hari', value: 'always', description: 'Beban mental terasa menumpuk tanpa henti', icon: '🌊' },
    ],
  });

  const currentSelectedValues: { [key: string]: string } = {
    activity: profile.activity || '',
    sleep: profile.sleep || '',
    sittingTime: profile.sittingTime || '',
    morningEnergy: profile.morningEnergy || '',
    feelingOverwhelmed: profile.feelingOverwhelmed || '',
  };

  const handleSelectOption = (questionId: string, value: string) => {
    const updated = {
      ...profile,
      [questionId]: value,
    };
    setProfile(updated);
    updateStoredProfile(updated);

    if (stepIndex < questions.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      const finalResult = calculateWellnessScore(updated);
      setResult(finalResult);
      updateStoredResults({
        wellness: finalResult,
        lastCompletedTool: 'wellness-score',
      });
    }
  };

  if (!result) {
    return (
      <QuestionRunner
        toolTitle="Wellness Score"
        toolCategory="Daily Vitality"
        questions={questions}
        currentStepIndex={stepIndex}
        selectedValues={currentSelectedValues}
        onSelectOption={handleSelectOption}
        onBack={() => setStepIndex(Math.max(0, stepIndex - 1))}
        onCancel={onClose}
      />
    );
  }

  return (
    <ResultWrapper
      toolTitle="Wellness Score"
      scoreNumber={result.overallScore}
      scoreElement={
        <ScoreRing
          score={result.overallScore}
          label="Wellness Score"
          sublabel="Indeks Vitalitas & Kebiasaan"
        />
      }
      meaning="Skor kebugaran harianmu mencerminkan keseimbangan antara gerak fisik, kualitas istirahat, dan ritme pemulihan energi."
      whyExplanation={result.bottleneck}
      actionTitle="Peluang Peningkatan Terbesar (Highest Potential)"
      actionItems={[
        result.highestPotentialImprovement,
        'Jadwalkan jeda peregangan ringan 2 menit setiap 60 menit duduk bekerja.',
        'Tetapkan waktu cutoff konsumsi kafein maksimal pukul 14.00 siang agar kualitas deep sleep malam tidak terganggu.'
      ]}
      recommendedTool={{
        id: 'financial-health',
        title: 'Seberapa Sehat Keuanganmu?',
        description: 'Kesehatan fisik terjaga paling baik saat didukung oleh struktur finansial yang bebas dari kecemasan mendadak.',
        buttonLabel: 'Cek Financial Health Score →',
      }}
      onSelectRecommendedTool={onNavigateToTool}
      onRetake={() => {
        setResult(null);
        setStepIndex(0);
      }}
      contextWaKey="lifestyle"
      pillarsForShare={[
        { name: 'Gerak (Movement)', score: result.subscores.movement },
        { name: 'Tidur (Sleep)', score: result.subscores.sleep },
        { name: 'Nutrisi (Nutrition)', score: result.subscores.nutrition },
        { name: 'Pemulihan (Recovery)', score: result.subscores.recovery },
        { name: 'Gaya Hidup (Lifestyle)', score: result.subscores.lifestyle },
      ]}
    >
      {/* 5 Subscores Breakdown */}
      <div className="bg-background/80 p-5 rounded-card border border-border/80 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border/60">
          <span className="text-xs font-bold text-foreground">
            5 Dimensi Kebugaran & Kebiasaan
          </span>
          <span className="text-[10px] text-muted">Skala 0 – 100</span>
        </div>

        <ScoreBar
          label="Gerak & Aktivitas Fisik (Movement)"
          score={result.subscores.movement}
          subtext="Frekuensi olahraga mingguan dikurangi beban waktu duduk lama"
        />

        <ScoreBar
          label="Kualitas & Durasi Istirahat (Sleep)"
          score={result.subscores.sleep}
          subtext="Waktu pemulihan optimal untuk regulasi sirkadian"
        />

        <ScoreBar
          label="Nutrisi & Mikronutrien (Nutrition)"
          score={result.subscores.nutrition}
          subtext="Konsumsi sayur, buah segar, dan serat antioksidan"
        />

        <ScoreBar
          label="Kapasitas Pemulihan (Recovery)"
          score={result.subscores.recovery}
          subtext="Kesegaran energi pagi dan ketahanan terhadap overwhelm mental"
        />

        <ScoreBar
          label="Keseimbangan Ritme Hidup (Lifestyle)"
          score={result.subscores.lifestyle}
          subtext="Tingkat kontrol stres dan kebebasan dari zat adiktif"
        />
      </div>

      {/* Strength & Bottleneck Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="p-4 rounded-card bg-sage/10 border border-sage/30 text-xs leading-relaxed">
          <div className="font-bold text-sage-dark flex items-center gap-1.5 mb-1.5">
            <Trophy className="w-4 h-4" />
            Modal Terkuatmu (Strength)
          </div>
          <p className="text-foreground/90">{result.strength}</p>
        </div>

        <div className="p-4 rounded-card bg-terracotta/10 border border-terracotta/30 text-xs leading-relaxed">
          <div className="font-bold text-terracotta-dark flex items-center gap-1.5 mb-1.5">
            <AlertCircle className="w-4 h-4" />
            Titik Hambatan (Bottleneck)
          </div>
          <p className="text-foreground/90">{result.bottleneck}</p>
        </div>
      </div>

      <CalculationAccordion
        methodologyDescription="Wellness Score menggabungkan lima pilar kebugaran fungsional harian berdasarkan prinsip preventif kedokteran gaya hidup (Lifestyle Medicine)."
        factors={[
          { name: 'Movement (22%)', description: 'Aktivitas fisik teratur dan mitigasi dampak sedentary lifestyle.' },
          { name: 'Sleep (24%)', description: 'Durasi tidur malam yang cukup untuk perbaikan jaringan tubuh.' },
          { name: 'Nutrition (18%)', description: 'Keseimbangan asupan mikronutrien dan antioksidan serat alami.' },
          { name: 'Recovery (18%)', description: 'Tingkat energi saat bangun tidur dan kapasitas mengelola beban kerja.' },
          { name: 'Lifestyle (18%)', description: 'Manajemen tingkat kortisol dan kebiasaan bebas rokok.' },
        ]}
      />
    </ResultWrapper>
  );
};
