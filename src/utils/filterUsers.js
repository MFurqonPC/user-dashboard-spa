export function filterUsers(users, keyword) {
  const q = keyword.trim().toLowerCase()
  if (!q) return users
  return users.filter(
    (user) =>
      user.name.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q)
  )
}