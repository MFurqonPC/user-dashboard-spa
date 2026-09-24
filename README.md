# User Dashboard

Aplikasi Single Page Application (SPA) sederhana untuk menampilkan daftar pengguna dari public API [JSONPlaceholder](https://jsonplaceholder.typicode.com/users). Dibuat dengan React (Vite) dan TailwindCSS, dengan komponen UI tanpa template dashboard.

**Link deploy:** [ISI_LINK_VERCEL_DI_SINI]

## Fitur

- Daftar pengguna dalam bentuk tabel
- Pencarian realtime (client-side) berdasarkan nama atau email
- Modal detail pengguna: kontak, alamat, dan perusahaan (bisa ditutup lewat tombol ✕, klik area luar, atau tombol Esc)
- State loading saat data dimuat
- Pesan error yang ramah saat API gagal, lengkap dengan tombol "Coba lagi"
- Tampilan responsif (kolom Kota dan Perusahaan disembunyikan di layar kecil)

## Teknologi

- React (Vite)
- TailwindCSS
- Fetch API

## Cara Menjalankan

```bash
git clone [ISI_LINK_REPO_DI_SINI]
cd user-dashboard
npm install
npm run dev
```

Buka `http://localhost:5173` di browser.

Untuk build production:

```bash
npm run build
npm run preview
```

## Struktur Folder

```
src/
├── services/     # pemanggilan API
├── hooks/        # custom hook (useFetchUsers)
├── utils/        # fungsi bantu (filterUsers)
├── components/   # komponen UI
├── App.jsx
└── main.jsx
```

## Jawaban Pertanyaan Pemahaman

### 1. State Management & Lifecycle

Pengambilan data saya taruh di custom hook `useFetchUsers`, pakai `useEffect` dan Fetch API biasa. Di dalamnya ada tiga state: `users` buat data-nya, `status` (`loading`/`success`/`error`), sama `errorMessage`.

**Soal infinite loop.** Dependency array `useEffect`-nya cuma saya isi `attempt` — sebuah counter yang nambah tiap kali tombol "Coba lagi" ditekan. Sengaja `users` atau `status` nggak saya masukkan ke dependency, soalnya kalau dimasukkan, `setUsers` bakal memicu render ulang, efek jalan lagi, fetch lagi, dan begitu terus tanpa berhenti.

**Soal memory leak & race condition.** Setiap fetch saya bungkus dengan `AbortController`. Di cleanup function `useEffect`, saya panggil `controller.abort()` supaya request yang masih jalan dibatalkan begitu komponen unmount atau efeknya dijalankan ulang. Jadi nggak ada `setState` yang nyasar ke komponen yang udah nggak ada. Error dengan tipe `AbortError` sengaja saya abaikan karena itu memang pembatalan yang disengaja, bukan error beneran.

**Catatan pas development.** Waktu dev mode, di tab Network kelihatan ada dua request `users` — yang pertama statusnya `canceled`, yang kedua `200`. Ini normal, karena React StrictMode memang sengaja menjalankan efek dua kali (mount → cleanup → mount lagi) untuk bantu nemuin efek yang "kotor". Request pertama dibatalkan sama `AbortController` di cleanup, jadi ini malah jadi bukti kalau cleanup-nya bekerja dengan benar. Di build production cuma ada satu request.

### 2. Struktur Folder

Saya pisah folder berdasarkan tanggung jawabnya masing-masing:

- `services/` isinya pemanggilan API. Kalau nanti endpoint atau cara fetch-nya berubah, saya cukup ubah di satu tempat ini aja, UI-nya nggak perlu diutak-atik.
- `hooks/` isinya logika stateful yang saya bungkus jadi custom hook (`useFetchUsers`), biar komponen tinggal fokus ke tampilan aja.
- `utils/` isinya fungsi murni kayak `filterUsers` — gampang dites dan dipakai ulang karena nggak nyangkut ke React sama sekali.
- `components/` isinya komponen UI kecil-kecil yang masing-masing punya satu tanggung jawab (tabel, input pencarian, modal, loading, error).

Dengan cara ini tiap file punya satu alasan aja buat berubah, jadi kodenya lebih gampang dibaca, dirawat, dan dikembangkan ke depannya.

### 3. Optimasi Kinerja (10.000 data)

Kalau API-nya balikin 10.000 data dan aplikasi jadi lag pas ngetik di kolom pencarian, ini yang bakal saya lakukan:

1. **`useDeferredValue`** (atau `useTransition`): input tetap update langsung, tapi proses filter dan render hasilnya dikasih prioritas lebih rendah, jadi ngetik tetap terasa responsif. Ini sudah saya pakai di aplikasi ini.
2. **`useMemo`**: hasil filter cuma dihitung ulang kalau data atau kata kuncinya berubah, bukan di setiap render. Sudah dipakai juga.
3. **`React.memo` + `useCallback`**: baris tabel saya bungkus `memo`, handler klik saya bungkus `useCallback`, jadi baris yang datanya nggak berubah nggak perlu dirender ulang.
4. **Virtualisasi list** (misalnya pakai `react-window`): cuma baris yang kelihatan di layar yang dirender ke DOM. Ini solusi yang paling ngefek, karena merender 10.000 elemen DOM sekaligus itu sumber lag paling besar.
5. **Opsional:** debounce di input, atau pagination.
