import React, { useState, useEffect } from 'react';
import { 
  UserProfile, 
  MedicalScenarioResult, 
  ActiveToolId 
} from '../../../types/profile';
import { simulateMedicalCost } from '../../../utils/calculations/medicalSimulator';
import { formatRupiah } from '../../../utils/formatters';
import { updateStoredResults } from '../../../utils/storage';
import { ResultWrapper } from '../ResultWrapper';
import { CalculationAccordion } from '../CalculationAccordion';
import { ShieldCheck, AlertCircle, ArrowRight, Building2, MapPin, Activity, Clock } from 'lucide-react';

interface MedicalSimulatorRunnerProps {
  initialProfile: UserProfile;
  savedResult?: MedicalScenarioResult;
  onNavigateToTool: (toolId: ActiveToolId) => void;
  onClose: () => void;
}

export const MedicalSimulatorRunner: React.FC<MedicalSimulatorRunnerProps> = ({
  initialProfile,
  savedResult,
  onNavigateToTool,
  onClose,
}) => {
  const [city, setCity] = useState('Jakarta');
  const [hospitalCategory, setHospitalCategory] = useState('mid_private');
  const [scenarioKey, setScenarioKey] = useState('simple_surgery');
  const [lengthOfStay, setLengthOfStay] = useState('3-5');

  const [result, setResult] = useState<MedicalScenarioResult>(() => {
    return savedResult || simulateMedicalCost({
      city: 'Jakarta',
      hospitalCategory: 'mid_private',
      scenarioKey: 'simple_surgery',
      lengthOfStay: '3-5',
    }, initialProfile);
  });

  const handleSimulate = (
    c = city,
    h = hospitalCategory,
    s = scenarioKey,
    l = lengthOfStay
  ) => {
    const res = simulateMedicalCost({
      city: c,
      hospitalCategory: h,
      scenarioKey: s,
      lengthOfStay: l,
    }, initialProfile);
    setResult(res);
    updateStoredResults({
      medicalScenario: res,
      lastCompletedTool: 'medical-simulator',
    });
  };

  const cities = ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Kota Lainnya'];
  const hospitalCategories = [
    { key: 'basic_private', label: 'Swasta Standar (Tipe C)' },
    { key: 'mid_private', label: 'Swasta Menengah Populer (Tipe B)' },
    { key: 'premium_private', label: 'Swasta Premium / Internasional' },
  ];
  const scenarios = [
    { key: 'mild_inpatient', label: 'Rawat Inap Ringan (DB/Tifus/Infeksi)' },
    { key: 'simple_surgery', label: 'Operasi Sedang (Apendiks/Hernia/Batu Empedu)' },
    { key: 'serious_inpatient', label: 'Perawatan Serius / ICU / Komplikasi' },
    { key: 'major_treatment', label: 'Tindakan Kritis / Bedah Jantung / Kanker' },
  ];
  const stays = [
    { key: '1-2', label: '1 – 2 Hari' },
    { key: '3-5', label: '3 – 5 Hari' },
    { key: '6-10', label: '6 – 10 Hari' },
    { key: '10+', label: '10+ Hari' },
  ];

  return (
    <div className="max-w-[680px] mx-auto px-4 py-8 animate-in fade-in duration-300">
      {/* Simulator Inputs Section */}
      <div className="bg-card border border-border rounded-card-lg p-6 sm:p-8 shadow-card mb-8">
        <div className="flex items-center justify-between pb-3 border-b border-border/80 mb-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-brand block">
              Medical Cost Scenario Simulator
            </span>
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              Kalau Tiba-Tiba Harus Dirawat, Seberapa Besar Dampaknya?
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-xs text-muted hover:text-foreground font-semibold px-2.5 py-1 rounded-full hover:bg-section"
          >
            Tutup
          </button>
        </div>

        <div className="space-y-5 text-xs">
          {/* 1. City */}
          <div>
            <label className="font-bold text-foreground mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-brand" />
              1. Pilih Kota Perawatan:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {cities.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setCity(c);
                    handleSimulate(c, hospitalCategory, scenarioKey, lengthOfStay);
                  }}
                  className={`p-2.5 rounded-xl border text-center font-medium transition-all ${
                    city === c
                      ? 'border-teal-brand bg-teal-brand text-white shadow-soft'
                      : 'border-border bg-white text-foreground hover:bg-section'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Hospital Tier */}
          <div>
            <label className="font-bold text-foreground mb-2 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-teal-brand" />
              2. Kategori Rumah Sakit:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {hospitalCategories.map((h) => (
                <button
                  key={h.key}
                  onClick={() => {
                    setHospitalCategory(h.key);
                    handleSimulate(city, h.key, scenarioKey, lengthOfStay);
                  }}
                  className={`p-3 rounded-xl border text-left font-medium transition-all ${
                    hospitalCategory === h.key
                      ? 'border-teal-brand bg-teal-brand/10 text-teal-brand ring-1 ring-teal-brand/30'
                      : 'border-border bg-white text-foreground hover:bg-section'
                  }`}
                >
                  <span className="font-semibold block">{h.label.split(' (')[0]}</span>
                  <span className="text-[10px] text-muted block mt-0.5">
                    {h.label.includes('(') ? `(${h.label.split(' (')[1]}` : ''}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Medical Scenario */}
          <div>
            <label className="font-bold text-foreground mb-2 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-teal-brand" />
              3. Skenario Tindakan Medis:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {scenarios.map((s) => (
                <button
                  key={s.key}
                  onClick={() => {
                    setScenarioKey(s.key);
                    handleSimulate(city, hospitalCategory, s.key, lengthOfStay);
                  }}
                  className={`p-3 rounded-xl border text-left font-medium transition-all ${
                    scenarioKey === s.key
                      ? 'border-teal-brand bg-teal-brand/10 text-teal-brand ring-1 ring-teal-brand/30'
                      : 'border-border bg-white text-foreground hover:bg-section'
                  }`}
                >
                  <span className="font-semibold block">{s.label.split(' (')[0]}</span>
                  <span className="text-[10px] text-muted block mt-0.5">
                    {s.label.includes('(') ? `(${s.label.split(' (')[1]}` : ''}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Length of Stay */}
          <div>
            <label className="font-bold text-foreground mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-brand" />
              4. Lama Rawat Inap (Length of Stay):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {stays.map((st) => (
                <button
                  key={st.key}
                  onClick={() => {
                    setLengthOfStay(st.key);
                    handleSimulate(city, hospitalCategory, scenarioKey, st.key);
                  }}
                  className={`p-2.5 rounded-xl border text-center font-medium transition-all ${
                    lengthOfStay === st.key
                      ? 'border-teal-brand bg-teal-brand text-white shadow-soft'
                      : 'border-border bg-white text-foreground hover:bg-section'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Simulator Results */}
      <ResultWrapper
        toolTitle="Simulasi Biaya Medis Rumah Sakit"
        scoreNumber={`${formatRupiah(result.estimatedMin, true)} – ${formatRupiah(result.estimatedMax, true)}`}
        scoreSublabel={`Estimasi Rentang Skenario (${result.city} • ${result.lengthOfStay})`}
        meaning={`Skenario ${result.scenario} di rumah sakit swasta ${result.city} rata-rata berkisar antara ${formatRupiah(result.estimatedMin)} hingga ${formatRupiah(result.estimatedMax)}.`}
        whyExplanation="Rentang biaya mencakup sewa kamar rawat inap, visit dokter spesialis, tes laboratorium penunjang, obat injeksi/oral, dan tindakan bedah terencana."
        actionTitle="Edukasi Manajemen Risiko Medis"
        actionItems={[
          'Pastikan memiliki buffer dana likuid atau proteksi kesehatan yang mencukupi biaya penjaminan rumah sakit.',
          'Ketahui syarat plafon asuransi kantor (apakah inner-limit kamar atau as-charged sesuai tagihan).',
          'Siapkan dana cadangan tersendiri untuk biaya rawat jalan pra dan pasca rawat inap yang biasanya tidak tercover kuitansi kamar.'
        ]}
        recommendedTool={{
          id: 'family-readiness',
          title: 'Cek Kesiapan Finansial Keluarga',
          description: 'Evaluasi bagaimana ketahanan keluarga Anda jika pencari nafkah utama harus menjalani masa pemulihan medis.',
          buttonLabel: 'Cek Family Readiness Score →',
        }}
        onSelectRecommendedTool={onNavigateToTool}
        onRetake={() => {
          setCity('Jakarta');
          setHospitalCategory('mid_private');
          setScenarioKey('simple_surgery');
          setLengthOfStay('3-5');
          handleSimulate('Jakarta', 'mid_private', 'simple_surgery', '3-5');
        }}
        contextWaKey="medical"
      >
        {/* Important Banner Required by Section 16 */}
        <div className="p-3.5 rounded-card bg-mustard/15 border border-mustard/30 flex items-start gap-2.5 text-[11px] text-foreground/90">
          <AlertCircle className="w-4 h-4 text-mustard-dark shrink-0 mt-0.5" />
          <span>
            <strong>Simulasi edukasi, bukan estimasi tagihan rumah sakit.</strong> Angka ini merupakan pemodelan statistik biaya umum dan dapat bervariasi bergantung kondisi klinis pasien serta kebijakan tarif masing-masing fasilitas kesehatan.
          </span>
        </div>

        {/* Dynamic Impact on Emergency Fund (Section 16 requirement) */}
        {result.emergencyImpact && (
          <div className="bg-background/80 p-5 rounded-card border border-border/80 space-y-3">
            <div className="text-xs font-bold text-foreground">
              Dampak Simulasi pada Runway Kas Daruratmu:
            </div>
            <div className="grid grid-cols-2 gap-3 text-center text-xs">
              <div className="p-3 bg-white rounded-xl border border-border/70 shadow-soft">
                <span className="text-[11px] text-muted block">Runway Sebelum Kejadian</span>
                <span className="text-xl font-extrabold text-foreground mt-1 block">
                  {result.emergencyImpact.runwayBefore} Bulan
                </span>
                <span className="text-[10px] text-muted">
                  Kas: {formatRupiah(result.emergencyImpact.savingsBefore, true)}
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-terracotta/30 shadow-soft">
                <span className="text-[11px] text-terracotta font-semibold block">Runway Setelah Tagihan</span>
                <span className="text-xl font-extrabold text-terracotta mt-1 block">
                  {result.emergencyImpact.runwayAfter} Bulan
                </span>
                <span className="text-[10px] text-muted">
                  Sisa: {formatRupiah(result.emergencyImpact.savingsAfter, true)}
                </span>
              </div>
            </div>

            {/* "Yang sering terlupakan" callout */}
            <div className="p-3 rounded-xl bg-card border border-border/80 text-[11px] text-muted leading-relaxed">
              <strong className="text-foreground">Yang sering terlupakan: </strong>
              {result.riskInsight}
            </div>
          </div>
        )}

        {/* Illustrative Cost Breakdown */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-foreground flex items-center justify-between">
            <span>Ilustrasi Komponen Tagihan (Midpoint: {formatRupiah(result.estimatedMid)})</span>
            <span className="text-[10px] text-muted">Estimasi Proporsi</span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between p-2.5 rounded-lg bg-card border border-border/70">
              <span className="text-muted">Kamar & Akomodasi Rawat Inap</span>
              <span className="font-semibold text-foreground">{formatRupiah(result.breakdown.room)}</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-card border border-border/70">
              <span className="text-muted">Jasa Visit Dokter Spesialis & Konsul</span>
              <span className="font-semibold text-foreground">{formatRupiah(result.breakdown.doctor)}</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-card border border-border/70">
              <span className="text-muted">Laboratorium & Diagnostik Penunjang</span>
              <span className="font-semibold text-foreground">{formatRupiah(result.breakdown.diagnostics)}</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-card border border-border/70">
              <span className="text-muted">Obat-obatan, Cairan & Farmasi Injeksi</span>
              <span className="font-semibold text-foreground">{formatRupiah(result.breakdown.medication)}</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-card border border-border/70">
              <span className="text-muted">Tindakan Medis, Bedah & Alat Habis Pakai</span>
              <span className="font-semibold text-foreground">{formatRupiah(result.breakdown.procedure)}</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-card border border-border/70">
              <span className="text-muted">Administrasi & Biaya Penunjang Lain</span>
              <span className="font-semibold text-foreground">{formatRupiah(result.breakdown.other)}</span>
            </div>
          </div>
        </div>

        <CalculationAccordion
          methodologyDescription="Simulasi ini menggunakan matriks indeks biaya rumah sakit swasta berdasarkan tier akreditasi, wilayah kota perawatan, kompleksitas prosedur bedah, dan lama hari observasi klinis."
          factors={[
            { name: 'Koefisien Wilayah Kota', description: 'Jakarta (1.25x), Surabaya (1.10x), Bandung (1.05x), Medan (1.0x), Kota Lain (0.9x).' },
            { name: 'Tipe Rumah Sakit', description: 'Standar C (0.85x), Menengah Populer B (1.15x), Premium Internasional A (1.65x).' },
            { name: 'Kompleksitas Tindakan', description: 'Mencakup rawat medis umum, pembedahan terencana, hingga ruang perawatan intensif (ICU).' },
          ]}
        />
      </ResultWrapper>
    </div>
  );
};
