import { Auth, Quote, State } from 'src/interfaces'
import RemoteData from 'src/util/RemoteData'

export const getInit = ({ currPath }: { currPath: string | null }): State => ({
  auth: new RemoteData<Auth, Error>(),
  edits: {},
  path: {
    curr: currPath,
    self: new RemoteData<string, Error>(),
  },
  quotes: {
    curr: new RemoteData<Quote[], Error>(),
    self: new RemoteData<Quote[], Error>(),
  },
})
