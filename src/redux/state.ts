import { Quote, UserData } from 'src/util/Fireapp'

export interface State {
  curr: UserData | null
  self: UserData | null
  is: {
    initialized: boolean
    authenticating: boolean
    registering: boolean
  }
}

export const getInit = (): State => ({
  curr: null,
  self: null,
  is: {
    initialized: false,
    authenticating: false,
    registering: false,
  },
})
