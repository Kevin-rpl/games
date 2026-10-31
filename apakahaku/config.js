/* =====================================================
   APAKAH AKU — GAME CONFIG
   Edit di sini untuk mengkustomisasi game!
   ===================================================== */

const GAME_CONFIG = {

  /* --------------------------------------------------------
     NAMA TOMBOL OPSI
  -------------------------------------------------------- */
  option1Label: "⚠️ ANCAMAN",        // Tombol 1
  option2Label: "✅ TIDAK ANCAMAN",  // Tombol 2

  /* --------------------------------------------------------
     SOAL-SOAL GAME (20 FOTO)
     correct: 1 = ANCAMAN yang benar
     correct: 2 = TIDAK ANCAMAN yang benar
  -------------------------------------------------------- */
  questions: [
    {
      // 1. Hutan → Tidak Ancaman
      photo: "photos/hutan.jpg",
      correct: 2
    },
    {
      // 2. Hewan (Orangutan) → Tidak Ancaman
      photo: "photos/hewan.jpg",
      correct: 2
    },
    {
      // 3. Raffi Ahmad → Ancaman
      photo: "photos/raffiahmad.png",
      correct: 1
    },
    {
      // 4. Willie Salim → Ancaman (foto dari media)
      photo: "photos/williesalim.png",
      correct: 1
    },
    {
      // 5. Prabowo → Ancaman
      photo: "photos/prabowo.png",
      correct: 1
    },
    {
      // 6. Tedy (Sebastian Tedy - YouTuber) → Ancaman
      photo: "photos/tedy.png",
      correct: 1
    },
    {
      // 7. TNI → Ancaman
      photo: "photos/tni.png",
      correct: 1
    },
    {
      // 8. DPR (Gedung MPR/DPR) → Ancaman
      photo: "photos/dpr.png",
      correct: 1
    },
    {
      // 9. Polisi → Ancaman
      photo: "photos/polisi.png",
      correct: 1
    },
    {
      // 10. Ikan → Tidak Ancaman
      photo: "photos/ikan.jpg",
      correct: 2
    },
    {
      // 11. Monyet → Tidak Ancaman
      photo: "photos/monyet.png",
      correct: 2
    },
    {
      // 12. Orangutan → Tidak Ancaman
      photo: "photos/orangutan.jpg",
      correct: 2
    },
    {
      // 13. Laut → Tidak Ancaman
      photo: "photos/laut.jpg",
      correct: 2
    },
    {
      // 14. Sampah → Ancaman
      photo: "photos/sampah.jpg",
      correct: 1
    },
    {
      // 15. Gunung → Tidak Ancaman
      photo: "photos/gunung.jpg",
      correct: 2
    },
    {
      // 16. Pantai → Tidak Ancaman
      photo: "photos/pantai.jpg",
      correct: 2
    },
    {
      // 17. Harimau → Tidak Ancaman
      photo: "photos/harimau.jpg",
      correct: 2
    },
    {
      // 18. Burung Elang → Tidak Ancaman
      photo: "photos/burung elang jawa.jpg",
      correct: 2
    },
    {
      // 19. Banjir → Ancaman
      photo: "photos/banjir.jpg",
      correct: 1
    },
    {
      // 20. Perkebunan → Tidak Ancaman
      photo: "photos/perkebunan.jpg",
      correct: 2
    },
  ],

  /* --------------------------------------------------------
     WAKTU PER LEVEL (dalam detik)
  -------------------------------------------------------- */
  levels: {
    ez:   { time: 10, label: "EZ",        icon: "⚡" },
    mid:  { time: 8,  label: "MENENGAH",  icon: "🔥" },
    hard: { time: 5,  label: "SUSAH BOS", icon: "💀" },
  },

  /* --------------------------------------------------------
     POIN UNTUK JAWABAN BENAR
  -------------------------------------------------------- */
  pointsPerCorrect: 100,
};
