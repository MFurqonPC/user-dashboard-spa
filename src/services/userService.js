const API_URL = 'https://jsonplaceholder.typicode.com/users'

export async function getUsers(signal) {
  const response = await fetch(API_URL, { signal })
  if (!response.ok) {
    throw new Error(`Server merespons dengan status ${response.status}`)
  }
  return response.json()
}