# User Dashboard

Aplikasi Single Page Application (SPA) sederhana untuk menampilkan daftar pengguna dari public API [JSONPlaceholder](https://jsonplaceholder.typicode.com/users). Dibuat dengan React (Vite) dan TailwindCSS, dengan komponen UI tanpa template dashboard.

**Link deploy:** https://user-dashboard-spa.vercel.app

## Fitur

- Daftar pengguna dalam bentuk tabel
- Pencarian realtime (client-side) berdasarkan nama atau email
- Modal detail pengguna: kontak, alamat, dan perusahaan (bisa ditutup lewat tombol x, klik area luar, atau tombol Esc)
- State loading saat data dimuat
- Pesan error yang ramah saat API gagal, lengkap dengan tombol "Coba lagi"
- Tampilan responsif (kolom Kota dan Perusahaan disembunyikan di layar kecil)

## Teknologi

- React (Vite)
- TailwindCSS
- Fetch API

## Cara Menjalankan

```bash
git clone https://github.com/MFurqonPC/user-dashboard-spa.git
cd user-dashboard-spa
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

Pengambilan data ditangani oleh custom hook `useFetchUsers`, menggunakan `useEffect` dan Fetch API. Hook ini menyimpan tiga state: `users` untuk data, `status` (`loading`/`success`/`error`), dan `errorMessage`.

**Mencegah infinite loop.** Dependency array `useEffect` hanya berisi `attempt`, sebuah counter yang bertambah setiap tombol "Coba lagi" ditekan. State `users` dan `status` sengaja tidak dimasukkan ke dependency, karena jika dimasukkan, `setUsers` akan memicu render ulang, efek berjalan kembali, fetch dipanggil lagi, dan seterusnya tanpa henti.

**Mencegah memory leak dan race condition.** Setiap fetch dibungkus dengan `AbortController`. Pada cleanup function `useEffect`, `controller.abort()` dipanggil agar request yang masih berjalan dibatalkan saat komponen unmount atau efek dijalankan ulang. Dengan begitu, tidak ada `setState` yang mengarah ke komponen yang sudah tidak ada. Error bertipe `AbortError` sengaja diabaikan karena merupakan pembatalan yang disengaja, bukan error sesungguhnya.

**Catatan saat development.** Pada dev mode, tab Network menampilkan dua request `users` — yang pertama berstatus `canceled`, yang kedua `200`. Hal ini normal, karena React StrictMode memang menjalankan efek dua kali (mount → cleanup → mount kembali) untuk membantu menemukan efek yang tidak bersih. Request pertama dibatalkan oleh `AbortController` pada cleanup, yang justru membuktikan cleanup bekerja dengan benar. Pada build production hanya terdapat satu request.

### 2. Struktur Folder

Folder dipisahkan berdasarkan tanggung jawab masing-masing:

- `services/` berisi pemanggilan API. Jika endpoint atau cara fetch berubah, perubahan cukup dilakukan di satu tempat ini, tanpa memengaruhi UI.
- `hooks/` berisi logika stateful yang dibungkus sebagai custom hook (`useFetchUsers`), sehingga komponen dapat fokus pada tampilan.
- `utils/` berisi fungsi murni seperti `filterUsers`, yang mudah diuji dan digunakan ulang karena tidak bergantung pada React.
- `components/` berisi komponen UI kecil dengan satu tanggung jawab masing-masing (tabel, input pencarian, modal, loading, error).

Dengan pemisahan ini, setiap file memiliki satu alasan untuk berubah, sehingga kode lebih mudah dibaca, dirawat, dan dikembangkan.

### 3. Optimasi Kinerja (10.000 data)

Jika API mengembalikan 10.000 data dan aplikasi mengalami lag saat mengetik di kolom pencarian, berikut pendekatan yang akan saya lakukan:

1. **`useDeferredValue`** (atau `useTransition`): input tetap diperbarui langsung, sementara proses filter dan render hasil diberi prioritas lebih rendah, sehingga proses mengetik tetap terasa responsif. Sudah diterapkan pada aplikasi ini.
2. **`useMemo`**: hasil filter hanya dihitung ulang ketika data atau kata kunci berubah, bukan pada setiap render. Sudah diterapkan.
3. **`React.memo` + `useCallback`**: baris tabel dibungkus `memo`, handler klik dibungkus `useCallback`, sehingga baris yang datanya tidak berubah tidak perlu dirender ulang.
4. **Virtualisasi list** (misalnya menggunakan `react-window`): hanya baris yang terlihat di layar yang dirender ke DOM. Ini merupakan solusi paling berdampak, karena merender 10.000 elemen DOM sekaligus adalah sumber lag utama.
5. **Opsional:** debounce pada input, atau pagination.