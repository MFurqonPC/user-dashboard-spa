export default function SearchInput({ value, onChange }) {
  return (
    <label className="block">
      <span className="sr-only">Cari pengguna</span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ketik nama atau email..."
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
      />
    </label>
  )
}