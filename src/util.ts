import { Location } from 'history'

import { RESERVED_WORDS } from 'src/constants'

export const extractUrlId = (location: Location): string | null => {
  // '/:user/foo/bar' >>> ['', :user, 'foo', 'bar']
  const urlId = location.pathname.split('/')[1]
  if (!urlId || !urlId.length) return null
  if (RESERVED_WORDS[urlId]) return null
  return urlId
}
