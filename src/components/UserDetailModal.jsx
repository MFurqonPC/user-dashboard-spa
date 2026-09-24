import { useEffect } from 'react'

function Field({ label, children }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</dt>
      <dd className="mt-0.5 text-sm text-gray-800">{children}</dd>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section className="mt-5 border-t border-gray-100 pt-4">
      <h3 className="mb-3 text-sm font-semibold text-emerald-700">{title}</h3>
      <dl className="grid gap-3 sm:grid-cols-2">{children}</dl>
    </section>
  )
}

export default function UserDetailModal({ user, onClose }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const { address, company } = user

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
      >
        <header className="flex items-start justify-between gap-4">
          <div>
            <h2 id="user-modal-title" className="text-xl font-bold text-gray-900">
              {user.name}
            </h2>
            <p className="text-sm text-gray-500">@{user.username}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup detail"
            className="rounded-lg px-2.5 py-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            ✕
          </button>
        </header>

        <Section title="Kontak">
          <Field label="Email">{user.email}</Field>
          <Field label="Telepon">{user.phone}</Field>
          <Field label="Website">{user.website}</Field>
        </Section>

        <Section title="Alamat">
          <Field label="Jalan">{address.street}, {address.suite}</Field>
          <Field label="Kota">{address.city}</Field>
          <Field label="Kode pos">{address.zipcode}</Field>
        </Section>

        <Section title="Perusahaan">
          <Field label="Nama">{company.name}</Field>
          <Field label="Slogan">{company.catchPhrase}</Field>
          <Field label="Bisnis">{company.bs}</Field>
        </Section>
      </div>
    </div>
  )
}