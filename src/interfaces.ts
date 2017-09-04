import RemoteData from 'src/util/RemoteData'

export interface Auth {
  email: string | null
  uid: string | null
}

export interface Quote {
  id: number // incremental
  key: string // Firebase
  source: string
  words: string
}

export interface State {
  auth: RemoteData<Auth, Error>
  edits: {
    [quoteKey: string]: RemoteData<Quote, Error>
  }
  path: {
    curr: string | null
    self: RemoteData<string, Error>
  }
  quotes: {
    curr: RemoteData<Quote[], Error>
    self: RemoteData<Quote[], Error>
  }
}
