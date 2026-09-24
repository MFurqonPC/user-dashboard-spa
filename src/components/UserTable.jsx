import { memo } from 'react'

const UserRow = memo(function UserRow({ user, onSelect }) {
  return (
    <tr
      onClick={() => onSelect(user)}
      className="cursor-pointer border-t border-gray-100 transition hover:bg-emerald-50"
    >
      <td className="px-4 py-3 font-medium text-gray-800">{user.name}</td>
      <td className="px-4 py-3 text-gray-600">{user.email}</td>
      <td className="hidden px-4 py-3 text-gray-600 md:table-cell">{user.address.city}</td>
      <td className="hidden px-4 py-3 text-gray-600 md:table-cell">{user.company.name}</td>
    </tr>
  )
})

export default function UserTable({ users, onSelect }) {
  if (users.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-gray-300 py-16 text-center text-sm text-gray-500">
        Tidak ada pengguna yang cocok dengan pencarianmu.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">Nama</th>
            <th className="px-4 py-3">Email</th>
            <th className="hidden px-4 py-3 md:table-cell">Kota</th>
            <th className="hidden px-4 py-3 md:table-cell">Perusahaan</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <UserRow key={user.id} user={user} onSelect={onSelect} />
          ))}
        </tbody>
      </table>
    </div>
  )
}