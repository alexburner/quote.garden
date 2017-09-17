import { Profile, Quote, User } from 'src/Fireapp'

interface UserData {
  profile: Profile | null
  quotes: Quote[]
}

export interface State {
  user: User | null
  curr: UserData
  self: UserData
  urlId: string | null
  isAuthenticating: boolean
  isRegistering: boolean
}

export const getInit = (): State => ({
  user: null,
  curr: {
    profile: null,
    quotes: [],
  },
  self: {
    profile: null,
    quotes: [],
  },
  urlId: null,
  isAuthenticating: false,
  isRegistering: false,
})
