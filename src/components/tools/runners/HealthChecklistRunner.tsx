import React, { useState } from 'react';
import { 
  UserProfile, 
  HealthChecklistResult, 
  ActiveToolId,
  FamilyHistoryCondition 
} from '../../../types/profile';
import { evaluateHealthChecklist } from '../../../data/healthChecklistData';
import { updateStoredProfile, updateStoredResults } from '../../../utils/storage';
import { QuestionRunner, QuestionStep } from '../QuestionRunner';
import { ResultWrapper } from '../ResultWrapper';
import { ShieldCheck, CheckCircle2, AlertTriangle, Stethoscope, ChevronRight } from 'lucide-react';

interface HealthChecklistRunnerProps {
  initialProfile: UserProfile;
  savedResult?: HealthChecklistResult;
  onNavigateToTool: (toolId: ActiveToolId) => void;
  onClose: () => void;
}

export const HealthChecklistRunner: React.FC<HealthChecklistRunnerProps> = ({
  initialProfile,
  savedResult,
  onNavigateToTool,
  onClose,
}) => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [result, setResult] = useState<HealthChecklistResult | null>(savedResult || null);
  const [stepIndex, setStepIndex] = useState(0);

  // Progressive reveal state for family history conditions
  const [familyConditions, setFamilyConditions] = useState<FamilyHistoryCondition[]>(profile.familyConditions || []);
  const [isAnsweringFamilyConditions, setIsAnsweringFamilyConditions] = useState(false);

  const questions: QuestionStep[] = [
    {
      id: 'biologicalSex',
      title: 'Apa jenis kelamin biologis Anda?',
      subtitle: 'Beberapa parameter referensi skrining dan profil risiko metabolik berkaitan dengan faktor jenis kelamin.',
      options: [
        { label: 'Pria', value: 'male', icon: '👨' },
        { label: 'Wanita', value: 'female', icon: '👩' },
      ],
    },
    {
      id: 'familyHistory',
      title: 'Apakah ada riwayat penyakit serius pada keluarga sedarah (orang tua/kakek/nenek)?',
      subtitle: 'Misalnya diabetes, hipertensi, serangan jantung dini, kolesterol tinggi, atau kanker.',
      options: [
        { label: 'Ya, ada riwayat kesehatan keluarga', value: 'yes', description: 'Membantu memetakan parameter skrining preventif yang relevan', icon: '🧬' },
        { label: 'Tidak ada / Tidak ada catatan khusus', value: 'no', description: 'Tidak ada riwayat penyakit kronis dini di keluarga langsung', icon: '🌿' },
      ],
    },
    {
      id: 'lastHealthCheck',
      title: 'Kapan terakhir kali kamu melakukan pemeriksaan kesehatan umum (Medical Check-Up)?',
      subtitle: 'Tes darah rutin, tensi, fungsi organ, atau evaluasi dokter.',
      options: [
        { label: 'Kurang dari 6 bulan yang lalu', value: '<6m', description: 'Data parameter tubuh masih sangat mutakhir', icon: '🟢' },
        { label: '6 – 12 bulan yang lalu', value: '6-12m', description: 'Pola evaluasi tahunan teratur', icon: '🟡' },
        { label: '1 – 2 tahun yang lalu', value: '1-2y', description: 'Sudah saatnya menjadwalkan evaluasi ulang', icon: '🟠' },
        { label: 'Lebih dari 2 tahun yang lalu / Belum pernah', value: '>2y', description: 'Belum memiliki baseline data kesehatan terbaru', icon: '🔴' },
      ],
    },
  ];

  const currentSelectedValues: { [key: string]: string } = {
    biologicalSex: profile.biologicalSex || '',
    familyHistory: profile.familyHistory || '',
    lastHealthCheck: profile.lastHealthCheck || '',
  };

  const handleSelectOption = (questionId: string, value: string) => {
    const updated = {
      ...profile,
      [questionId]: value,
    };
    setProfile(updated);
    updateStoredProfile(updated);

    // If family history is 'yes', trigger progressive reveal modal or sub-step
    if (questionId === 'familyHistory' && value === 'yes') {
      setIsAnsweringFamilyConditions(true);
      return;
    }

    if (stepIndex < questions.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      const finalResult = evaluateHealthChecklist(updated);
      setResult(finalResult);
      updateStoredResults({
        healthChecklist: finalResult,
        lastCompletedTool: 'health-checklist',
      });
    }
  };

  const handleToggleCondition = (cond: FamilyHistoryCondition) => {
    const next = familyConditions.includes(cond)
      ? familyConditions.filter((c) => c !== cond)
      : [...familyConditions, cond];
    setFamilyConditions(next);
  };

  const handleSaveFamilyConditions = () => {
    const updated = {
      ...profile,
      familyConditions,
    };
    setProfile(updated);
    updateStoredProfile(updated);
    setIsAnsweringFamilyConditions(false);

    if (stepIndex < questions.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      const finalResult = evaluateHealthChecklist(updated);
      setResult(finalResult);
      updateStoredResults({
        healthChecklist: finalResult,
        lastCompletedTool: 'health-checklist',
      });
    }
  };

  if (isAnsweringFamilyConditions) {
    const conditionOptions: { id: FamilyHistoryCondition; label: string; desc: string }[] = [
      { id: 'diabetes', label: 'Diabetes Melitus / Gula Darah', desc: 'Riwayat diabetes tipe 2 pada orang tua atau saudara kandung' },
      { id: 'cardiovascular', label: 'Hipertensi / Penyakit Jantung Koroner', desc: 'Tekanan darah tinggi atau serangan jantung di usia produktif' },
      { id: 'cholesterol', label: 'Dislipidemia / Kolesterol Tinggi', desc: 'Kadar LDL/Trigliserida tinggi dalam keluarga' },
      { id: 'cancer', label: 'Onkologi / Kanker Tertentu', desc: 'Riwayat tumor atau kanker pada keluarga segaris' },
      { id: 'other', label: 'Riwayat Medis Kronis Lainnya', desc: 'Kondisi autoimun, ginjal, atau metabolik lainnya' },
    ];

    return (
      <div className="max-w-[620px] mx-auto px-4 py-8 animate-in fade-in duration-200">
        <div className="bg-card border border-border rounded-card-lg p-6 sm:p-8 shadow-card">
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-brand block mb-1">
            Progressive Disclosure • Riwayat Keluarga
          </span>
          <h3 className="text-lg font-bold text-foreground mb-1">
            Kondisi apa saja yang ada pada keluarga sedarah?
          </h3>
          <p className="text-xs text-muted mb-5 leading-relaxed">
            Pilih semua kondisi yang relevan. Informasi ini semata-mata membantu menyusun topik diskusi preventif bersama dokter Anda.
          </p>

          <div className="space-y-2.5">
            {conditionOptions.map((opt) => {
              const isChecked = familyConditions.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  onClick={() => handleToggleCondition(opt.id)}
                  className={`w-full text-left p-3.5 rounded-card border transition-all flex items-center justify-between ${
                    isChecked
                      ? 'border-teal-brand bg-teal-brand/5 ring-1 ring-teal-brand/30 shadow-soft'
                      : 'border-border bg-white hover:bg-section'
                  }`}
                >
                  <div className="pr-2">
                    <span className="text-xs font-semibold text-foreground block">{opt.label}</span>
                    <span className="text-[11px] text-muted leading-tight">{opt.desc}</span>
                  </div>
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                    isChecked ? 'border-teal-brand bg-teal-brand text-white' : 'border-border'
                  }`}>
                    {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              onClick={handleSaveFamilyConditions}
              className="inline-flex items-center gap-1.5 bg-teal-brand hover:bg-teal-light text-white text-xs font-bold py-2.5 px-5 rounded-btn shadow-soft transition-colors"
            >
              <span>Lanjutkan Pertanyaan Berikutnya</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <QuestionRunner
        toolTitle="Personal Health Checklist"
        toolCategory="Preventive Awareness"
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
      toolTitle="Personal Health Checklist"
      scoreNumber="Tersusun"
      scoreSublabel="Panduan Kesadaran Preventif Pribadi"
      meaning="Pemetaan kebiasaan sehat yang perlu dipertahankan, sinyal gaya hidup yang patut dipantau, dan poin relevan untuk didiskusikan dengan dokter."
      whyExplanation="Pendekatan preventif berbasis bukti menunjukkan bahwa deteksi dini faktor risiko jauh lebih efektif dan terjangkau dibandingkan intervensi medis kuratif di kemudian hari."
      actionTitle="Langkah Tindakan Mandiri"
      actionItems={[
        'Simpan ringkasan topik diskusi ini di ponsel sebelum menghadiri jadwal konsultasi dokter.',
        'Pertahankan jadwal aktivitas fisik dan durasi istirahat malam sebagai proteksi metabolik dasar.',
        'Pertimbangkan menjadwalkan pemeriksaan panel laboratorium rutin tahunan jika belum pernah check-up dalam 12 bulan terakhir.'
      ]}
      recommendedTool={{
        id: 'life-readiness',
        title: 'Cek Kembali Life Readiness Score',
        description: 'Satukan semua pemahaman kesehatan dan keuanganmu ke dalam skor 4 pilar kesiapan hidup terintegrasi.',
        buttonLabel: 'Buka Life Readiness Score →',
      }}
      onSelectRecommendedTool={onNavigateToTool}
      onRetake={() => {
        setResult(null);
        setStepIndex(0);
      }}
      contextWaKey="lifestyle"
    >
      {/* 3 Output Sections as Required by Section 18 */}
      <div className="space-y-4">
        {/* SECTION 1: KEEP DOING */}
        <div className="p-4 rounded-card bg-sage/10 border border-sage/30 text-xs leading-relaxed space-y-2">
          <div className="font-bold text-sage-dark flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            1. Pertahankan (Keep Doing)
          </div>
          <ul className="space-y-2 text-foreground/90 pl-1">
            {result.keepDoing.map((k, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-sage-dark font-bold">•</span>
                <span>{k}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* SECTION 2: WORTH WATCHING */}
        <div className="p-4 rounded-card bg-mustard/15 border border-mustard/30 text-xs leading-relaxed space-y-2">
          <div className="font-bold text-mustard-dark flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            2. Layak Diperhatikan (Worth Watching)
          </div>
          <ul className="space-y-2 text-foreground/90 pl-1">
            {result.worthWatching.map((w, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-mustard-dark font-bold">•</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* SECTION 3: WORTH DISCUSSING WITH A HEALTHCARE PROFESSIONAL */}
        <div className="p-4 rounded-card bg-teal-brand/10 border border-teal-brand/30 text-xs leading-relaxed space-y-2">
          <div className="font-bold text-teal-brand flex items-center gap-2">
            <Stethoscope className="w-4 h-4" />
            3. Layak Didiskusikan Bersama Dokter / Nakes
          </div>
          <ul className="space-y-2 text-foreground/90 pl-1">
            {result.worthDiscussing.map((d, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-teal-brand font-bold">•</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mandatory Medical Disclaimer (Section 18 requirement) */}
      <div className="p-3.5 rounded-card bg-section/80 border border-border/80 flex items-start gap-2.5 text-[11px] text-muted leading-relaxed">
        <ShieldCheck className="w-4 h-4 text-sage shrink-0 mt-0.5" />
        <span>{result.disclaimer}</span>
      </div>
    </ResultWrapper>
  );
};
