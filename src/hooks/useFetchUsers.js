import { useCallback, useEffect, useState } from 'react'
import { getUsers } from '../services/userService'

export function useFetchUsers() {
  const [users, setUsers] = useState([])
  const [status, setStatus] = useState('loading') // 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setStatus('loading')

    getUsers(controller.signal)
      .then((data) => {
        setUsers(data)
        setStatus('success')
      })
      .catch((err) => {
        if (err.name === 'AbortError') return // request sengaja dibatalkan
        setErrorMessage(err.message)
        setStatus('error')
      })

    // cleanup: batalkan request jika komponen unmount / efek dijalankan ulang
    return () => controller.abort()
  }, [attempt]) // hanya berubah saat user menekan "Coba lagi"

  const refetch = useCallback(() => setAttempt((n) => n + 1), [])

  return { users, status, errorMessage, refetch }
}