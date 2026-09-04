import React, { useState } from 'react';
import { 
  UserProfile, 
  EmergencyRunwayResult, 
  ActiveToolId 
} from '../../../types/profile';
import { calculateEmergencyRunway } from '../../../utils/calculations/emergencyRunway';
import { updateStoredProfile, updateStoredResults } from '../../../utils/storage';
import { formatRupiah } from '../../../utils/formatters';
import { QuestionRunner, QuestionStep } from '../QuestionRunner';
import { ResultWrapper } from '../ResultWrapper';
import { CalculationAccordion } from '../CalculationAccordion';
import { ShieldAlert, TrendingDown, Clock, ArrowRight } from 'lucide-react';

interface EmergencyCheckerRunnerProps {
  initialProfile: UserProfile;
  savedResult?: EmergencyRunwayResult;
  onNavigateToTool: (toolId: ActiveToolId) => void;
  onClose: () => void;
}

export const EmergencyCheckerRunner: React.FC<EmergencyCheckerRunnerProps> = ({
  initialProfile,
  savedResult,
  onNavigateToTool,
  onClose,
}) => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [result, setResult] = useState<EmergencyRunwayResult | null>(savedResult || null);
  const [stepIndex, setStepIndex] = useState(0);

  const questions: QuestionStep[] = [
    {
      id: 'monthlyExpenseRange',
      title: 'Berapa rata-rata total pengeluaran rutin bulananmu?',
      subtitle: 'Semua kebutuhan hidup dasar: makan, tempat tinggal, transportasi, tagihan.',
      options: [
        { label: 'Kurang dari Rp5 Juta', value: '<5jt', icon: '🏷️' },
        { label: 'Rp5 – 10 Juta', value: '5-10jt', icon: '🛒' },
        { label: 'Rp10 – 20 Juta', value: '10-20jt', icon: '🏡' },
        { label: 'Rp20 – 30 Juta', value: '20-30jt', icon: '💼' },
        { label: 'Lebih dari Rp30 Juta', value: '>30jt', icon: '💎' },
      ],
    },
    {
      id: 'liquidSavingsMonths',
      title: 'Berapa perkiraan total simpanan likuid yang kamu miliki saat ini?',
      subtitle: 'Tabungan di rekening bank, dompet digital, atau deposito yang bisa dicairkan hari ini.',
      options: [
        { label: 'Kurang dari 1 bulan pengeluaran', value: '<1', icon: '⚠️' },
        { label: '1 – 3 bulan pengeluaran', value: '1-3', icon: '🛡️' },
        { label: '3 – 6 bulan pengeluaran', value: '3-6', icon: '⚖️' },
        { label: '6 – 12 bulan pengeluaran', value: '6-12', icon: '🏰' },
        { label: 'Lebih dari 12 bulan pengeluaran', value: '12+', icon: '🌟' },
      ],
    },
    {
      id: 'dependents',
      title: 'Berapa jumlah anggota keluarga yang bergantung pada kas ini?',
      subtitle: 'Makin banyak tanggungan, makin besar buffer darurat yang direkomendasikan.',
      options: [
        { label: '0 orang (Hanya sendiri)', value: '0', description: 'Rekomendasi minimal 3 bulan runway', icon: '👤' },
        { label: '1 – 2 orang', value: '1', description: 'Rekomendasi minimal 6 bulan runway', icon: '👥' },
        { label: '3 orang atau lebih', value: '3+', description: 'Rekomendasi ideal 9–12 bulan runway', icon: '👨‍👩‍👧‍👦' },
      ],
    },
  ];

  const currentSelectedValues: { [key: string]: string } = {
    monthlyExpenseRange: profile.monthlyExpenseRange || '',
    liquidSavingsMonths: profile.liquidSavingsMonths || '',
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
      const finalResult = calculateEmergencyRunway(updated);
      setResult(finalResult);
      updateStoredResults({
        emergencyRunway: finalResult,
        lastCompletedTool: 'emergency-checker',
      });
    }
  };

  if (!result) {
    return (
      <QuestionRunner
        toolTitle="Emergency Fund Checker"
        toolCategory="Liquidity Buffer"
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
      toolTitle="Emergency Fund Checker"
      scoreNumber={`${result.runwayMonths} Bulan`}
      scoreSublabel={`Status Cadangan: ${result.statusLabel}`}
      meaning={`Daya tahan tabungan likuidmu saat ini dapat menopang gaya hidup dasar selama sekitar ${result.runwayMonths} bulan tanpa ada pemasukan sama sekali.`}
      whyExplanation={result.keyInsight}
      actionTitle="Langkah Penguatan Buffer Kas"
      actionItems={[
        'Simpan dana darurat di instrumen terpisah (misal rekening digital tanpa debit atau reksadana pasar uang likuid).',
        'Buat target bertahap: capai dulu 3 bulan, lalu tingkatkan ke 6 bulan pengeluaran rutin.',
        'Lindungi aset likuid ini dari satu tagihan medis besar dengan proteksi risiko terstruktur.'
      ]}
      recommendedTool={{
        id: 'medical-simulator',
        title: 'Simulasi Biaya Medis Rumah Sakit',
        description: 'Lihat bagaimana satu tagihan rawat inap rumah sakit swasta dapat memangkas runway dana daruratmu.',
        buttonLabel: 'Simulasikan Biaya Rawat Inap →',
      }}
      onSelectRecommendedTool={onNavigateToTool}
      onRetake={() => {
        setResult(null);
        setStepIndex(0);
      }}
      contextWaKey="emergency"
      pillarsForShare={[
        { name: 'Pengeluaran Rutin', score: Math.round(result.monthlyExpense / 1_000_000) },
        { name: 'Runway Kas Likuid (Bulan)', score: result.runwayMonths },
      ]}
    >
      {/* Horizontal Runway Timeline (Section 15) */}
      <div className="bg-background/80 p-5 rounded-card border border-border/80 space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-foreground">Garis Waktu Daya Tahan (Timeline)</span>
          <span className="text-teal-brand font-semibold">{result.runwayMonths} Bulan Bertahan</span>
        </div>

        {/* Timeline Visual Scale */}
        <div className="relative pt-6 pb-2">
          {/* Timeline track */}
          <div className="h-3 w-full bg-section rounded-full overflow-hidden relative">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                result.runwayMonths < 3 
                  ? 'bg-terracotta' 
                  : result.runwayMonths < 6 
                  ? 'bg-mustard' 
                  : 'bg-teal-brand'
              }`}
              style={{ width: `${Math.min(100, (result.runwayMonths / 12) * 100)}%` }}
            />
          </div>

          {/* Milestone Markers */}
          <div className="flex justify-between text-[10px] text-muted font-medium mt-2">
            <span>0 bln</span>
            <span className="text-terracotta font-semibold">3 bln (Min)</span>
            <span className="text-teal-brand font-semibold">6 bln (Sehat)</span>
            <span>9 bln</span>
            <span className="text-sage-dark font-semibold">12+ bln</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 text-center text-xs">
          <div className="p-3 bg-white rounded-xl border border-border/70 shadow-soft">
            <span className="text-[11px] text-muted block">Estimasi Pengeluaran/Bulan</span>
            <span className="text-sm font-bold text-foreground mt-0.5 block">
              {formatRupiah(result.monthlyExpense)}
            </span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-border/70 shadow-soft">
            <span className="text-[11px] text-muted block">Estimasi Simpanan Likuid</span>
            <span className="text-sm font-bold text-teal-brand mt-0.5 block">
              {formatRupiah(result.liquidSavings)}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Shock Scenarios Table */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-foreground flex items-center justify-between">
          <span>Uji Ketahanan Terhadap Benturan Mendadak</span>
          <span className="text-[10px] text-muted">Sisa Runway</span>
        </div>

        <div className="space-y-2">
          {result.scenarios.map((sc, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-card border border-border/80 flex items-center justify-between gap-3 shadow-soft"
            >
              <div>
                <span className="text-xs font-semibold text-foreground block">
                  {sc.label}
                </span>
                <span className="text-[11px] text-muted leading-tight block mt-0.5">
                  {sc.note}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className={`text-sm font-bold block ${
                  sc.remainingMonths < 2 ? 'text-terracotta' : sc.remainingMonths < 4 ? 'text-mustard-dark' : 'text-teal-brand'
                }`}>
                  {sc.remainingMonths} bln
                </span>
                {sc.difference < 0 && (
                  <span className="text-[10px] text-terracotta font-medium flex items-center justify-end">
                    <TrendingDown className="w-2.5 h-2.5 inline mr-0.5" />
                    {sc.difference} bln
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transparent Formula Breakdown (Section 15: "Lihat cara hitung") */}
      <CalculationAccordion
        title="Lihat Cara Hitung & Asumsi Transparan"
        methodologyDescription={result.calculationBreakdown.formula}
        factors={result.calculationBreakdown.assumptions.map((a, i) => ({
          name: `Asumsi Dasar ${i + 1}`,
          description: a,
        }))}
      />
    </ResultWrapper>
  );
};
