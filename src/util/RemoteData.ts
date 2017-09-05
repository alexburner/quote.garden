/*
  Mimicking Elm's RemoteData with TypeScript
  > http://package.elm-lang.org/packages/ohanhi/remotedata-http/latest

  type RemoteData e a
      = NotAsked
      | Loading
      | Failure e
      | Success a

 */

export default class RemoteData<S, F = Error> {
  public notAsked: boolean = true
  public loading: boolean = false
  public failure: F | void
  public success: S | void
}

export async function ask<S, F = Error>(
  fetcher: (...args: any[]) => Promise<S> | S,
  args: any[],
  rd: RemoteData<S, F>,
): Promise<S> {
  rd.notAsked = false
  rd.loading = true
  try {
    rd.success = await fetcher(...args)
    rd.loading = false
    return rd.success
  } catch (thrown) {
    rd.failure = thrown as F // <-- Warning! we assume fetcher throws F
    rd.loading = false
    throw rd.failure
  }
}

/*
  Example use:

  // 1. import RemoteData constructor & ask function
  import RemoteData, { ask } from 'src/stateless/RemoteData'

  // 2.a. add type for remote data response
  type User = { data: any }
  // 2.b. add params for remote data request
  const userParams = [{ url: 'foo/bar' }, 5, 6]
  // 2.c. add function for fetching remote data
  async function fetchUsers(params): Promise<User[]> {
    return await Promise.resolve([{ data: params }])
  }

  // 3. create the RemoteData object
  const rUsers = new RemoteData<User[]>()

  // elm-> NotAsked
  rUsers.notAsked // true
  rUsers.loading // false
  rUsers.success // void
  rUsers.failure // void

  // 4. ask for data using RemoteData object
  const usersPromise = ask<User[]>(fetchUsers, userParams, rUsers)

  // elm-> Loading
  rUsers.notAsked // false
  rUsers.loading // true
  rUsers.success // void
  rUsers.failure // void

  // 5. handle promise returned by async ask
  usersPromise
    .then((users: User[]) => {
      // elm-> Success
      rUsers.notAsked // false
      rUsers.loading // false
      rUsers.success // User[]
      rUsers.failure // void
    })
    .catch((error: Error) => {
      // elm-> Failure
      rUsers.notAsked // false
      rUsers.loading // false
      rUsers.success // void
      rUsers.failure // Error
    })

 */
