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
  auth: RemoteData<Auth>
  edits: {
    [quoteKey: string]: RemoteData<Quote>
  }
  path: {
    curr: string | null
    self: RemoteData<string>
  }
  quotes: {
    curr: RemoteData<Quote[]>
    self: RemoteData<Quote[]>
  }
}
