import React, { useState, useEffect } from 'react';
import { 
  UserProfile, 
  LifeReadinessResult, 
  ActiveToolId,
  AgeRange,
  ActivityLevel,
  SleepDuration,
  StressLevel,
  MonthlyExpenseRange,
  EmergencyFundsMonths,
  DependentsCount,
  IncomeStability
} from '../../../types/profile';
import { calculateLifeReadiness } from '../../../utils/calculations/lifeReadiness';
import { updateStoredProfile, updateStoredResults } from '../../../utils/storage';
import { QuestionRunner, QuestionStep } from '../QuestionRunner';
import { ResultWrapper } from '../ResultWrapper';
import { ScoreRing } from '../ScoreRing';
import { ScoreBar } from '../ScoreBar';
import { CalculationAccordion } from '../CalculationAccordion';
import { AlertTriangle, CheckCircle2, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';

interface LifeReadinessRunnerProps {
  initialProfile: UserProfile;
  savedResult?: LifeReadinessResult;
  onNavigateToTool: (toolId: ActiveToolId) => void;
  onClose: () => void;
}

export const LifeReadinessRunner: React.FC<LifeReadinessRunnerProps> = ({
  initialProfile,
  savedResult,
  onNavigateToTool,
  onClose,
}) => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [stepIndex, setStepIndex] = useState(0);
  const [result, setResult] = useState<LifeReadinessResult | null>(savedResult || null);
  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);

  const questions: QuestionStep[] = [
    {
      id: 'ageRange',
      title: 'Berapa rentang usiamu saat ini?',
      subtitle: 'Usia membantu memetakan fase produktivitas dan ekspektasi pemulihan fisik.',
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
      title: 'Seberapa sering kamu beraktivitas fisik / olahraga dalam seminggu?',
      subtitle: 'Gerak aktif menopang sirkulasi vaskular dan ketahanan stamina kerja.',
      options: [
        { label: 'Hampir tidak pernah (0 hari)', value: '0', description: 'Gaya hidup cenderung banyak duduk / sedentary', icon: '🛋️' },
        { label: '1 – 2 hari per minggu', value: '1-2', description: 'Olahraga ringan sesekali di akhir pekan', icon: '🚶' },
        { label: '3 – 4 hari per minggu', value: '3-4', description: 'Konsisten menjaga rutinitas kebugaran', icon: '🏃' },
        { label: '5+ hari per minggu', value: '5+', description: 'Sangat aktif dan disiplin latihan fisik', icon: '⚡' },
      ],
    },
    {
      id: 'sleep',
      title: 'Rata-rata kamu tidur berapa jam setiap malam?',
      subtitle: 'Durasi istirahat menentukan efektivitas regenerasi organ dan fokus harian.',
      options: [
        { label: 'Kurang dari 5 jam', value: '<5', description: 'Defisit tidur berat, sering merasa lelah di siang hari', icon: '🥱' },
        { label: '5 – 6 jam', value: '5-6', description: 'Waktu istirahat pas-pasan, mendekati batas toleransi', icon: '⏰' },
        { label: '6 – 7 jam', value: '6-7', description: 'Durasi tidur standar untuk sebagian besar profesional', icon: '🌙' },
        { label: '7 – 9 jam', value: '7-9', description: 'Durasi optimal untuk pemulihan metabolisme', icon: '✨' },
        { label: 'Lebih dari 9 jam', value: '>9', description: 'Tidur panjang atau sering merasa kurang bugar', icon: '🛌' },
      ],
    },
    {
      id: 'stress',
      title: 'Bagaimana tingkat stres / tekanan harian yang kamu rasakan?',
      subtitle: 'Stres berkepanjangan membebani sistem saraf simpatik dan ketenangan berpikir.',
      options: [
        { label: 'Rendah (Terkendali & Tenang)', value: 'low', description: 'Ritme hidup santai dan bebas tekanan kronis', icon: '😌' },
        { label: 'Moderat (Dapat Dikelola)', value: 'moderate', description: 'Tantangan kerja wajar dengan waktu santai yang cukup', icon: '🙂' },
        { label: 'Tinggi (Sering Terbebani)', value: 'high', description: 'Sering merasa kelelahan mental dan kurang jeda napas', icon: '😰' },
        { label: 'Sangat Tinggi (Kelelahan Akut)', value: 'very_high', description: 'Kelelahan ekstrem secara emosional dan fisik', icon: '💥' },
      ],
    },
    {
      id: 'monthlyExpenseRange',
      title: 'Berapa rata-rata pengeluaran rutinmu per bulan?',
      subtitle: 'Mencakup belanja harian, tagihan, transportasi, dan kebutuhan primer.',
      options: [
        { label: 'Kurang dari Rp5 Juta', value: '<5jt', icon: '🏷️' },
        { label: 'Rp5 – 10 Juta', value: '5-10jt', icon: '💳' },
        { label: 'Rp10 – 20 Juta', value: '10-20jt', icon: '💼' },
        { label: 'Rp20 – 30 Juta', value: '20-30jt', icon: '📊' },
        { label: 'Lebih dari Rp30 Juta', value: '>30jt', icon: '💎' },
      ],
    },
    {
      id: 'liquidSavingsMonths',
      title: 'Berapa lama cadangan kas likuidmu bertahan jika tanpa pemasukan?',
      subtitle: 'Dana di tabungan atau deposito yang bisa ditarik tunai dalam 24 jam.',
      options: [
        { label: 'Kurang dari 1 bulan', value: '<1', description: 'Sangat sensitif terhadap keterlambatan arus kas', icon: '⚠️' },
        { label: '1 – 3 bulan pengeluaran', value: '1-3', description: 'Buffer minimal, cukup untuk jeda singkat', icon: '🛡️' },
        { label: '3 – 6 bulan pengeluaran', value: '3-6', description: 'Standar kesehatan finansial yang direkomendasikan', icon: '⚖️' },
        { label: '6 – 12 bulan pengeluaran', value: '6-12', description: 'Sangat kuat, memiliki ruang negosiasi karier', icon: '🏰' },
        { label: 'Lebih dari 12 bulan', value: '12+', description: 'Tingkat resiliensi likuiditas luar biasa kokoh', icon: '🌟' },
      ],
    },
    {
      id: 'dependents',
      title: 'Berapa jumlah orang yang bergantung secara finansial padamu?',
      subtitle: 'Pasangan non-bekerja, anak-anak, atau orang tua yang kamu sokong rutin.',
      options: [
        { label: '0 orang (Hanya diri sendiri)', value: '0', description: 'Fleksibilitas pengeluaran sangat leluasa', icon: '👤' },
        { label: '1 orang', value: '1', description: 'Pasangan atau satu anak', icon: '👥' },
        { label: '2 orang', value: '2', description: 'Keluarga inti atau tanggungan ganda', icon: '👨‍👩‍👦' },
        { label: '3 orang atau lebih', value: '3+', description: 'Tanggung jawab keluarga berlapis', icon: '👨‍👩‍👧‍👦' },
      ],
    },
    {
      id: 'incomeStability',
      title: 'Bagaimana karakteristik stabilitas penghasilanmu saat ini?',
      subtitle: 'Membantu mengukur kepastian arus kas masuk setiap bulannya.',
      options: [
        { label: 'Sangat Stabil (Gaji Tetap BUMN / Korporasi / ASN)', value: 'very_stable', description: 'Waktu dan nominal transfer selalu dapat diprediksi', icon: '🏢' },
        { label: 'Cukup Stabil (Karyawan Swasta / Usaha Mapan)', value: 'quite_stable', description: 'Penghasilan rutin dengan fluktuasi bonus berkala', icon: '📈' },
        { label: 'Variabel (Freelancer / Komisi / Profesional Mandiri)', value: 'variable', description: 'Besaran transfer bervariasi bergantung proyek berjalan', icon: '🌊' },
        { label: 'Sangat Tidak Menentu (Rintisan Usaha Baru)', value: 'highly_uncertain', description: 'Arus kas masuk tidak memiliki pola teratur', icon: '🧭' },
      ],
    },
  ];

  const currentSelectedValues: { [key: string]: string } = {
    ageRange: profile.ageRange || '',
    activity: profile.activity || '',
    sleep: profile.sleep || '',
    stress: profile.stress || '',
    monthlyExpenseRange: profile.monthlyExpenseRange || '',
    liquidSavingsMonths: profile.liquidSavingsMonths || '',
    dependents: profile.dependents || '',
    incomeStability: profile.incomeStability || '',
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
      // Calculate final flagship score!
      const finalResult = calculateLifeReadiness(updated);
      setResult(finalResult);
      updateStoredResults({
        lifeReadiness: finalResult,
        lastCompletedTool: 'life-readiness',
      });
    }
  };

  if (!result) {
    return (
      <QuestionRunner
        toolTitle="Life Readiness Score"
        toolCategory="Flagship Tool"
        questions={questions}
        currentStepIndex={stepIndex}
        selectedValues={currentSelectedValues}
        onSelectOption={handleSelectOption}
        onBack={() => setStepIndex(Math.max(0, stepIndex - 1))}
        onCancel={onClose}
      />
    );
  }

  // Cross-tool routing based on weakest pillar
  const getWeakestToolRecommendation = () => {
    switch (result.weakestPillar) {
      case 'health':
        return {
          id: 'lifestyle-age' as ActiveToolId,
          title: 'Perdalam Area Kesehatan: Lifestyle Age',
          description: 'Pilar kesehatanmu saat ini adalah area dengan skor terendah. Cek bagaimana kebiasaan harianmu memengaruhi usia biologis tubuh.',
          buttonLabel: 'Cek Lifestyle Age Sekarang →',
        };
      case 'emergency':
        return {
          id: 'emergency-checker' as ActiveToolId,
          title: 'Perdalam Cadangan: Emergency Fund Checker',
          description: 'Pilar dana daruratmu menjadi titik paling sensitif. Hitung persis berapa bulan daya tahan kasmu menghadapi benturan.',
          buttonLabel: 'Hitung Runway Dana Darurat →',
        };
      case 'family':
        return {
          id: 'family-readiness' as ActiveToolId,
          title: 'Perdalam Proteksi: Family Readiness Score',
          description: 'Kesiapan tanggungan keluargamu membutuhkan struktur kontinuitas. Cek ketahanan jika terjadi jeda penghasilan 6–12 bulan.',
          buttonLabel: 'Cek Kesiapan Keluarga →',
        };
      case 'money':
      default:
        return {
          id: 'financial-health' as ActiveToolId,
          title: 'Perdalam Arus Kas: Financial Health Score',
          description: 'Struktur arus kas dan rasio komitmen harianmu masih bisa diperkuat. Lakukan stress-test keuangan mendalam.',
          buttonLabel: 'Cek Skor Kesehatan Keuangan →',
        };
    }
  };

  const recTool = getWeakestToolRecommendation();

  return (
    <ResultWrapper
      toolTitle="Life Readiness Score"
      scoreNumber={result.overallScore}
      scoreElement={
        <ScoreRing
          score={result.overallScore}
          label="Life Readiness Score"
          sublabel="Indeks Kesiapan 4 Pilar"
        />
      }
      meaning={result.subtitle}
      whyExplanation="Hasil ini merupakan penggabungan kuantitatif antara cadangan likuiditas, stabilitas arus kas, durasi tidur/olahraga, dan jumlah tanggungan keluarga yang kamu sokong."
      actionTitle="3 Langkah Prioritas Penguatan"
      actionItems={result.nextSteps}
      recommendedTool={{
        id: recTool.id,
        title: recTool.title,
        description: recTool.description,
        buttonLabel: recTool.buttonLabel,
      }}
      onSelectRecommendedTool={onNavigateToTool}
      onRetake={() => {
        setResult(null);
        setStepIndex(0);
      }}
      contextWaKey="life-readiness"
      pillarsForShare={[
        { name: 'Kesehatan (Health)', score: result.pillars.health },
        { name: 'Arus Kas (Money)', score: result.pillars.money },
        { name: 'Kas Darurat (Emergency)', score: result.pillars.emergency },
        { name: 'Keluarga (Family)', score: result.pillars.family },
      ]}
    >
      {/* 4 PILLARS DISPLAY (Horizontal bars as requested in Section 11) */}
      <div className="bg-background/80 p-5 rounded-card border border-border/80 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border/60">
          <span className="text-xs font-bold text-foreground">
            Evaluasi 4 Pilar Kesiapan Hidup
          </span>
          <span className="text-[10px] text-muted font-medium">Skala 0 – 100</span>
        </div>

        <ScoreBar
          label="1. Health & Vitality (Kebiasaan Fisik & Tidur)"
          score={result.pillars.health}
          subtext="Regenerasi sel, stamina harian, dan pencegahan risiko kronis"
        />

        <ScoreBar
          label="2. Money Flow (Stabilitas & Kontrol Pengeluaran)"
          score={result.pillars.money}
          subtext="Kemampuan mempertahankan gaya hidup tanpa ketergantungan utang"
        />

        <ScoreBar
          label="3. Emergency Buffer (Daya Tahan Kas Likuid)"
          score={result.pillars.emergency}
          subtext="Bantalan tabungan tunai saat menghadapi penghentian pendapatan"
        />

        <ScoreBar
          label="4. Family Readiness (Keberlanjutan Tanggungan)"
          score={result.pillars.family}
          subtext="Tingkat ketergantungan finansial orang yang Anda cintai"
        />
      </div>

      {/* STRENGTHS & WATCH AREAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="p-4 rounded-card bg-sage/10 border border-sage/30 text-xs leading-relaxed">
          <div className="font-bold text-sage-dark flex items-center gap-1.5 mb-2">
            <CheckCircle2 className="w-4 h-4" />
            Yang Sudah Kuat
          </div>
          <ul className="space-y-2 text-foreground/90">
            {result.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-sage-dark font-bold">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 rounded-card bg-terracotta/10 border border-terracotta/30 text-xs leading-relaxed">
          <div className="font-bold text-terracotta-dark flex items-center gap-1.5 mb-2">
            <AlertTriangle className="w-4 h-4" />
            Yang Perlu Diperhatikan
          </div>
          <ul className="space-y-2 text-foreground/90">
            {result.watchAreas.map((w, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-terracotta-dark font-bold">•</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* BIGGEST VULNERABILITY */}
      <div className="p-4 rounded-card bg-card border border-border shadow-soft flex items-start gap-3">
        <div className="p-2 rounded-xl bg-terracotta/15 text-terracotta mt-0.5 shrink-0">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta block mb-0.5">
            Titik Kerentanan Terbesar (Biggest Vulnerability)
          </span>
          <h4 className="text-sm font-bold text-foreground">
            {result.biggestVulnerability.title}
          </h4>
          <p className="text-xs text-muted mt-1 leading-relaxed">
            {result.biggestVulnerability.description}
          </p>
        </div>
      </div>

      {/* WHAT IF? INTERACTIVE SCENARIO CARDS (Section 11) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-brand" />
            WHAT IF? Simulasi Benturan Tak Terduga
          </div>
          <span className="text-[10px] text-muted">Pilih skenario:</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {result.whatIfScenarios.map((sc, i) => (
            <button
              key={i}
              onClick={() => setActiveScenarioIndex(i)}
              className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                activeScenarioIndex === i
                  ? 'border-teal-brand bg-teal-brand text-white shadow-soft'
                  : 'border-border bg-white text-foreground hover:bg-section'
              }`}
            >
              <span className="block text-[10px] opacity-80 uppercase tracking-tight">
                Skenario {String.fromCharCode(65 + i)}
              </span>
              <span className="line-clamp-2 text-[11px] leading-tight mt-0.5">
                {sc.title.split('. ')[1]}
              </span>
            </button>
          ))}
        </div>

        {/* Active Scenario Detail Box */}
        {result.whatIfScenarios[activeScenarioIndex] && (
          <div className="p-4 rounded-card bg-section/80 border border-border text-xs leading-relaxed animate-in fade-in duration-150">
            <div className="font-bold text-foreground text-sm mb-1">
              {result.whatIfScenarios[activeScenarioIndex].title}
            </div>
            <p className="text-muted mb-2">
              {result.whatIfScenarios[activeScenarioIndex].description}
            </p>
            <div className="p-3 rounded-xl bg-card border border-border/80 flex items-start gap-2.5">
              <span className="text-sm">⚡</span>
              <div>
                <span className="font-semibold text-foreground text-[11px] block">
                  Dampak pada Kesiapanmu:
                </span>
                <span className="text-foreground/85 text-xs">
                  {result.whatIfScenarios[activeScenarioIndex].impactDescription}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CALCULATION ACCORDION */}
      <CalculationAccordion
        methodologyDescription="Life Readiness Score memodelkan 4 pilar hidup menggunakan pembobotan aktuaria sederhana: Kesehatan Fisik (28%), Stabilitas Finansial (24%), Cadangan Kas Darurat (26%), dan Tanggungan Keluarga (22%)."
        factors={[
          { name: 'Kesehatan & Vitalitas (28%)', description: 'Frekuensi gerak mingguan, durasi deep sleep, dan level stres harian.' },
          { name: 'Cadangan Darurat Likuid (26%)', description: 'Rasio dana likuid terhadap pengeluaran rutin bulanan.' },
          { name: 'Arus Kas Masuk (24%)', description: 'Tingkat kepastian pendapatan dan proporsi komitmen tetap bulanan.' },
          { name: 'Kesiapan Tanggungan (22%)', description: 'Beban tanggungan keluarga dikalibrasi dengan bantalan likuiditas.' },
        ]}
      />
    </ResultWrapper>
  );
};
