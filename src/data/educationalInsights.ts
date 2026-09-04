export interface EducationalArticle {
  id: string;
  title: string;
  readTime: string;
  category: 'Keuangan' | 'Kesehatan' | 'Resiliensi' | 'Gaya Hidup';
  summary: string;
  keyTakeaway: string;
  content: string[];
}

export const EDUCATIONAL_ARTICLES: EducationalArticle[] = [
  {
    id: 'dana-darurat-6-bulan',
    title: 'Kenapa dana darurat 6 bulan belum tentu selalu cukup?',
    readTime: '2 menit baca',
    category: 'Keuangan',
    summary: 'Banyak orang merasa aman begitu tabungan mencapai 6 kali pengeluaran bulanan. Namun rumus ini sering kali mengasumsikan pengeluaran hanya terjadi secara linier.',
    keyTakeaway: 'Kekuatan dana darurat tidak hanya diukur dari durasi bulanan, melainkan dari kemampuannya menyerap satu benturan modal besar sekaligus.',
    content: [
      'Aturan praktis (rule of thumb) 3–6 bulan pengeluaran bulanan sangat baik sebagai fondasi awal. Namun dalam realitas kehidupan, musibah atau pengeluaran mendadak jarang datang dengan mencicil per bulan.',
      'Sering kali, pengeluaran tak terduga datang dalam bentuk satu gelombang besar seketika: misalnya tagihan medis keluarga sebesar Rp30–50 juta, perbaikan darurat rumah tangga, atau kendaraan.',
      'Jika seseorang memiliki dana darurat Rp60 juta (cukup untuk 6 bulan dengan biaya hidup Rp10 juta/bulan), lalu tiba-tiba terjadi tagihan mendadak Rp45 juta, maka sisa dana hanya Rp15 juta — runway yang tadinya 6 bulan langsung terpangkas drastis menjadi hanya 1,5 bulan.',
      'Karena itu, pendekatan manajemen risiko yang lebih bijak membagi kesiapan menjadi dua lapisan: buffer likuid untuk arus kas sehari-hari, dan proteksi risiko khusus untuk peristiwa berbiaya sangat besar.'
    ]
  },
  {
    id: 'biaya-rumah-sakit-risiko',
    title: 'Biaya rumah sakit bukan satu-satunya risiko saat sakit.',
    readTime: '2.5 menit baca',
    category: 'Resiliensi',
    summary: 'Ketika seseorang jatuh sakit, perhatian biasanya tertuju pada biaya kuitansi rumah sakit. Padahal dampak finansial terbesar sering kali terjadi di luar bangsal perawatan.',
    keyTakeaway: 'Dampak medis adalah kombinasi antara tagihan langsung (direct cost) dan hilangnya kapasitas produktif (income interruption).',
    content: [
      'Dalam analisis risiko aktuaria, kerugian akibat sakit terbagi menjadi Direct Medical Costs dan Indirect Productivity Loss.',
      'Direct costs adalah yang tertulis pada invoice: kamar, dokter, obat-obatan, dan tindakan bedah. Namun indirect costs sering kali jauh lebih besar dan berlangsung lebih lama:',
      '1. Income Interruption: Bagi pekerja mandiri, profesional lepas, atau pemilik usaha, waktu pemulihan sering kali berarti penghentian pemasukan seketika.',
      '2. Caregiver Burden: Pasangan atau anggota keluarga yang harus mendampingi sering kali mengalami penurunan jam kerja dan produktivitas.',
      '3. Biaya Pasca Rawat: Obat rawat jalan jangka panjang, rehabilitasi medis, suplemen khusus, dan penyesuaian gaya hidup yang tidak terhitung di tagihan awal.',
      'Melihat risiko secara utuh membantu kita menyusun rencana pemulihan yang realistis, bukan hanya berfokus pada melunasi invoice rumah sakit.'
    ]
  },
  {
    id: 'penghasilan-besar-financial-resilience',
    title: 'Penghasilan besar belum tentu berarti financially resilient.',
    readTime: '2 menit baca',
    category: 'Keuangan',
    summary: 'Banyak profesional muda dengan penghasilan puluhan juta per bulan terkejut ketika simulasi menunjukkan daya tahan keuangan mereka kurang dari 60 hari.',
    keyTakeaway: 'Tingkat resiliensi finansial ditentukan oleh rasio komitmen tetap terhadap aset likuid, bukan oleh nominal slip gaji.',
    content: [
      'Gaji atau omzet yang tinggi sering kali diiringi oleh apa yang dikenal sebagai Lifestyle Inflation (inflasi gaya hidup) dan lonjakan Fixed Commitments (kewajiban tetap).',
      'Seseorang dengan gaji Rp40 juta/bulan tetapi memiliki cicilan rumah, mobil, dan biaya rutin sebesar Rp35 juta/bulan hanya menyisakan ruang gerak Rp5 juta (12.5%). Jika arus kas terganggu 2 bulan saja, defisit yang terkumpul mencapai Rp70 juta.',
      'Bandingkan dengan seseorang berpenghasilan Rp15 juta/bulan dengan komitmen tetap Rp8 juta/bulan dan tabungan likuid Rp50 juta. Orang kedua memiliki resiliensi (ketahanan goncangan) yang jauh lebih tangguh.',
      'Mengukur kesehatan keuangan dengan pendekatan stress-test membantu kita mengidentifikasi celah kerapuhan sebelum goncangan nyata terjadi.'
    ]
  },
  {
    id: 'koneksi-healthy-lifestyle-finansial',
    title: 'Kenapa healthy lifestyle dan financial readiness saling berkaitan?',
    readTime: '2 menit baca',
    category: 'Kesehatan',
    summary: 'Kesehatan fisik dan kesehatan finansial sering dipandang sebagai dua topik yang terpisah. Di balik angka-angka, keduanya saling memperkuat atau saling merusak.',
    keyTakeaway: 'Pola tidur dan aktivitas fisik harian adalah instrumen manajemen risiko finansial preventif yang paling murah.',
    content: [
      'Kondisi kesehatan tubuh secara langsung menentukan kapasitas kita menghasilkan arus kas (earning capacity). Ketika tubuh mengalami kelelahan kronis atau penyakit degeneratif di usia produktif, potensi karier dan penghasilan jangka panjang terpengaruh secara signifikan.',
      'Sebaliknya, stres finansial yang tinggi terbukti secara ilmiah meningkatkan hormon kortisol, memperburuk kualitas tidur, dan menekan sistem kekebalan tubuh, yang pada gilirannya meningkatkan risiko masalah kesehatan fisik.',
      'Menjaga tidur 7–8 jam, jalan kaki rutin, dan nutrisi bergizi bukan hanya soal kebugaran tubuh hari ini — itu adalah bentuk perlindungan aset utama Anda: diri Anda sendiri.',
      'Ketika gaya hidup dan struktur finansial dibangun secara selaras, kita tidak hanya hidup lebih tenang, tetapi juga lebih tangguh menghadapi ketidakpastian hidup.'
    ]
  }
];
