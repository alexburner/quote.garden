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

    this.handlers.profile = profile => {
      this.view.profile = null
      if (profile && profile.val()) {
        const value = profile.val()
        this.view.profile = {
          key: profile.key,
          urlId: String(value.urlId),
        }
      }
    }

    this.handlers.quotes = quotes => {
      this.view.quotes = [];
      if (quotes && quotes.val()) {
        quotes.forEach(quote => {
          const value = quote.val()
          this.view.quotes.push({
            key: quote.key,
            number: Number(value.number),
            source: String(value.source),
            words: String(value.words),
          })
          return false // XXX: for firebase .forEach type
        })
      }
    }

    this.listenForAuth();
  }

  private listenForAuth() {
    this.offAuth = this.app.auth().onAuthStateChanged((user: firebase.User) => {
      if (!user) {
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

  private async setViewProfile(urlId: string) {
    this.view.profile = await this.getProfile(urlId)
  }

  private async getProfile(urlId: string): Promise<Profile> {
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

  private createAccount(email: string, pass: string) {}

  private signIn(email: string, pass: string) {}

  private destroyRef(key: 'profile' | 'quotes') {
    if (!this.refs[key]) return
    const ref = this.refs[key]
    const handler = this.handlers[key]
    ref.off('value', handler)
  }

  public destroy() {
    this.destroyRef('profile')
    this.destroyRef('quotes')
    this.offAuth()
  }
}
