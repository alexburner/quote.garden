import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { each } from 'lodash'
import { Store } from 'redux'
import * as shortid from 'shortid'

import { Actions } from 'src/redux/actions'
import { State } from 'src/redux/state'


// Firebase's special auth object
export interface Auth {
  email: string
  uid: string
}

// Firebase "profiles" resource
export interface Profile {
  key: string // Auth uid
  urlId: string
}

// Firebase "quotes" resource
export interface Quote {
  key: string // Firebase id
  number: number // incremental id
  source: string
  words: string
}

// Abstraction for Firebase resource listening
interface Resource {
  ref: firebase.database.Reference | null
  path: (uid: string) => string
  listener: ResourceListener
}

type ResourceListener = (snapshot: firebase.database.DataSnapshot) => void

const profileListener = (
  dispatch: (profile: Profile | null) => void,
): ResourceListener => (profileSnap: firebase.database.DataSnapshot) => {
  if (profileSnap && profileSnap.key && profileSnap.val()) {
    const value = profileSnap.val()
    dispatch({
      key: profileSnap.key,
      urlId: String(value.urlId),
    })
  } else {
    dispatch(null)
  }
}

const quotesListener = (
  dispatch: (quotes: Quote[]) => void,
): ResourceListener => (quotesSnap: firebase.database.DataSnapshot) => {
  const quotes: Quote[] = []
  if (quotesSnap && quotesSnap.val()) {
    quotesSnap.forEach(quoteSnap => {
      if (!quoteSnap.key) return false
      const value = quoteSnap.val()
      quotes.push({
        key: quoteSnap.key,
        number: Number(value.number),
        source: String(value.source),
        words: String(value.words),
      })
      return false // XXX: for firebase .forEach type
    })
  }
  dispatch(quotes)
}

export default class FireApp {
  public middleware: any // TODO: redux Middleware
  private app: firebase.app.App
  private store: Store<State> | null
  private offAuth: firebase.Unsubscribe
  private resources: {
    [name: string]: Resource
  } = {
    currProfile: {
      ref: null,
      path: (uid: string) => 'profiles/' + uid,
      listener: profileListener(profile => {
        if (!this.store) return
        this.store.dispatch<Actions>({
          type: 'CurrProfileChange',
          profile,
        })
      }),
    },
    currQuotes: {
      ref: null,
      path: (uid: string) => 'quotes/' + uid,
      listener: quotesListener(quotes => {
        if (!this.store) return
        this.store.dispatch<Actions>({
          type: 'CurrQuotesChange',
          quotes,
        })
      }),
    },
    selfProfile: {
      ref: null,
      path: (uid: string) => 'profiles/' + uid,
      listener: profileListener(profile => {
        if (!this.store) return
        this.store.dispatch<Actions>({
          type: 'SelfProfileChange',
          profile,
        })
      }),
    },
    selfQuotes: {
      ref: null,
      path: (uid: string) => 'quotes/' + uid,
      listener: quotesListener(quotes => {
        if (!this.store) return
        this.store.dispatch<Actions>({
          type: 'SelfQuotesChange',
          quotes,
        })
      }),
    },
  }

  constructor() {
    this.app = firebase.initializeApp({
      apiKey: 'AIzaSyDR2zyCGLTU9cx6SZmsTvzUq31DLfoAd3U',
      authDomain: 'quotes-92672.firebaseapp.com',
      databaseURL: 'https://quotes-92672.firebaseio.com',
      storageBucket: 'quotes-92672.appspot.com',
      messagingSenderId: '936175857202',
    })

    // Redux middleware for intercepting "Fireapp" actions
    this.middleware = api => next => async (action: Actions) => {
      console.log('middleware!', action)

      switch (action.type) {
        case 'FireappAuthenticate': {
          this.authenticate(action.email, action.pass)
          return
        }

        case 'FireappRegister': {
          this.register(action.email, action.pass)
          return
        }

        case 'FireappRemoveCurr': {
          this.unlink(this.resources.currProfile)
          this.unlink(this.resources.currQuotes)
          return
        }

        case 'FireappRemoveSelf': {
          this.unlink(this.resources.selfProfile)
          this.unlink(this.resources.selfQuotes)
          return
        }

        case 'FireappUpdateCurr': {
          const uid = await this.uidFromUrlId(action.urlId)
          // TODO handle uid not found (404?)
          this.link(this.resources.currProfile, uid)
          this.link(this.resources.currQuotes, uid)
          return
        }

        case 'FireappUpdateSelf': {
          this.link(this.resources.selfProfile, action.uid)
          this.link(this.resources.selfQuotes, action.uid)
          return
        }

        default: {
          // Only non-"Fireapp" actions
          // continue on to real reducer
          return next(action)
        }
      }
    }
  }

  public init(store: Store<State>): Promise<void> {
    this.store = store
    return this.listenForAuth()
  }

  public destroy() {
    this.offAuth()
    each(this.resources, resource => this.unlink(resource))
  }

  private link(resource: Resource, uid: string) {
    this.unlink(resource)
    resource.ref = this.app.database().ref(resource.path(uid))
    resource.ref.on('value', resource.listener)
  }

  private unlink(resource: Resource) {
    if (!resource.ref) return
    resource.ref.off('value', resource.listener)
  }

  private listenForAuth(): Promise<void> {
    /**
     * TODO TODO TODO
     * authenticated user & their account
     * need to be more strongly linked together
     * so that redux doesn't go through 3 stages
     * everytime authenication changes
     *
     * this non-transactional non-atomic flow
     * makes for broken midway states
     * and sad pandas all around
     */

    return new Promise<void>(
      resolve =>
        (this.offAuth = this.app
          .auth()
          .onAuthStateChanged(async (user: firebase.User) => {
            if (!this.store) return
            if (!user || !user.email || !user.uid) {
              this.store.dispatch<Actions>({ type: 'AuthChange', self: null })
              return resolve()
            }
            const auth: Auth = { email: user.email, uid: user.uid }
            this.link(this.resources.selfProfile, auth.uid)
            this.link(this.resources.selfQuotes, auth.uid)
            const profile = await this.resources.selfProfile.ref.once('value')
            const quotes = await this.resources.selfQuotes.ref.once('value')
            this.store.dispatch<Actions>({ type: 'AuthChange', self: {
              uid: auth.uid,
            } })
            resolve()
          })),
    )
  }

  private authenticate(email: string, pass: string) {
    this.app
      .auth()
      .signInWithEmailAndPassword(email, pass)
      .catch(e => {
        alert(e.message)
        if (this.store) {
          this.store.dispatch<Actions>({
            type: 'ErrorAuth',
            message: e.message,
          })
        }
      })
  }

  private register(email: string, pass: string) {
    this.app
      .auth()
      .createUserWithEmailAndPassword(email, pass)
      .then((user: firebase.User | null) => {
        if (!user) throw new Error('Something went wrong.')
        // Initialize user profile with a random urlId
        return this.app
          .database()
          .ref('profiles/' + user.uid)
          .set({ urlId: shortid.generate() })
      })
      .catch(e => {
        alert(e.message)
        if (this.store) {
          this.store.dispatch<Actions>({
            type: 'ErrorRegister',
            message: e.message,
          })
        }
      })
  }

  private async uidFromUrlId(urlId: string): Promise<string> {
    const profile = (await this.app
      .database()
      .ref('profiles')
      .orderByChild('urlId')
      .equalTo(urlId)
      .once('value')) as Profile | null
    if (!profile || !profile.key) {
      throw new Error('Unable to find profile for urlId:' + urlId)
    }
    return profile.key
  }
}