import React, { useState } from 'react';
import { 
  UserProfile, 
  FinancialHealthResult, 
  ActiveToolId 
} from '../../../types/profile';
import { calculateFinancialHealth } from '../../../utils/calculations/financialHealth';
import { updateStoredProfile, updateStoredResults } from '../../../utils/storage';
import { QuestionRunner, QuestionStep } from '../QuestionRunner';
import { ResultWrapper } from '../ResultWrapper';
import { ScoreRing } from '../ScoreRing';
import { ScoreBar } from '../ScoreBar';
import { CalculationAccordion } from '../CalculationAccordion';
import { Lightbulb, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react';

interface FinancialHealthRunnerProps {
  initialProfile: UserProfile;
  savedResult?: FinancialHealthResult;
  onNavigateToTool: (toolId: ActiveToolId) => void;
  onClose: () => void;
}

export const FinancialHealthRunner: React.FC<FinancialHealthRunnerProps> = ({
  initialProfile,
  savedResult,
  onNavigateToTool,
  onClose,
}) => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [result, setResult] = useState<FinancialHealthResult | null>(savedResult || null);
  const [stepIndex, setStepIndex] = useState(0);

  const questions: QuestionStep[] = [
    {
      id: 'monthlyIncomeRange',
      title: 'Berapa rata-rata pemasukan bersih bulananmu?',
      subtitle: 'Total gaji pokok, tunjangan, atau rata-rata omzet bersih usaha per bulan.',
      options: [
        { label: 'Kurang dari Rp10 Juta', value: '<10jt', icon: '💵' },
        { label: 'Rp10 – 20 Juta', value: '10-20jt', icon: '💳' },
        { label: 'Rp20 – 35 Juta', value: '20-35jt', icon: '💼' },
        { label: 'Rp35 – 50 Juta', value: '35-50jt', icon: '📈' },
        { label: 'Lebih dari Rp50 Juta', value: '>50jt', icon: '💎' },
      ],
    },
    {
      id: 'monthlyExpenseRange',
      title: 'Berapa total pengeluaran rutinmu setiap bulan?',
      subtitle: 'Termasuk makan, tagihan listrik, tempat tinggal, transportasi, dan kebutuhan keluarga.',
      options: [
        { label: 'Kurang dari Rp5 Juta', value: '<5jt', icon: '🏷️' },
        { label: 'Rp5 – 10 Juta', value: '5-10jt', icon: '🛒' },
        { label: 'Rp10 – 20 Juta', value: '10-20jt', icon: '🏡' },
        { label: 'Rp20 – 30 Juta', value: '20-30jt', icon: '📊' },
        { label: 'Lebih dari Rp30 Juta', value: '>30jt', icon: '⚖️' },
      ],
    },
    {
      id: 'debtRatio',
      title: 'Berapa proporsi cicilan / utang bulanan terhadap pemasukanmu?',
      subtitle: 'KPR rumah, kredit mobil, cicilan kartu kredit, atau pinjaman lainnya.',
      options: [
        { label: 'Sangat Rendah (< 10%)', value: '<10%', description: 'Hampir bebas cicilan atau tidak punya utang', icon: '🟢' },
        { label: 'Aman & Sehat (10% – 30%)', value: '10-30%', description: 'Rasio cicilan ideal yang disarankan perencana keuangan', icon: '🟡' },
        { label: 'Cukup Berat (30% – 50%)', value: '30-50%', description: 'Mulai mempersempit ruang tabungan bulanan', icon: '🟠' },
        { label: 'Tinggi (> 50%)', value: '>50%', description: 'Lebih dari separuh gaji terkunci untuk melunasi cicilan', icon: '🔴' },
      ],
    },
    {
      id: 'liquidSavingsMonths',
      title: 'Berapa lama tabungan likuidmu bisa menopang biaya hidup tanpa pemasukan?',
      subtitle: 'Uang tunai di rekening atau deposito yang bisa dicairkan hari ini juga.',
      options: [
        { label: 'Kurang dari 1 bulan', value: '<1', icon: '⚠️' },
        { label: '1 – 3 bulan pengeluaran', value: '1-3', icon: '🛡️' },
        { label: '3 – 6 bulan pengeluaran', value: '3-6', icon: '⚖️' },
        { label: '6 – 12 bulan pengeluaran', value: '6-12', icon: '🏰' },
        { label: 'Lebih dari 12 bulan', value: '12+', icon: '🌟' },
      ],
    },
    {
      id: 'savingHabit',
      title: 'Bagaimana kebiasaanmu menabung atau berinvestasi setiap bulannya?',
      subtitle: 'Bukan hanya nominalnya, melainkan kedisiplinan alokasi dana.',
      options: [
        { label: 'Jarang / Sulit menyisihkan', value: 'rarely', description: 'Arus kas sering habis untuk kebutuhan berjalan', icon: '💨' },
        { label: 'Menabung jika ada sisa di akhir bulan', value: 'leftovers', description: 'Jumlah tabungan tidak menentu tiap tanggal', icon: '🪙' },
        { label: 'Konsisten 10% – 20% di awal gajian', value: 'consistent_10_20', description: 'Menyisihkan terlebih dahulu (pay yourself first)', icon: '🌱' },
        { label: 'Agresif > 20% dari penghasilan', value: 'aggressive_20_plus', description: 'Sangat terstruktur membangun aset masa depan', icon: '🚀' },
      ],
    },
    {
      id: 'dependents',
      title: 'Berapa jumlah tanggungan finansial yang kamu nafkahi?',
      subtitle: 'Orang yang kebutuhan hidupnya bergantung penuh atau sebagian padamu.',
      options: [
        { label: '0 orang (Diri Sendiri)', value: '0', icon: '👤' },
        { label: '1 orang', value: '1', icon: '👥' },
        { label: '2 orang', value: '2', icon: '👨‍👩‍👦' },
        { label: '3 orang atau lebih', value: '3+', icon: '👨‍👩‍👧‍👦' },
      ],
    },
  ];

  const currentSelectedValues: { [key: string]: string } = {
    monthlyIncomeRange: profile.monthlyIncomeRange || '',
    monthlyExpenseRange: profile.monthlyExpenseRange || '',
    debtRatio: profile.debtRatio || '',
    liquidSavingsMonths: profile.liquidSavingsMonths || '',
    savingHabit: profile.savingHabit || '',
    dependents: profile.dependents || '',
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
      const finalResult = calculateFinancialHealth(updated);
      setResult(finalResult);
      updateStoredResults({
        financialHealth: finalResult,
        lastCompletedTool: 'financial-health',
      });
    }
  };

  if (!result) {
    return (
      <QuestionRunner
        toolTitle="Financial Health Score"
        toolCategory="Cash Flow & Resilience"
        questions={questions}
        currentStepIndex={stepIndex}
        selectedValues={currentSelectedValues}
        onSelectOption={handleSelectOption}
        onBack={() => setStepIndex(Math.max(0, stepIndex - 1))}
        onCancel={onClose}
      />
    );
  }

  const renderStatusDot = (color: 'green' | 'yellow' | 'red') => {
    if (color === 'green') return <span className="w-3.5 h-3.5 rounded-full bg-sage inline-block shrink-0 shadow-soft"></span>;
    if (color === 'yellow') return <span className="w-3.5 h-3.5 rounded-full bg-mustard inline-block shrink-0 shadow-soft"></span>;
    return <span className="w-3.5 h-3.5 rounded-full bg-terracotta inline-block shrink-0 shadow-soft"></span>;
  };

  return (
    <ResultWrapper
      toolTitle="Financial Health Score"
      scoreNumber={result.overallScore}
      scoreElement={
        <ScoreRing
          score={result.overallScore}
          label="Financial Health"
          sublabel={result.profileLabel}
        />
      }
      meaning={result.profileLabelDescription}
      whyExplanation="Kesehatan keuangan bukan ditentukan dari berapa besar slip gaji, melainkan seberapa kuat struktur bantalan kas terhadap kewajiban rutin saat ada jeda pemasukan."
      actionTitle="Prioritas Penguatan Struktur Finansial"
      actionItems={[
        'Alokasikan otomatis 10% tabungan di hari pertama gajian sebelum belanja dimulai.',
        'Jaga rasio komitmen cicilan bulanan tetap di bawah 30% dari penghasilan bersih.',
        'Bangun cadangan darurat bertahap di rekening terpisah tanpa akses kartu debit harian.'
      ]}
      recommendedTool={{
        id: 'emergency-checker',
        title: 'Cek Emergency Fund Runway',
        description: 'Cadangan darurat likuidmu terlihat sebagai pilar paling krusial. Lihat simulasi seberapa cepat kasmu menyusut saat ada goncangan.',
        buttonLabel: 'Hitung Detail Runway Kas Darurat →',
      }}
      onSelectRecommendedTool={onNavigateToTool}
      onRetake={() => {
        setResult(null);
        setStepIndex(0);
      }}
      contextWaKey="financial-health"
      pillarsForShare={[
        { name: 'Arus Kas (Cash Flow)', score: result.subscores.cashFlow },
        { name: 'Cadangan Darurat', score: result.subscores.emergency },
        { name: 'Kesehatan Utang', score: result.subscores.debt },
        { name: 'Disiplin Menabung', score: result.subscores.savingHabit },
        { name: 'Resiliensi Kejutan', score: result.subscores.resilience },
      ]}
    >
      {/* 5 Financial Subscores */}
      <div className="bg-background/80 p-5 rounded-card border border-border/80 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border/60">
          <span className="text-xs font-bold text-foreground">
            5 Indikator Kesehatan Finansial
          </span>
          <span className="text-[10px] text-muted">Skala 0 – 100</span>
        </div>

        <ScoreBar
          label="1. Arus Kas Bersih (Cash Flow Surplus)"
          score={result.subscores.cashFlow}
          subtext="Selisih positif antara pemasukan dan pengeluaran rutin bulanan"
        />

        <ScoreBar
          label="2. Dana Darurat Likuid (Liquidity Buffer)"
          score={result.subscores.emergency}
          subtext="Daya tahan simpanan tunai tanpa bergantung utang darurat"
        />

        <ScoreBar
          label="3. Rasio Beban Utang (Debt Service Ratio)"
          score={result.subscores.debt}
          subtext="Tingkat keleluasaan arus kas dari jeratan cicilan tetap"
        />

        <ScoreBar
          label="4. Kebiasaan Alokasi Tabungan (Saving Habit)"
          score={result.subscores.savingHabit}
          subtext="Kedisiplinan memprioritaskan aset masa depan di awal bulan"
        />

        <ScoreBar
          label="5. Resiliensi Kejutan (Shock Absorption)"
          score={result.subscores.resilience}
          subtext="Tingkat ketahanan jika salah satu sumber penghasilan terhenti"
        />
      </div>

      {/* FINANCIAL STRESS TEST SECTION (Section 14) */}
      <div className="p-5 rounded-card bg-card border border-border shadow-soft space-y-3">
        <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-teal-brand" />
          Financial Stress Test (Simulasi Tanpa Pemasukan)
        </div>
        <p className="text-xs text-muted leading-relaxed">
          Bagaimana kesiapan struktur keuanganmu jika seluruh arus kas masuk terhenti seketika?
        </p>

        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
          <div className="p-3 rounded-xl bg-section/70 border border-border/60">
            <div className="flex items-center justify-center mb-1.5">
              {renderStatusDot(result.stressTest.oneMonth)}
            </div>
            <span className="text-xs font-bold text-foreground block">1 Bulan</span>
            <span className="text-[10px] text-muted">
              {result.stressTest.oneMonth === 'green' ? 'Aman' : result.stressTest.oneMonth === 'yellow' ? 'Waspada' : 'Kritis'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-section/70 border border-border/60">
            <div className="flex items-center justify-center mb-1.5">
              {renderStatusDot(result.stressTest.threeMonths)}
            </div>
            <span className="text-xs font-bold text-foreground block">3 Bulan</span>
            <span className="text-[10px] text-muted">
              {result.stressTest.threeMonths === 'green' ? 'Aman' : result.stressTest.threeMonths === 'yellow' ? 'Waspada' : 'Kritis'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-section/70 border border-border/60">
            <div className="flex items-center justify-center mb-1.5">
              {renderStatusDot(result.stressTest.sixMonths)}
            </div>
            <span className="text-xs font-bold text-foreground block">6 Bulan</span>
            <span className="text-[10px] text-muted">
              {result.stressTest.sixMonths === 'green' ? 'Aman' : result.stressTest.sixMonths === 'yellow' ? 'Waspada' : 'Kritis'}
            </span>
          </div>
        </div>

        <p className="text-[11px] text-muted/90 bg-section/40 p-2.5 rounded-lg border border-border/40">
          {result.stressTest.explanation}
        </p>
      </div>

      {/* ONE DEEP PERSONALIZED INSIGHT (Section 14) */}
      <div className="p-4 rounded-card bg-teal-brand/10 border border-teal-brand/20 flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-teal-brand shrink-0 mt-0.5" />
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-brand block mb-0.5">
            Hal yang Mungkin Belum Kamu Sadari
          </span>
          <p className="text-xs text-foreground/90 leading-relaxed font-medium">
            {result.deepInsight}
          </p>
        </div>
      </div>

      <CalculationAccordion
        methodologyDescription="Financial Health Score mengukur ketahanan keuangan pribadi melalui rasio beban utang terhadap penghasilan (DSR), surplus arus kas bulanan, dan daya tahan likuiditas darurat."
        factors={[
          { name: 'Surplus Cash Flow (22%)', description: 'Proporsi sisa pemasukan setelah dipotong pengeluaran primer.' },
          { name: 'Dana Darurat Likuid (26%)', description: 'Jumlah bulan bertahan kas tunai jika tanpa ada pemasukan.' },
          { name: 'Rasio Cicilan / DSR (20%)', description: 'Beban utang bulanan di bawah ambang batas aman 30%.' },
          { name: 'Disiplin Menabung (16%)', description: 'Pola menyisihkan dana terstruktur di awal periode.' },
          { name: 'Resiliensi Kejutan (16%)', description: 'Kemampuan menyerap goncangan berdasarkan jumlah tanggungan.' },
        ]}
      />
    </ResultWrapper>
  );
};
