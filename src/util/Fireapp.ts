import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import * as shortid from 'shortid'

// Amalgamation of firebase data
export interface UserData {
  email: string | null
  uid: string
  urlId: string
  quotes: Quote[]
}

// Firebase Auth User
export interface User {
  email: string
  uid: string
}

// Firebase "profiles" resource
export interface Profile {
  key: string // Firebase Auth User uid
  urlId: string
}

// Firebase "quotes" resource
export interface Quote {
  key: string // Firebase id
  number: number // incremental id
  source: string
  words: string
}

const handleUser = (user: firebase.User | void): User | null => {
  if (user && user.uid && user.email) {
    return { email: user.email, uid: user.uid }
  } else {
    return null
  }
}

const handleProfile = (
  snap: firebase.database.DataSnapshot | void,
): Profile | null => {
  if (snap && snap.key && snap.val()) {
    const value = snap.val()
    return { key: snap.key, urlId: String(value.urlId) }
  } else {
    return null
  }
}

const handleQuotes = (snap: firebase.database.DataSnapshot): Quote[] => {
  const quotes: Quote[] = []
  if (snap && snap.val()) {
    snap.forEach(child => {
      if (!child.key) return false
      const value = child.val()
      quotes.push({
        key: child.key,
        number: Number(value.number),
        source: String(value.source),
        words: String(value.words),
      })
      return false // XXX: for firebase .forEach type
    })
  }
  return quotes
}

export default class FireApp {
  private app: firebase.app.App

  constructor() {
    this.app = firebase.initializeApp({
      apiKey: 'AIzaSyDR2zyCGLTU9cx6SZmsTvzUq31DLfoAd3U',
      authDomain: 'quotes-92672.firebaseapp.com',
      databaseURL: 'https://quotes-92672.firebaseio.com',
      storageBucket: 'quotes-92672.appspot.com',
      messagingSenderId: '936175857202',
    })
  }

  public authenticate(email: string, pass: string): Promise<UserData | null> {
    return this.app
      .auth()
      .signInWithEmailAndPassword(email, pass)
      .catch(e => console.error(e))
      .then(handleUser)
      .then((u: User) => this.getUserData(u)) as Promise<UserData | null>
  }

  public register(email: string, pass: string): Promise<UserData | null> {
    return this.app
      .auth()
      .createUserWithEmailAndPassword(email, pass)
      .catch(e => console.error(e))
      .then(handleUser)
      .then((u: User) => this.getUserData(u)) as Promise<UserData | null>
  }

  public async getUserDataByUrlId(urlId: string): Promise<UserData | null> {
    const profile = await this.getProfileByUrlId(urlId)
    if (!profile) return null // assume bad urlId
    return {
      urlId,
      email: null,
      quotes: await this.getQuotes(profile.key),
      uid: profile.key,
    }
  }

  private async getUserData(user: User | void): Promise<UserData | null> {
    if (!user) return null
    const profile = await this.getProfile(user.uid)
    if (!profile) return null // assume bad uid
    return {
      email: user.email,
      quotes: await this.getQuotes(user.uid),
      uid: user.uid,
      urlId: profile.urlId,
    }
  }

  private getProfile(uid: string): Promise<Profile | null> {
    return this.app
      .database()
      .ref('profiles/' + uid)
      .once('value')
      .catch(e => console.error(e))
      .then(handleProfile) as Promise<Profile | null>
  }

  private getProfileByUrlId(urlId: string): Promise<Profile | null> {
    return this.app
      .database()
      .ref('profiles')
      .orderByChild('urlId')
      .equalTo(urlId)
      .once('value')
      .catch(e => console.error(e))
      .then(handleProfile) as Promise<Profile | null>
  }

  private createProfile(uid: string): Promise<Profile | null> {
    const urlId = shortid.generate();
    return this.app
      .database()
      .ref('profiles/' + uid)
      .set({ urlId  })
      .catch(e => console.error(e))
      .then(() => ({ urlId })) as Promise<Profile | null>
  }

  private updateProfile () {}

  private getQuotes(uid: string): Promise<Quote[]> {
    return this.app
      .database()
      .ref('quotes/' + uid)
      .once('value')
      .catch(e => console.error(e))
      .then(handleQuotes) as Promise<Quote[]>
  }

  private createQuote() {}

  private updateQuote() {}
}
