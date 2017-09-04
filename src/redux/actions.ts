import { Quote } from 'src/interfaces'

/*** Individual actions ***************************************/

export interface AuthRequest {
  type: 'auth.request'
}

export interface AuthResponse {
  type: 'auth.response'
  email: string
  uid: string
}

export interface Failure {
  type: 'error'
  error: Error
}

export interface PathCurr {
  type: 'path.curr'
  path: string | null
}

export interface QuotesRequest {
  type: 'quotes.request'
  path: string
  uid: string
}

export interface QuotesResponse {
  type: 'quotes.response'
  quotes: Quote[]
}

export interface Redux {
  type: '@@redux/INIT'
}

/*** Whole union ***************************************/

export type Action =
  | AuthRequest
  | AuthResponse
  | Failure
  | PathCurr
  | QuotesRequest
  | QuotesResponse
  | Redux
