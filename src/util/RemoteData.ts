/*
  Mimicking Elm's RemoteData with TypeScript
  > http://package.elm-lang.org/packages/ohanhi/remotedata-http/latest

  type RemoteData e a
      = NotAsked
      | Loading
      | Failure e
      | Success a

 */

export interface RemoteData<S, F> {
  notAsked: boolean
  loading: boolean
  failure: false | F
  success: false | S
}

export const RD = {
  notAsked: <S, F = Error>(): RemoteData<S, F> => ({
    notAsked: true,
    loading: false,
    failure: false,
    success: false,
  }),
  loading: <S, F = Error>(): RemoteData<S, F> => ({
    notAsked: false,
    loading: true,
    failure: false,
    success: false,
  }),
  failure: <S, F = Error>(failure: F): RemoteData<S, F> => ({
    notAsked: false,
    loading: false,
    failure,
    success: false,
  }),
  success: <S, F = Error>(success: S): RemoteData<S, F> => ({
    notAsked: false,
    loading: false,
    failure: false,
    success,
  }),
};
