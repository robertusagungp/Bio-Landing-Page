import React, { useState } from 'react';
import { 
  UserProfile, 
  FamilyReadinessResult, 
  ActiveToolId 
} from '../../../types/profile';
import { calculateFamilyReadiness } from '../../../utils/calculations/familyReadiness';
import { updateStoredProfile, updateStoredResults } from '../../../utils/storage';
import { QuestionRunner, QuestionStep } from '../QuestionRunner';
import { ResultWrapper } from '../ResultWrapper';
import { ScoreRing } from '../ScoreRing';
import { ScoreBar } from '../ScoreBar';
import { CalculationAccordion } from '../CalculationAccordion';
import { ShieldCheck, Users, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface FamilyReadinessRunnerProps {
  initialProfile: UserProfile;
  savedResult?: FamilyReadinessResult;
  onNavigateToTool: (toolId: ActiveToolId) => void;
  onClose: () => void;
}

export const FamilyReadinessRunner: React.FC<FamilyReadinessRunnerProps> = ({
  initialProfile,
  savedResult,
  onNavigateToTool,
  onClose,
}) => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [result, setResult] = useState<FamilyReadinessResult | null>(savedResult || null);
  const [stepIndex, setStepIndex] = useState(0);

  const questions: QuestionStep[] = [
    {
      id: 'relationshipStatus',
      title: 'Bagaimana status rumah tangga / keluarga kamu saat ini?',
      subtitle: 'Membantu memetakan struktur tanggungan dan peran pencari nafkah.',
      options: [
        { label: 'Lajang / Belum Menikah', value: 'single', icon: '👤' },
        { label: 'Menikah (Belum Memiliki Anak)', value: 'married_no_kids', icon: '👫' },
        { label: 'Menikah (Sudah Memiliki Anak)', value: 'married_with_kids', icon: '👨‍👩‍👦' },
        { label: 'Orang Tua Tunggal (Single Parent)', value: 'single_parent', icon: '👩‍👧' },
      ],
    },
    {
      id: 'dependents',
      title: 'Berapa jumlah jiwa yang bergantung secara finansial padamu?',
      subtitle: 'Termasuk anak sekolah/kuliah, orang tua lansia, atau anggota keluarga lain.',
      options: [
        { label: '0 orang', value: '0', icon: '👤' },
        { label: '1 orang', value: '1', icon: '👥' },
        { label: '2 orang', value: '2', icon: '👨‍👩‍👦' },
        { label: '3 orang atau lebih', value: '3+', icon: '👨‍👩‍👧‍👦' },
      ],
    },
    {
      id: 'monthlyExpenseRange',
      title: 'Berapa total kebutuhan operasional bulanan keluarga?',
      subtitle: 'Semua biaya belanja pokok, cicilan tempat tinggal, pendidikan anak, tagihan.',
      options: [
        { label: 'Kurang dari Rp5 Juta', value: '<5jt', icon: '🏷️' },
        { label: 'Rp5 – 10 Juta', value: '5-10jt', icon: '🛒' },
        { label: 'Rp10 – 20 Juta', value: '10-20jt', icon: '🏡' },
        { label: 'Rp20 – 30 Juta', value: '20-30jt', icon: '💼' },
        { label: 'Lebih dari Rp30 Juta', value: '>30jt', icon: '💎' },
      ],
    },
    {
      id: 'householdIncomeSources',
      title: 'Berapa banyak sumber penghasilan aktif di rumah tangga?',
      subtitle: 'Diversifikasi arus kas memberi keamanan jika satu pintu penghasilan terhambat.',
      options: [
        { label: 'Satu Pencari Nafkah (Single Earner)', value: 'single', description: 'Keluarga bergantung sepenuhnya pada satu orang', icon: '☝️' },
        { label: 'Dua Pencari Nafkah (Dual Earner)', value: 'dual', description: 'Suami dan istri sama-sama bekerja / berpenghasilan', icon: '✌️' },
        { label: 'Multi Sumber (Gaji + Usaha / Passive Income)', value: 'multiple', description: 'Memiliki lebih dari 2 aliran pemasukan aktif/pasif', icon: '🌊' },
      ],
    },
    {
      id: 'liquidSavingsMonths',
      title: 'Berapa lama dana darurat keluarga bertahan tanpa pemasukan?',
      subtitle: 'Kas tunai atau deposito keluarga di luar aset rumah dan kendaraan.',
      options: [
        { label: 'Kurang dari 1 bulan', value: '<1', icon: '⚠️' },
        { label: '1 – 3 bulan', value: '1-3', icon: '🛡️' },
        { label: '3 – 6 bulan', value: '3-6', icon: '⚖️' },
        { label: '6 – 12 bulan', value: '6-12', icon: '🏰' },
        { label: 'Lebih dari 12 bulan', value: '12+', icon: '🌟' },
      ],
    },
    {
      id: 'primaryIncomeStop6Months',
      title: 'Jika penghasilan utama terhenti selama 6 bulan, apa yang terjadi?',
      subtitle: 'Misalnya karena pemulihan sakit serius atau jeda transisi usaha.',
      options: [
        { label: 'Penghasilan lain / passive income cukup menopang', value: 'other_sufficient', description: 'Gaya hidup keluarga tetap berjalan normal', icon: '🟢' },
        { label: 'Ada sumber lain namun belum mencukupi penuh', value: 'exists_insufficient', description: 'Harus mengambil tabungan atau memangkas belanja', icon: '🟡' },
        { label: 'Tidak ada sumber lain sama sekali', value: 'no_other_income', description: 'Arus kas keluarga langsung berhenti 100%', icon: '🔴' },
      ],
    },
  ];

  const currentSelectedValues: { [key: string]: string } = {
    relationshipStatus: profile.relationshipStatus || '',
    dependents: profile.dependents || '',
    monthlyExpenseRange: profile.monthlyExpenseRange || '',
    householdIncomeSources: profile.householdIncomeSources || '',
    liquidSavingsMonths: profile.liquidSavingsMonths || '',
    primaryIncomeStop6Months: profile.primaryIncomeStop6Months || '',
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
      const finalResult = calculateFamilyReadiness(updated);
      setResult(finalResult);
      updateStoredResults({
        familyReadiness: finalResult,
        lastCompletedTool: 'family-readiness',
      });
    }
  };

  if (!result) {
    return (
      <QuestionRunner
        toolTitle="Family Readiness Score"
        toolCategory="Household Continuity"
        questions={questions}
        currentStepIndex={stepIndex}
        selectedValues={currentSelectedValues}
        onSelectOption={handleSelectOption}
        onBack={() => setStepIndex(Math.max(0, stepIndex - 1))}
        onCancel={onClose}
      />
    );
  }

  const renderTimelineBadge = (status: 'Strong' | 'Manageable' | 'Tight' | 'Vulnerable') => {
    switch (status) {
      case 'Strong':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sage/20 text-sage-dark">Kuat</span>;
      case 'Manageable':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-brand/15 text-teal-brand">Terkendali</span>;
      case 'Tight':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-mustard/20 text-mustard-dark">Ketat</span>;
      case 'Vulnerable':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-terracotta/20 text-terracotta-dark">Rentan</span>;
    }
  };

  return (
    <ResultWrapper
      toolTitle="Family Readiness Score"
      scoreNumber={result.overallScore}
      scoreElement={
        <ScoreRing
          score={result.overallScore}
          label="Family Readiness"
          sublabel="Indeks Kontinuitas Keluarga"
        />
      }
      meaning="Kesiapan finansial keluarga diukur dari kemampuan rumah tangga menjaga kelangsungan kebutuhan pokok saat terjadi guncangan pada pencari nafkah."
      whyExplanation={`Titik terkuat keluarga saat ini berada pada: "${result.strongestPoint}". Namun perhatian utama tertuju pada: "${result.biggestDependency}".`}
      actionTitle="Panduan Mengelola Risiko Keluarga"
      actionItems={[
        'Susun dokumen ringkasan keuangan keluarga (financial cheat sheet) yang mudah diakses pasangan dalam keadaan darurat.',
        'Pisahkan rekening operasional belanja rumah tangga dari cadangan darurat keluarga.',
        'Bangun struktur perlindungan berlapis yang mencakup tunjangan kantor, tabungan, dan proteksi jiwa/kesehatan.'
      ]}
      recommendedTool={{
        id: 'health-checklist',
        title: 'Personal Health Checklist',
        description: 'Lengkapi kesiapan keluargamu dengan memeriksa checklist preventif kesehatan diri sendiri.',
        buttonLabel: 'Buka Health Checklist →',
      }}
      onSelectRecommendedTool={onNavigateToTool}
      onRetake={() => {
        setResult(null);
        setStepIndex(0);
      }}
      contextWaKey="family"
      pillarsForShare={[
        { name: 'Kebutuhan Harian', score: result.subscores.dailyNeeds },
        { name: 'Kas Darurat', score: result.subscores.emergency },
        { name: 'Cadangan Nafkah', score: result.subscores.incomeBackup },
        { name: 'Beban Tanggungan', score: result.subscores.dependents },
      ]}
    >
      {/* 5 Family Subscores */}
      <div className="bg-background/80 p-5 rounded-card border border-border/80 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border/60">
          <span className="text-xs font-bold text-foreground">
            5 Pilar Resiliensi Rumah Tangga
          </span>
          <span className="text-[10px] text-muted">Skala 0 – 100</span>
        </div>

        <ScoreBar
          label="1. Kebutuhan Pokok Harian (Daily Needs)"
          score={result.subscores.dailyNeeds}
          subtext="Efisiensi pemenuhan biaya hidup rutin rumah tangga"
        />

        <ScoreBar
          label="2. Bantalan Kas Darurat Keluarga (Emergency)"
          score={result.subscores.emergency}
          subtext="Daya tahan tabungan cair keluarga menghadapi kebutuhan mendesak"
        />

        <ScoreBar
          label="3. Diversifikasi Sumber Pemasukan (Income Backup)"
          score={result.subscores.incomeBackup}
          subtext="Ketersediaan penghasilan alternatif jika nafkah utama terhenti"
        />

        <ScoreBar
          label="4. Struktur Tanggungan (Dependents Factor)"
          score={result.subscores.dependents}
          subtext="Rasio jumlah jiwa tanggungan terhadap cadangan likuid"
        />

        <ScoreBar
          label="5. Fleksibilitas Arus Kas (Financial Agility)"
          score={result.subscores.flexibility}
          subtext="Kemampuan menyesuaikan pos belanja saat krisis"
        />
      </div>

      {/* Income Interruption Timeline (Section 17 requirement) */}
      <div className="p-5 rounded-card bg-card border border-border shadow-soft space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-teal-brand" />
            Timeline Ketahanan Jika Pemasukan Utama Terhenti:
          </div>
        </div>

        <div className="space-y-2 pt-1">
          {result.interruptionTimeline.map((item) => (
            <div
              key={item.month}
              className="p-3 rounded-xl bg-section/60 border border-border/60 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-16 font-bold text-foreground">Bulan ke-{item.month}</span>
                <span className="text-[11px] text-muted hidden sm:inline">{item.note}</span>
              </div>
              <div className="shrink-0">
                {renderTimelineBadge(item.status)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Neutral Risk Education (Section 17: multiple risk-management options) */}
      <div className="p-5 rounded-card bg-section/70 border border-border/80 space-y-2.5 text-xs">
        <div className="font-bold text-foreground flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-sage-dark" />
          Cara Keluarga Umumnya Mengelola Risiko Ini:
        </div>
        <p className="text-muted text-[11px] leading-relaxed">
          Keluarga tangguh tidak menaruh seluruh keamanan pada satu wadah saja, melainkan menggabungkan beberapa instrumen risiko:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {result.riskEducation.map((edu, idx) => (
            <div key={idx} className="p-2.5 rounded-lg bg-card border border-border/60 text-[11px] text-foreground/90 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-brand shrink-0"></span>
              <span>{edu}</span>
            </div>
          ))}
        </div>
      </div>

      <CalculationAccordion
        methodologyDescription="Family Readiness Score memodelkan ketahanan rumah tangga dengan menganalisis single-point-of-failure pada arus kas nafkah, jumlah tanggungan usia produktif/non-produktif, dan durasi cadangan likuiditas keluarga."
        factors={[
          { name: 'Income Redundancy (26%)', description: 'Keberadaan sumber nafkah alternatif jika pencari nafkah utama sakit atau transisi.' },
          { name: 'Dana Likuid Keluarga (26%)', description: 'Bantalan tabungan terpisah untuk menutupi kebutuhan belanja rumah tangga.' },
          { name: 'Daily Living Expenses (18%)', description: 'Besaran biaya rutin dan fleksibilitas pemangkasan pengeluaran.' },
          { name: 'Tanggungan Jiwa (15%)', description: 'Komitmen jangka panjang pendidikan anak dan kebutuhan orang tua.' },
          { name: 'Fleksibilitas Portofolio (15%)', description: 'Kapasitas penyesuaian gaya hidup keluarga di masa sulit.' },
        ]}
      />
    </ResultWrapper>
  );
};
