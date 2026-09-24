export default function ErrorState({ message, onRetry }) {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center" role="alert">
      <h2 className="text-lg font-semibold text-rose-700">Data belum bisa ditampilkan</h2>
      <p className="mt-2 text-sm text-rose-600">
        Terjadi kendala saat menghubungi server. Cek koneksi internetmu, lalu coba lagi.
      </p>
      <p className="mt-1 text-xs text-rose-400">Detail: {message}</p>
      <button
        onClick={onRetry}
        className="mt-5 rounded-lg bg-rose-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
      >
        Coba lagi
      </button>
    </div>
  )
}