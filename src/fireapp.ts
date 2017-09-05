/*

auth
- email
- password
- uid

profile (keyed by uid)
- urlId

quotes (keyed by uid) (keyed by quote key)
- number // TODO
- source
- words

 */

import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

interface Account {
  email: string
  uid: string
}

interface Profile {
  key: string // Firebase id (Account uid)
  urlId: string
}

interface Quote {
  key: string // Firebase id
  number: number // incremental id
  source: string
  words: string
}

type SnapshotHandler = (snapshot: firebase.database.DataSnapshot) => void

export default class FireApp {
  private app: firebase.app.App
  private offAuth: firebase.Unsubscribe
  private handlers: {
    profile: SnapshotHandler
    quotes: SnapshotHandler
  }
  private refs: {
    profile: firebase.database.Reference | null
    quotes: firebase.database.Reference | null
  }
  private self: {
    account: Account | null
    profile: Profile | null
  }
  private view: {
    profile: Profile | null
    quotes: Quote[] | null
  }

  constructor(/* TODO redux store */) {
    this.app = firebase.initializeApp({
      apiKey: 'AIzaSyDR2zyCGLTU9cx6SZmsTvzUq31DLfoAd3U',
      authDomain: 'quotes-92672.firebaseapp.com',
      databaseURL: 'https://quotes-92672.firebaseio.com',
      storageBucket: 'quotes-92672.appspot.com',
      messagingSenderId: '936175857202',
    })

    this.handlers.profile = profileSnap => {
      if (profileSnap && profileSnap.key && profileSnap.val()) {
        const value = profileSnap.val()
        const oldKey = this.view.profile && this.view.profile.key
        this.view.profile = {
          key: profileSnap.key,
          urlId: String(value.urlId),
        }
        if (oldKey !== this.view.profile.key) {
          // this profile is new, reset quote listener
          this.listenForQuotes(this.view.profile.key)
        }
      } else {
        this.view.profile = null
      }
    }

    this.handlers.quotes = quotesSnap => {
      this.view.quotes = []
      if (quotesSnap && quotesSnap.val()) {
        quotesSnap.forEach(quoteSnap => {
          if (!quoteSnap.key) return false
          if (!this.view.quotes) return false // TODO: tsc bug?
          const value = quoteSnap.val()
          this.view.quotes.push({
            key: quoteSnap.key,
            number: Number(value.number),
            source: String(value.source),
            words: String(value.words),
          })
          return false // XXX: for firebase .forEach type
        })
      }
    }

    this.listenForAuth()
  }

  public destroy() {
    this.destroyRef('profile')
    this.destroyRef('quotes')
    this.offAuth()
  }

  public createAccount(email: string, pass: string) {
    return [email, pass]
  }

  public signIn(email: string, pass: string) {
    return [email, pass]
  }

  public async setViewProfile(urlId: string) {
    this.view.profile = await this.getProfileByUrlId(urlId)
  }

  private listenForAuth() {
    this.offAuth = this.app.auth().onAuthStateChanged((user: firebase.User) => {
      if (!user || !user.uid || !user.email) {
        // Logged out
        this.self.account = null
        this.self.profile = null
        return
      }

      if (this.self.account && this.self.account.uid === user.uid) {
        // No change
        return
      }

      // New auth! Extract account info
      this.self.account = {
        email: user.email,
        uid: user.uid,
      }

      // Re/set profile listener
      this.listenForProfile(this.self.account.uid)
    })
  }

  private listenForProfile(uid: string) {
    // TODO this only listens for current view profile
    // what about listening to changes for user profile?
    // like on account page?
    // oh hm but
    // that would be "view"
    // oh hmmm but
    // they chould update their profile
    // in another tab
    // and we want
    // those updates
    // WHAT THEN

    // full ref list:
    // - self profile
    // - self quotes
    // - curr profile
    // - curr quotes

    // + auth (which determines self)

/*
    interface Resource {
      handler: (snapshot: firebase.database.DataSnapshot) => void
      ref: firebase.database.Reference | null
    }

    const resources: {
      [name: string]: Resource
    } = {
      currProfile: null,
      currQuotes: null,
      selfProfile: null,
      selfQuotes: null,
    }

    resources.forEach(resource => {

    })


    // hmmm

    // need each handler by hand right
    handlers: {
      currProfile
      currQuotes
      selfProfile
      selfQuotes
    }

    // and refs need their names
    this.app.database().ref(REF_NAME + uid)

    // then destroy:
    const ref = this.refs[propName]
    const handler = this.handlers[propName]
    if (!ref || !handler) return
    ref.off('value', handler)

    // and add:
    this.destroyRef(resourceName)
    this.refs[propName] = this.app.database().ref(resourceName + '/' + uid)
    this.refs[propName].on('value', this.handlers[propName])



    // waddabout

    // interface
    interface Resource {
      path: string
      handler: (snapshot: firebase.database.DataSnapshot) => void
      ref: firebase.database.Reference | null
    }

    // class field
    private resources: {
      [name: string]: Resource
    } = {
      currProfile: { ... },
      currQuotes: { ... },
      selfProfile: { ... },
      selfQuotes: {
        path: 'quotes/',
        handler: quotesSnap => {
          ...
        },
        ref: null,
      },
    }

    // destruction (unlink)
    const resource = this.resources[name]
    if (!resource) return
    const handler = resource.handler
    const ref = resource.ref
    if (!ref) return
    ref.off('value', handler)

    // creation (link)
    this.unlink(name)
    const resource = this.resources[name]
    resource.ref = this.app.database().ref(resource.path + uid)
    resource.ref.on('value', resource.handler)

    // enumerating?
    this.resources.forEach(resource => {
      this.unlink(resource)
      resource.ref = this.app.database().ref(resource.path + uid)
      resource.ref.on('value', resource.handler)
    })
    // changes things
    // name less important
    // which could also mean:
    if (!resource.ref) return
    resource.ref.off('value', resource.handler)


 */

    this.destroyRef('profile')
    this.refs.profile = this.app.database().ref('profiles/' + uid)
    this.refs.profile.on('value', this.handlers.profile)
  }

  private listenForQuotes(uid: string) {
    // TODO seems like a repeatable pattern?
    // - value handler
    // - resource ref
    // - create/update (destroy, create, listen)
    // - destroy (unlink value/handler if !null)

    this.destroyRef('quotes')
    this.refs.quotes = this.app.database().ref('quotes/' + uid)
    this.refs.quotes.on('value', this.handlers.quotes)
  }

  private destroyRef(key: 'profile' | 'quotes') {
    const ref = this.refs[key]
    const handler = this.handlers[key]
    if (!ref || !handler) return
    ref.off('value', handler)
  }

  private async getProfileByUrlId(urlId: string): Promise<Profile> {
    const profile: Profile = await this.app
      .database()
      .ref('profiles')
      .orderByChild('urlId')
      .equalTo(urlId)
      .once('value')
    if (!profile || !profile.key) {
      throw new Error('Unable to find profile for urlId:' + urlId)
    }
    return profile
  }
}
