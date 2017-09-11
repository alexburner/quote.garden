import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { each } from 'lodash'
import { Middleware, Store } from 'redux'

import { Actions } from 'src/redux/actions'
import { State } from 'src/redux/state'

export interface Account {
  email: string
  uid: string
}

export interface Profile {
  key: string // Firebase id (Account uid)
  urlId: string
}

export interface Quote {
  key: string // Firebase id
  number: number // incremental id
  source: string
  words: string
}

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
  public middleware: Middleware
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
      switch (action.type) {
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
          const uid = await this.getUid(action.urlId)
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

  public init(store: Store<State>) {
    this.store = store
    this.listenForAuth()
  }

  public destroy() {
    this.offAuth()
    each(this.resources, resource => this.unlink(resource))
  }

  private listenForAuth() {
    this.offAuth = this.app.auth().onAuthStateChanged((user: firebase.User) => {
      if (!this.store) return
      const account: Account | null =
        user && user.email && user.uid
          ? { email: user.email, uid: user.uid }
          : null
      this.store.dispatch<Actions>({ type: 'AccountChange', account })
    })
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

  private async getUid(urlId: string): Promise<string> {
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
