import { Account, Profile, Quote } from 'src/Fireapp'

interface AccountChange {
  type: 'AccountChange'
  account: Account | null
}

interface AttemptAuth {
  type: 'AttemptAuth'
  email: string
  pass: string
}

interface AuthError {
  type: 'AuthError'
  message: string
}

interface CurrProfileChange {
  type: 'CurrProfileChange'
  profile: Profile | null
}

interface CurrQuotesChange {
  type: 'CurrQuotesChange'
  quotes: Quote[]
}

interface FireappAuthenticate {
  type: 'FireappAuthenticate'
  email: string
  pass: string
}

interface FireappRemoveCurr {
  type: 'FireappRemoveCurr'
}

interface FireappRemoveSelf {
  type: 'FireappRemoveSelf'
}

interface FireappUpdateCurr {
  type: 'FireappUpdateCurr'
  urlId: string
}

interface FireappUpdateSelf {
  type: 'FireappUpdateSelf'
  uid: string
}

interface SelfProfileChange {
  type: 'SelfProfileChange'
  profile: Profile | null
}

interface SelfQuotesChange {
  type: 'SelfQuotesChange'
  quotes: Quote[]
}

interface UrlIdChange {
  type: 'UrlIdChange'
  urlId: string | null
}

interface Redux {
  type: '@@redux/INIT'
}

export type Actions =
  | AccountChange
  | AttemptAuth
  | AuthError
  | CurrProfileChange
  | CurrQuotesChange
  | FireappAuthenticate
  | FireappRemoveCurr
  | FireappRemoveSelf
  | FireappUpdateCurr
  | FireappUpdateSelf
  | SelfProfileChange
  | SelfQuotesChange
  | UrlIdChange
  | Redux
