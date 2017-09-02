import { Location } from 'history'

interface ActionReduxInit {
  type: '@@redux/INIT'
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

export type Action = ActionReduxInit | ActionLocation | ActionPathCurr
| ActionPathSelf

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
