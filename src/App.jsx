import { useCallback, useDeferredValue, useMemo, useState } from 'react'
import { useFetchUsers } from './hooks/useFetchUsers'
import { filterUsers } from './utils/filterUsers'
import SearchInput from './components/SearchInput'
import UserTable from './components/UserTable'
import UserDetailModal from './components/UserDetailModal'
import LoadingState from './components/LoadingState'
import ErrorState from './components/ErrorState'

export default function App() {
  const { users, status, errorMessage, refetch } = useFetchUsers()
  const [keyword, setKeyword] = useState('')
  const [activeUser, setActiveUser] = useState(null)

  // input selalu responsif, filtering diproses dengan prioritas lebih rendah
  const deferredKeyword = useDeferredValue(keyword)

  const visibleUsers = useMemo(
    () => filterUsers(users, deferredKeyword),
    [users, deferredKeyword]
  )

  const openDetail = useCallback((user) => setActiveUser(user), [])
  const closeDetail = useCallback(() => setActiveUser(null), [])

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-5xl px-4 py-10">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">User Dashboard</h1>
          <p className="text-sm text-gray-500">Klik salah satu baris untuk melihat detail pengguna.</p>
        </header>

        {status === 'success' && (
          <div className="mb-4">
            <SearchInput value={keyword} onChange={setKeyword} />
          </div>
        )}

        {status === 'loading' && <LoadingState />}
        {status === 'error' && <ErrorState message={errorMessage} onRetry={refetch} />}
        {status === 'success' && (
          <>
            <p className="mb-2 text-xs text-gray-500">
              Menampilkan {visibleUsers.length} dari {users.length} pengguna
            </p>
            <UserTable users={visibleUsers} onSelect={openDetail} />
          </>
        )}
      </main>

      {activeUser && <UserDetailModal user={activeUser} onClose={closeDetail} />}
    </div>
  )
}