import { Location } from 'history'

interface ActionReduxInit {
  type: '@@redux/INIT'
}

interface ActionError {
  type: 'error'
  error: Error
}

interface ActionLocation {
  type: 'location'
  location: Location
}

interface ActionPathCurr {
  type: 'path.curr'
  path: string
}

interface ActionPathSelf {
  type: 'path.self'
  path: string
}

interface ActionQuotesGet {
  type: 'quotes.get'
  quotes: Quote[]
}

export type Action =
  | ActionReduxInit
  | ActionError
  | ActionLocation
  | ActionPathCurr
  | ActionPathSelf
  | ActionQuotesGet

export interface Quote {
  key: string // Firebase key
  source: string
  words: string
}

export interface State {
  auth?: UserAuth
  path: {
    curr?: string
    self?: string
  }
  quotes?: Quote[]
}

export interface UserAuth {
  email: string
  uid: string
}

export interface UserProfile {
  path: string
}
