import { Quote } from 'src/Fireapp'

// Firebase auth + profile + quotes
export interface User {
  quotes: Quote[]
  uid: string
  urlId: string
}

// Signed in user
export interface Self extends User {
  email: string
}

export interface State {
  curr: User
  self: Self
  isAuthenticating: boolean
  isRegistering: boolean
}

export const getInit = (): State => ({
  curr: null,
  self: null,
  isAuthenticating: false,
  isRegistering: false,
})
