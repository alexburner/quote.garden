import { Profile, Quote, User } from 'src/Fireapp'

interface AttemptAuth {
  type: 'AttemptAuth'
  email: string
  pass: string
}

interface AttemptRegister {
  type: 'AttemptRegister'
  email: string
  pass: string
}

interface CurrProfileChange {
  type: 'CurrProfileChange'
  profile: Profile | null
}

interface CurrQuotesChange {
  type: 'CurrQuotesChange'
  quotes: Quote[]
}

interface ErrorAuth {
  type: 'ErrorAuth'
  message: string
}

interface ErrorRegister {
  type: 'ErrorRegister'
  message: string
}

interface FireappAuthenticate {
  type: 'FireappAuthenticate'
  email: string
  pass: string
}

interface FireappRegister {
  type: 'FireappRegister'
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

interface UserChange {
  type: 'UserChange'
  user: User | null
}

interface Redux {
  type: '@@redux/INIT'
}

export type Actions =
  | AttemptAuth
  | AttemptRegister
  | CurrProfileChange
  | CurrQuotesChange
  | ErrorAuth
  | ErrorRegister
  | FireappAuthenticate
  | FireappRegister
  | FireappRemoveCurr
  | FireappRemoveSelf
  | FireappUpdateCurr
  | FireappUpdateSelf
  | SelfProfileChange
  | SelfQuotesChange
  | UrlIdChange
  | UserChange
  | Redux
