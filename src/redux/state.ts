import { Account, Profile, Quote } from 'src/fireapp'

interface UserData {
  profile: Profile | null
  quotes: Quote[]
}

export interface State {
  account: Account | null
  curr: UserData
  self: UserData
  urlId: string | null
}

export const getInit = (): State => ({
  account: null,
  curr: {
    profile: null,
    quotes: [],
  },
  self: {
    profile: null,
    quotes: [],
  },
  urlId: null,
})
