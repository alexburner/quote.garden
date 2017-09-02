export const extractUserPath = (pathname: string): string | undefined => {
  const parts = pathname.split('/')
  if (parts.length < 2) return // Should be ['', ':user', ...etc]
  const path = parts[1]
  if (path === 'auth') return // Reserved word/route
  return path
}
