import portfolioItems from './portfolio.json';

export const STUDIO_INFO = {
  name: '70 Studio',
  tagline: 'Timeless memories, lovingly captured',
  subTagline: 'Professional Photography Studio in Duren Sawit, Jakarta Timur',
  phone: '082299963635',
  phoneDisplay: '+62 822-9996-3635',
  email: 'Studiofoto70@gmail.com',
  address: 'Jl. Selat Bali No.E12 NO 3, RT.4/RW.17, Duren Sawit, Kec. Duren Sawit, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13440',
  operatingHours: 'Setiap Hari: 09:00 - 21:00 WIB',
  mapsUrl: 'https://maps.google.com/?q=Jl.+Selat+Bali+No.E12+NO+3,+RT.4/RW.17,+Duren+Sawit,+Jakarta+Timur',
  mapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.2403612543977!2d106.9118501!3d-6.2319999!2m3!1f0!2f0!3f0!3m2!1i1024!2f768!4f13.1!3m3!1m2!1s0x2e69f34f71a48695%3A0x8673a6ad031bb990!2sDuren%20Sawit%2C%20East%20Jakarta%20City%2C%20Jakarta!5e0!3m2!1sen!2sid!4v1710000000000!5m2!1sen!2sid',
  getWhatsAppUrl: (customMessage) => {
    const text = customMessage || 'Halo 70 Studio, saya ingin menanyakan informasi paket foto & ketersediaan jadwal pemotretan.';
    return `https://wa.me/6282299963635?text=${encodeURIComponent(text)}`;
  }
};

export const CATEGORIES = [
  { id: 'all', name: 'All', label: 'Semua Koleksi' },
  { id: 'Prewedding', name: 'Prewedding', label: 'Prewedding', cover: '/portfolio/Prewedding/08_DSCF2216.jpg', desc: 'Romansa abadi berdua dalam estetika elegan dan hangat' },
  { id: 'Graduation', name: 'Graduation', label: 'Wisuda', cover: '/portfolio/Graduation/01_DSCF0311.jpg', desc: 'Rayakan pencapaian terbaik bersama jubah kebanggaan' },
  { id: 'Family', name: 'Family', label: 'Keluarga', cover: '/portfolio/Family/01_DSCF0010.jpg', desc: 'Kehangatan & tawa keluarga dalam satu frame penuh makna' },
  { id: 'Group', name: 'Group', label: 'Sahabat & Grup', cover: '/portfolio/Group/01_DSCF0105.jpg', desc: 'Momen kebersamaan seru bersama sahabat terdekat' },
  { id: 'Maternity', name: 'Maternity', label: 'Kehamilan', cover: '/portfolio/Maternity/01_DSCF1011.jpg', desc: 'Perjalanan cinta menyambut kehadiran buah hati tersayang' },
  { id: 'Model', name: 'Model', label: 'Fashion & Model', cover: '/portfolio/Model/07_dasha-25-juli-20254413.jpg', desc: 'Editorial look, lookbook komersial, & portfolio modelling' },
  { id: 'Personal', name: 'Personal', label: 'Personal Portrait', cover: '/portfolio/Personal/02_DSCF1440.jpg', desc: 'Eksplorasi karakter & profil diri dengan pencahayaan sinematik' },
  { id: 'Birthday', name: 'Birthday', label: 'Ulang Tahun & Kids', cover: '/portfolio/Birthday/01_DSCF6667_.jpg', desc: 'Kemeriahan hari spesial bertabur senyum ceria' }
];

export const PACKAGES = [
  {
    id: 'personal',
    name: 'Personal & Portrait',
    category: 'Personal',
    price: 'IDR 350K',
    unit: '/ sesi',
    featured: false,
    features: [
      '1 Orang / Personal session',
      'Durasi 45 menit photoshoot',
      '1 Konsep background studio',
      'All unedited files via Google Drive',
      '5 Edited high-res photos',
      'Full lighting & camera equipment'
    ]
  },
  {
    id: 'graduation-group',
    name: 'Graduation & Group',
    category: 'Graduation / Group',
    price: 'IDR 650K',
    unit: '/ sesi',
    featured: true,
    features: [
      'Hingga 5-8 orang peserta',
      'Durasi 60-75 menit photoshoot',
      'Pilihan 2 background studio',
      'All original softcopy files',
      '10 Master edited high-res photos',
      'Bebas bawa props & atribut kelulusan',
      'Free konsultasi pose & pengarahan gaya'
    ]
  },
  {
    id: 'family',
    name: 'Family Celebration',
    category: 'Family',
    price: 'IDR 850K',
    unit: '/ sesi',
    featured: false,
    features: [
      'Keluarga hingga 10-12 orang',
      'Durasi 90 menit photoshoot santai',
      'Multiple setup & ganti pakaian (2x)',
      'All original digital photos',
      '15 Master edited high-res photos',
      'Ruang ganti & make-up room nyaman'
    ]
  },
  {
    id: 'prewedding',
    name: 'Prewedding & Maternity',
    category: 'Prewedding',
    price: 'IDR 1.250K',
    unit: '/ sesi',
    featured: false,
    features: [
      'Pasangan romantis / calon orang tua',
      'Durasi 2 jam photoshoot intim',
      '2-3 Pilihan background & konsep mood',
      'All unedited files in full resolution',
      '20 Fine-art edited photos',
      'Moodboard consultation & styling assist'
    ]
  }
];

export const FAQS = [
  {
    q: 'Bagaimana cara booking sesi pemotretan di 70 Studio?',
    a: 'Sangat mudah! Cukup klik tombol WhatsApp di website ini untuk menghubungi admin kami. Tentukan tanggal, jam, dan paket foto yang Anda inginkan, lalu konfirmasi dengan uang muka (DP) untuk mengunci jadwal pemotretan Anda.'
  },
  {
    q: 'Apakah bisa membawa kostum, baju ganti, atau perlengkapan sendiri?',
    a: 'Tentu saja! Kami sangat menganjurkan Anda membawa pakaian atau props khusus (seperti buket bunga wisuda, balon ulang tahun, atau atribut keluarga) agar hasil foto semakin personal dan berkesan. Kami menyediakan ruang ganti yang nyaman di studio.'
  },
  {
    q: 'Berapa lama proses pengerjaan dan pengiriman file foto?',
    a: 'Seluruh file original (softcopy) akan dikirimkan via tautan Google Drive maksimal 1-2 hari setelah sesi pemotretan. Untuk foto pilihan yang diedit (color grading & retouching) membutuhkan waktu 4-7 hari kerja.'
  },
  {
    q: 'Di mana lokasi studio dan apakah ada fasilitas parkir?',
    a: '70 Studio berlokasi di Jl. Selat Bali No.E12 NO 3, RT.4/RW.17, Duren Sawit, Jakarta Timur. Lokasi strategis, mudah diakses kendaraan roda 2 maupun roda 4, serta tersedia area parkir yang aman di area studio.'
  },
  {
    q: 'Apakah bisa reschedule jika ada halangan mendadak?',
    a: 'Bisa, Anda dapat mengajukan permohonan reschedule paling lambat H-3 sebelum jadwal pemotretan dengan konfirmasi ke admin WhatsApp kami, menyesuaikan slot jadwal yang masih tersedia.'
  }
];

export { portfolioItems };
