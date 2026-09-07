import React, { useState, useEffect } from 'react';
import { Shield, AlertCircle, CheckCircle, HelpCircle, ArrowRight, BookOpen } from 'lucide-react';
import { UserProfile, ProtectionGapResult, ActiveToolId } from '../../../types/profile';
import { calculateProtectionGap, ProtectionGapInputs } from '../../../utils/calculations/protectionGap';
import { QuestionRunner, QuestionStep } from '../QuestionRunner';
import { ResultWrapper } from '../ResultWrapper';
import { updateStoredResults, getStoredResults } from '../../../utils/storage';
import { analytics } from '../../../utils/analytics';

interface ProtectionGapRunnerProps {
  initialProfile: UserProfile;
  savedResult?: ProtectionGapResult;
  onNavigateToTool: (toolId: ActiveToolId) => void;
  onNavigateToEducation?: () => void;
  onClose: () => void;
}

const QUESTIONS: QuestionStep[] = [
  {
    id: 'emergency_status',
    title: 'Berapa lama tabungan likuidmu bisa menopang biaya hidup jika pemasukan terhenti?',
    subtitle: 'Kas darurat adalah benteng paling dasar sebelum asuransi.',
    options: [
      { label: 'Di bawah 1 bulan', value: '<1 bln', description: 'Goncangan kecil langsung terasa mendesak', icon: '⚠️' },
      { label: '1 sampai 3 bulan', value: '1-3 bln', description: 'Cukup untuk jeda singkat', icon: '⏱️' },
      { label: '3 sampai 6 bulan', value: '3-6 bln', description: 'Standar kesehatan keuangan keluarga yang sehat', icon: '🛡️' },
      { label: 'Lebih dari 6 bulan', value: '6+ bln', description: 'Buffer sangat solid dan kuat', icon: '🏰' },
    ],
  },
  {
    id: 'dependents_status',
    title: 'Berapa orang yang bergantung secara finansial pada penghasilanmu?',
    subtitle: 'Makin banyak tanggungan, makin penting kepastian pengganti nafkah bila terjadi risiko.',
    options: [
      { label: 'Hanya membiayai diri sendiri', value: 'none', description: 'Belum ada tanggungan rutin', icon: '👤' },
      { label: 'Membantu orang tua / adik', value: 'parents', description: 'Ada alokasi nafkah rutin ke keluarga asal', icon: '🤝' },
      { label: 'Pasangan dan 1–2 anak', value: 'spouse_kids', description: 'Tanggung jawab biaya hidup & masa depan anak', icon: '👨‍👩‍👧' },
      { label: 'Keluarga besar / 3+ tanggungan', value: 'large_family', description: 'Beban nafkah sangat krusial', icon: '👨‍👩‍👧‍👦' },
    ],
  },
  {
    id: 'office_coverage',
    title: 'Apa jaminan kesehatan yang kamu miliki dari tempat kerja saat ini?',
    subtitle: 'Fasilitas kantor sangat bernilai, namun biasanya berakhir saat kamu resign atau pensiun.',
    options: [
      { label: 'Asuransi swasta plafon besar (as-charged)', value: 'office_comprehensive', description: 'Menutup sebagian besar biaya rumah sakit sesuai tagihan', icon: '🏢' },
      { label: 'Asuransi kantor plafon standar (inner limit)', value: 'office_standard', description: 'Ada batas kamar & limit tindakan tertentu', icon: '📑' },
      { label: 'Hanya BPJS Kesehatan', value: 'bpjs_only', description: 'Fasilitas dasar rujukan berjenjang', icon: '🩺' },
      { label: 'Tidak ada fasilitas kesehatan kantor', value: 'none', description: 'Seluruh biaya medis ditanggung pribadi', icon: '❌' },
    ],
  },
  {
    id: 'personal_protection',
    title: 'Apakah kamu memiliki polis asuransi mandiri yang dibeli sendiri?',
    subtitle: 'Proteksi mandiri tetap aktif melindungi di mana pun kamu bekerja atau berbisnis.',
    options: [
      { label: 'Ada, asuransi murni sesuai tagihan & jiwa berjangka', value: 'private_comprehensive', description: 'Proteksi terencana dan terpisah dari kantor', icon: '✨' },
      { label: 'Ada polis lama / unit link lama', value: 'private_traditional', description: 'Sudah berjalan tapi belum pernah di-review kesesuaiannya', icon: '📂' },
      { label: 'Hanya BPJS Kesehatan mandiri yang aktif', value: 'bpjs_active', description: 'Jaring pengaman publik standar', icon: '🏛️' },
      { label: 'Belum memiliki polis asuransi mandiri sama sekali', value: 'none', description: '100% bergantung pada kas atau kantor', icon: '⭕' },
    ],
  },
  {
    id: 'income_dependency',
    title: 'Bagaimana kondisi sumber nafkah di keluargamu?',
    subtitle: 'Menilai seberapa rentan keluarga jika sumber pemasukan utama tiba-tiba terhenti.',
    options: [
      { label: 'Saya adalah satu-satunya pencari nafkah', value: 'single_earner', description: 'Jika income terhenti, keluarga tidak punya pengganti', icon: '⚓' },
      { label: 'Saya dan pasangan sama-sama bekerja', value: 'dual_equal', description: 'Ada dua sumber nafkah yang saling menopang', icon: '⚖️' },
      { label: 'Ada sumber income pasif / bisnis keluarga', value: 'passive_exists', description: 'Arus kas tetap masuk meski saya berhenti kerja', icon: '🌱' },
      { label: 'Masih mandiri / belum ada tanggungan nafkah', value: 'no_dependents', description: 'Fokus pada keamanan diri sendiri', icon: '🎒' },
    ],
  },
  {
    id: 'major_medical_exposure',
    title: 'Bagaimana riwayat kesehatan keluarga dekat dan gaya hidupmu?',
    subtitle: 'Menentukan urgensi perlindungan terhadap risiko penyakit kritis (katastropik).',
    options: [
      { label: 'Sehat prima, tidak ada riwayat penyakit kritis keluarga', value: 'low', description: 'Risiko katastropik jangka pendek relatif rendah', icon: '🟢' },
      { label: 'Pola hidup padat / stres, ada riwayat hipertensi/kolesterol', value: 'moderate', description: 'Perlu antisipasi risiko sindrom metabolik', icon: '🟡' },
      { label: 'Ada riwayat keluarga sakit jantung, kanker, atau stroke', value: 'high', description: 'Penting menutup celah biaya perawatan medis besar', icon: '🔴' },
    ],
  },
];

export const ProtectionGapRunner: React.FC<ProtectionGapRunnerProps> = ({
  initialProfile,
  savedResult,
  onNavigateToTool,
  onNavigateToEducation,
  onClose,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [result, setResult] = useState<ProtectionGapResult | null>(savedResult || null);
  const [startTime] = useState<number>(Date.now());

  useEffect(() => {
    analytics.page('tool_protection_gap');
    analytics.track('tool_started', {
      tool_name: 'protection_gap',
      entry_point: 'tools_or_bridge',
    });
  }, []);

  const handleSelectOption = (questionId: string, value: string) => {
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);

    analytics.track('tool_question_answered', {
      tool_name: 'protection_gap',
      question_index: currentStepIndex,
      question_id: questionId,
      time_spent_ms: Date.now() - startTime,
    });

    if (currentStepIndex < QUESTIONS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      // Calculate final result
      const calculated = calculateProtectionGap(updated as ProtectionGapInputs);
      setResult(calculated);

      const stored = getStoredResults();
      updateStoredResults({
        ...stored,
        protectionGap: calculated,
        lastCompletedTool: 'protection-gap',
      });

      const durationSec = Math.round((Date.now() - startTime) / 1000);
      analytics.track('tool_completed', {
        tool_name: 'protection_gap',
        duration_sec: durationSec,
        duration_bracket: durationSec < 30 ? '<30s' : durationSec < 60 ? '30-60s' : '1-2m',
        score_status: calculated.status,
        score_bracket: calculated.overallScore >= 80 ? 'safe' : calculated.overallScore >= 60 ? 'medium' : 'low',
        is_adequately_protected: calculated.isAdequatelyProtected,
      });
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentStepIndex(0);
    setResult(null);
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      analytics.track('tool_question_back', {
        tool_name: 'protection_gap',
        from_step: currentStepIndex,
      });
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  if (!result) {
    return (
      <QuestionRunner
        toolTitle="Protection Gap Checker"
        toolCategory="Evaluasi Proteksi Finansial"
        questions={QUESTIONS}
        currentStepIndex={currentStepIndex}
        selectedValues={answers}
        onSelectOption={handleSelectOption}
        onBack={handleBack}
        onCancel={onClose}
      />
    );
  }

  // Result Rendering with 4 Layers
  return (
    <ResultWrapper
      toolTitle="Protection Gap Analysis"
      scoreNumber={`${result.overallScore} / 100`}
      scoreSublabel={result.statusLabel}
      meaning={result.summary}
      whyExplanation={result.whyExplanation}
      actionTitle="Rekomendasi Objektif Sesuai Profilmu"
      actionItems={result.recommendations.map((r) => `${r.title} — ${r.description}`)}
      onRetake={handleRetake}
      contextWaKey="family"
      recommendedTool={{
        id: 'emergency-checker',
        title: 'Emergency Fund Checker',
        description: 'Hitung durasi kas cadanganmu untuk memastikan lapis pertama proteksi aman.',
        buttonLabel: 'Cek Dana Darurat →',
      }}
      onSelectRecommendedTool={onNavigateToTool}
    >
      {/* OBJECTIVE TRANSPARENCY NOTICE */}
      <div
        className={`p-4 rounded-card border text-xs sm:text-sm leading-relaxed ${
          result.isAdequatelyProtected
            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
            : 'bg-amber-50/80 border-amber-200 text-amber-950'
        }`}
      >
        <div className="font-bold flex items-center gap-1.5 mb-1">
          {result.isAdequatelyProtected ? (
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-600" />
          )}
          <span>Catatan Objektif &amp; Transparan:</span>
        </div>
        <p>{result.neutralNote}</p>
      </div>

      {/* 4 PILLARS OF VULNERABILITY */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted">
          Peta Ketahanan 4 Sektor Proteksi
        </h4>

        <div className="space-y-2.5">
          {result.vulnerabilityPillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-card bg-background border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-soft"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-foreground">{pillar.name}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      pillar.level === 'Aman'
                        ? 'bg-emerald-100 text-emerald-800'
                        : pillar.level === 'Waspada'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {pillar.level}
                  </span>
                </div>
                <p className="text-xs text-muted mt-1 leading-relaxed">{pillar.description}</p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-teal-brand">{pillar.score} / 25</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* OPTIONAL EDUCATIONAL BRIDGE BUTTON */}
      {onNavigateToEducation && (
        <div className="pt-2">
          <button
            onClick={() => {
              analytics.track('financial_protection_viewed', { source: 'result_card_button' });
              onNavigateToEducation();
            }}
            className="w-full p-3.5 rounded-card bg-section/70 hover:bg-section border border-border text-left flex items-center justify-between group transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-4 h-4 text-teal-brand" />
              <div>
                <div className="text-xs font-bold text-foreground">
                  Pelajari Logika Skala Risiko (Kapan Asuransi Relevan?)
                </div>
                <div className="text-[11px] text-muted">
                  Edukasi objektif beda risiko kecil, menengah, dan katastropik.
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-muted group-hover:text-teal-brand group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      )}
    </ResultWrapper>
  );
};
