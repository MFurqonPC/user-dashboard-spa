export default function LoadingState() {
  return (
    <div className="flex flex-col items-center gap-3 py-24" role="status" aria-live="polite">
      <span className="h-9 w-9 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
      <p className="text-sm text-gray-500">Sedang mengambil data...</p>
    </div>
  )
}