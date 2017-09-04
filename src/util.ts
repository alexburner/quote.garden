import { Location } from 'history'

import { RESERVED_WORDS } from 'src/constants'

export const extractUserPath = (location: Location): string | null => {
  // '/:user/foo/bar' >>> ['', :user, 'foo', 'bar']
  const userPath = location.pathname.split('/')[1]
  if (!userPath || !userPath.length) return null
  if (RESERVED_WORDS[userPath]) return null
  return userPath
}
