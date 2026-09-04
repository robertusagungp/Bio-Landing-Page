# Robertus Agung Pradana — Personal Wellness & Life Readiness Hub

Sebuah modern, mobile-first Bio Link Landing Page dan personal microsite untuk **Robertus Agung Pradana**.

Positioning Utama:
> **"A personal wellness, financial health, and life-readiness hub."**
> *"Kenali Kondisi Hidupmu Lebih Baik. Tools gratis untuk memahami kesehatan, keuangan, dan kesiapan menghadapi hal tak terduga berbasis data."*

---

## 🌟 Fitur Utama & 8 Free Interactive Tools

1. **🎯 Life Readiness Score (Flagship)**: Evaluasi 4 pilar hidup (Health, Money, Emergency, Family), analisis kekuatan, titik kerentanan terbesar, dan simulasi interaktif "What If?".
2. **🧬 Lifestyle Age**: Estimasi usia kebiasaan harian berdasarkan pola tidur, olahraga, nutrisi, stres, dan rokok dibandingkan usia KTP.
3. **🌿 Wellness Score**: Analisa 5 dimensi kebugaran harian (Movement, Sleep, Nutrition, Recovery, Lifestyle) dengan deteksi modal terkuat & titik hambatan (bottleneck).
4. **💸 Financial Health Score**: Stress-test ketahanan keuangan menghadapi jeda pemasukan 1, 3, hingga 6 bulan dengan indikator visual & deep personalized insight.
5. **🛡️ Emergency Fund Checker**: Hitung runway kas likuid (bulan) dan simulasi dampak benturan pengeluaran mendadak (Rp25jt, Rp50jt).
6. **🏥 Medical Cost Scenario Simulator**: Simulasi rentang biaya rawat inap rumah sakit swasta berdasarkan kota, tier RS, dan tindakan, serta dampaknya pada runway dana darurat.
7. **👨‍👩‍👧 Family Readiness Score**: Pengukuran ketahanan kesinambungan nafkah keluarga dan timeline interupsi pemasukan (bulan ke-1 hingga ke-12).
8. **📋 Personal Health Checklist**: Panduan kesadaran preventif (Keep Doing, Worth Watching, Worth Discussing) dengan pengungkapan bertahap riwayat keluarga.

---

## 🎨 Prinsip Desain & Identitas Visual

- **Palet Warna Hangat & Berwibawa**:
  - Primary Background: `#F7F4EE` (Warm Ivory / Off White)
  - Main Text: `#172321` (Deep Charcoal Green)
  - Primary Brand: `#174C45` (Deep Forest Teal)
  - Accent: `#D9795F` (Warm Terracotta)
  - Positive: `#769B82` (Muted Sage Green)
  - Warning: `#D5A64A` (Warm Mustard)
- **Tipografi**: Plus Jakarta Sans & Inter
- **Mobile-First Bio Link Layout**: Lebar terfokus 600–760px di desktop, responsif sempurna di perangkat seluler.
- **Privacy-First**: Seluruh data tersimpan secara lokal di browser (`localStorage`) tanpa login dan tanpa pengiriman ke server pihak ketiga.

---

## 🚀 Menjalankan Secara Lokal

```bash
# Install dependensi
npm install

# Jalankan server pengembangan
npm run dev

# Build untuk produksi
npm run build

# Preview build produksi
npm run preview
```

---

## 🌐 Panduan Auto Deploy GitHub & Vercel

Proyek ini telah dikonfigurasi secara optimal untuk di-deploy ke **Vercel** dengan repository **GitHub**:

### Langkah 1: Inisialisasi Git & Push ke GitHub
```bash
# Inisialisasi repository
git init
git add .
git commit -m "feat: Robertus Agung Pradana Personal Wellness & Life Readiness Hub"

# Hubungkan ke repository GitHub Anda (buat repo baru di github.com/new)
git branch -M main
git remote add origin https://github.com/<username-anda>/<nama-repo>.git
git push -u origin main
```

### Langkah 2: Hubungkan ke Vercel (Auto Deploy)
1. Buka dashboard [Vercel](https://vercel.com).
2. Klik **"Add New..."** → **"Project"**.
3. Hubungkan akun GitHub Anda dan pilih repository ini.
4. Vercel akan otomatis mendeteksi framework **Vite**.
5. Klik **"Deploy"**.
6. Setiap kali Anda melakukan `git push` ke branch `main`, Vercel akan secara otomatis melakukan build dan deploy versi terbaru dalam hitungan detik!
