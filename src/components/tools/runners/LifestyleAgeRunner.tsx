import React, { useState } from 'react';
import { 
  UserProfile, 
  LifestyleAgeResult, 
  ActiveToolId 
} from '../../../types/profile';
import { calculateLifestyleAge } from '../../../utils/calculations/lifestyleAge';
import { updateStoredProfile, updateStoredResults } from '../../../utils/storage';
import { QuestionRunner, QuestionStep } from '../QuestionRunner';
import { ResultWrapper } from '../ResultWrapper';
import { CalculationAccordion } from '../CalculationAccordion';
import { ShieldCheck, ArrowUpRight, ArrowDownRight, Minus, Sparkles, HeartPulse } from 'lucide-react';

interface LifestyleAgeRunnerProps {
  initialProfile: UserProfile;
  savedResult?: LifestyleAgeResult;
  onNavigateToTool: (toolId: ActiveToolId) => void;
  onClose: () => void;
}

export const LifestyleAgeRunner: React.FC<LifestyleAgeRunnerProps> = ({
  initialProfile,
  savedResult,
  onNavigateToTool,
  onClose,
}) => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [stepIndex, setStepIndex] = useState(0);
  const [result, setResult] = useState<LifestyleAgeResult | null>(savedResult || null);

  const questions: QuestionStep[] = [
    {
      id: 'ageRange',
      title: 'Berapa usia kamu saat ini?',
      subtitle: 'Titik acuan baseline untuk membandingkan ritme biologis harian.',
      options: [
        { label: '18 – 24 tahun', value: '18-24', icon: '🌱' },
        { label: '25 – 29 tahun', value: '25-29', icon: '🚀' },
        { label: '30 – 34 tahun', value: '30-34', icon: '💼' },
        { label: '35 – 39 tahun', value: '35-39', icon: '🎯' },
        { label: '40 – 49 tahun', value: '40-49', icon: '🏛️' },
        { label: '50+ tahun', value: '50+', icon: '🌳' },
      ],
    },
    {
      id: 'activity',
      title: 'Berapa hari dalam seminggu kamu melakukan aktivitas fisik?',
      subtitle: 'Jalan cepat, lari, bersepeda, gym, atau olahraga permainan minimal 30 menit.',
      options: [
        { label: '0 hari (Hampir tidak pernah)', value: '0', icon: '🛋️' },
        { label: '1 – 2 hari per minggu', value: '1-2', icon: '🚶' },
        { label: '3 – 4 hari per minggu', value: '3-4', icon: '🏃' },
        { label: '5+ hari per minggu', value: '5+', icon: '⚡' },
      ],
    },
    {
      id: 'sleep',
      title: 'Berapa rata-rata durasi tidur malammu?',
      subtitle: 'Tidur adalah waktu utama otak membersihkan sisa metabolit dan perbaikan sel.',
      options: [
        { label: 'Kurang dari 5 jam', value: '<5', icon: '🥱' },
        { label: '5 – 6 jam', value: '5-6', icon: '⏰' },
        { label: '6 – 7 jam', value: '6-7', icon: '🌙' },
        { label: '7 – 9 jam (Optimal)', value: '7-9', icon: '✨' },
        { label: 'Lebih dari 9 jam', value: '>9', icon: '🛌' },
      ],
    },
    {
      id: 'smoking',
      title: 'Apakah kamu merokok atau menggunakan rokok elektrik (vape)?',
      subtitle: 'Nikotin dan partikel asap memengaruhi usia fleksibilitas pembuluh darah.',
      options: [
        { label: 'Tidak pernah / Sudah berhenti lama', value: 'no', description: 'Bebas dari paparan asap rokok harian', icon: '🚭' },
        { label: 'Ya, rutin merokok / vape aktif', value: 'yes', description: 'Konsumsi rokok konvensional atau elektrik harian', icon: '🚬' },
      ],
    },
    {
      id: 'nutrition',
      title: 'Seberapa sering kamu mengonsumsi sayur, buah segar, atau makanan kaya serat?',
      subtitle: 'Antioksidan alami melawan inflamasi kronis tingkat rendah di dalam tubuh.',
      options: [
        { label: 'Jarang sekali (1-2x per minggu)', value: 'rarely', icon: '🍟' },
        { label: 'Kadang-kadang (3-4x per minggu)', value: 'sometimes', icon: '🥗' },
        { label: 'Rutin setiap hari (1 porsi/hari)', value: 'regularly', icon: '🍎' },
        { label: 'Sangat berlimpah (Setiap waktu makan)', value: 'abundant', icon: '🥑' },
      ],
    },
    {
      id: 'stress',
      title: 'Bagaimana beban stres dan ketegangan mental yang kamu rasakan?',
      subtitle: 'Kortisol yang terus-menerus tinggi mempercepat pemendekan telomer seluler.',
      options: [
        { label: 'Rendah & Rileks', value: 'low', icon: '😌' },
        { label: 'Moderat / Wajar', value: 'moderate', icon: '🙂' },
        { label: 'Tinggi & Cukup Melelahkan', value: 'high', icon: '😰' },
        { label: 'Sangat Tinggi / Burnout', value: 'very_high', icon: '💥' },
      ],
    },
  ];

  const currentSelectedValues: { [key: string]: string } = {
    ageRange: profile.ageRange || '',
    activity: profile.activity || '',
    sleep: profile.sleep || '',
    smoking: profile.smoking || '',
    nutrition: profile.nutrition || '',
    stress: profile.stress || '',
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
      const finalResult = calculateLifestyleAge(updated);
      setResult(finalResult);
      updateStoredResults({
        lifestyleAge: finalResult,
        lastCompletedTool: 'lifestyle-age',
      });
    }
  };

  if (!result) {
    return (
      <QuestionRunner
        toolTitle="Lifestyle Age"
        toolCategory="Health Habits"
        questions={questions}
        currentStepIndex={stepIndex}
        selectedValues={currentSelectedValues}
        onSelectOption={handleSelectOption}
        onBack={() => setStepIndex(Math.max(0, stepIndex - 1))}
        onCancel={onClose}
      />
    );
  }

  const isYounger = result.differenceYears < 0;
  const isOlder = result.differenceYears > 0;

  return (
    <ResultWrapper
      toolTitle="Lifestyle Age"
      scoreNumber={`${result.lifestyleAge} Tahun`}
      scoreSublabel="Estimasi Usia Berdasarkan Pola Kebiasaan"
      meaning={
        isYounger
          ? `Kebiasaan harianmu membuat tubuhmu beroperasi seolah ${Math.abs(result.differenceYears)} tahun lebih muda daripada usia KTP.`
          : isOlder
          ? `Gaya hidup dan beban harianmu memberi beban ekstra setara +${result.differenceYears} tahun di atas usia KTP.`
          : 'Pola kebiasaan harianmu berjalan seimbang selaras dengan usia KTP.'
      }
      whyExplanation={result.biggestImpact}
      actionTitle="3 Perubahan Kecil dengan Dampak Tertinggi"
      actionItems={result.smallChanges}
      recommendedTool={{
        id: 'wellness-score',
        title: 'Lanjutkan ke Wellness Score',
        description: 'Jawaban kebiasaanmu sudah tercatat! Cukup jawab 2 pertanyaan cepat lagi untuk melihat radar 5 dimensi kebugaranmu.',
        buttonLabel: 'Buka Wellness Score (Tersisa 2 Tanya) →',
      }}
      onSelectRecommendedTool={onNavigateToTool}
      onRetake={() => {
        setResult(null);
        setStepIndex(0);
      }}
      contextWaKey="lifestyle"
      pillarsForShare={[
        { name: 'Usia Aktual (KTP)', score: result.actualAge },
        { name: 'Lifestyle Age', score: result.lifestyleAge },
      ]}
    >
      {/* Visual Age Comparison Card */}
      <div className="grid grid-cols-2 gap-3 bg-background/80 p-5 rounded-card border border-border/80 text-center">
        <div className="p-3 bg-white rounded-xl border border-border/70 shadow-soft">
          <span className="text-[11px] font-semibold text-muted block">Usia Aktual (KTP)</span>
          <span className="text-3xl font-extrabold text-foreground mt-1 block">
            {result.actualAge}
          </span>
          <span className="text-[10px] text-muted">Tahun</span>
        </div>

        <div className="p-3 bg-white rounded-xl border border-teal-brand/30 shadow-soft relative overflow-hidden">
          <span className="text-[11px] font-semibold text-teal-brand block">Estimated Lifestyle Age</span>
          <span className="text-3xl font-extrabold text-teal-brand mt-1 block">
            {result.lifestyleAge}
          </span>
          <span className={`text-[10px] font-bold inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full ${
            isYounger ? 'bg-sage/20 text-sage-dark' : isOlder ? 'bg-terracotta/20 text-terracotta-dark' : 'bg-section text-muted'
          }`}>
            {isYounger ? <ArrowDownRight className="w-3 h-3" /> : isOlder ? <ArrowUpRight className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
            {result.differenceYears > 0 ? `+${result.differenceYears} thn` : `${result.differenceYears} thn`}
          </span>
        </div>
      </div>

      {/* Contributors Breakdown */}
      <div className="space-y-2.5">
        <div className="text-xs font-bold text-foreground flex items-center justify-between">
          <span>Kontributor Kebiasaan Utama</span>
          <span className="text-[10px] text-muted">Beban / Manfaat</span>
        </div>
        <div className="space-y-2">
          {result.contributors.map((c, i) => (
            <div key={i} className="p-3 rounded-xl bg-card border border-border/80 flex items-center justify-between gap-2 shadow-soft">
              <div>
                <span className="text-xs font-semibold text-foreground block">{c.name}</span>
                <span className="text-[11px] text-muted leading-tight">{c.detail}</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                c.impact === 'positive' 
                  ? 'bg-sage/15 text-sage-dark' 
                  : c.impact === 'negative'
                  ? 'bg-terracotta/15 text-terracotta-dark'
                  : 'bg-section text-muted'
              }`}>
                {c.impact === 'positive' ? 'Protektif' : c.impact === 'negative' ? 'Beban Ekstra' : 'Netral'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Clear Medical Disclaimer as required by Section 12 */}
      <div className="p-3.5 rounded-card bg-section/70 border border-border/70 flex items-start gap-2.5 text-[11px] text-muted leading-relaxed">
        <ShieldCheck className="w-4 h-4 text-sage shrink-0 mt-0.5" />
        <span>
          <strong>Disclaimer Penting:</strong> Ini bukan pengukuran biological age laboratorium (seperti panjang telomer atau metilasi DNA) dan bukan diagnosis medis. Hasil merupakan estimasi edukatif dari pola kebiasaan yang Anda masukkan.
        </span>
      </div>

      <CalculationAccordion
        methodologyDescription="Lifestyle Age dihitung dengan memetakan deviasi kebiasaan harian dari ritme regenerasi biologis standar, mengacu pada studi epidemiologi pola tidur, frekuensi aktivitas kardiovaskular, dan paparan stres oksidatif."
        factors={[
          { name: 'Durasi Tidur (±1.5 hingga +3 thn)', description: 'Tidur <5 jam meningkatkan stres oksidatif, sedangkan 7–9 jam memberi regenerasi sel optimal.' },
          { name: 'Aktivitas Fisik (-2.5 hingga +2 thn)', description: 'Konsistensi 3-5 hari/minggu menjaga elastisitas dinding pembuluh darah.' },
          { name: 'Paparan Rokok/Nikotin (-1 hingga +3 thn)', description: 'Ketiadaan racun rokok melindungi integritas endotel vaskular jangka panjang.' },
          { name: 'Nutrisi Serat & Stres (±1 hingga +2.5 thn)', description: 'Asupan antioksidan dan level hormon kortisol harian.' },
        ]}
      />
    </ResultWrapper>
  );
};
