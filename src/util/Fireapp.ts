import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { each } from 'lodash'
import { Store } from 'redux'
import * as shortid from 'shortid'

// Our own user (Firebase auth user + profile)
export interface User {
  email?: string
  uid: string
  urlId: string
}

// Firebase auth user object
export interface AuthUser {
  email: string
  uid: string
}

// Firebase "profiles" resource
export interface Profile {
  urlId: string
}

// Firebase "quotes" resource
export interface Quote {
  key: string // Firebase id
  number: number // incremental id
  source: string
  words: string
}

const handleAuthUser = (user: firebase.User): AuthUser => ({
  email: user.email,
  uid: user.uid,
});

const handleProfileSnap = (snap: firebase.database.DataSnapshot): Profile => {
  if (snap && snap.key && snap.val()) {
    const value = snap.val()
    return { urlId: String(value.urlId) }
  } else {
    return null
  }
}

const handleQuotesSnap = (snap: firebase.database.DataSnapshot): Quote[] => {
  const quotes: Quote[] = []
  if (snap && snap.val()) {
    snap.forEach(snapChild => {
      if (!snapChild.key) return false
      const value = snapChild.val()
      quotes.push({
        key: snapChild.key,
        number: Number(value.number),
        source: String(value.source),
        words: String(value.words),
      })
      return false // XXX: for firebase .forEach type
    })
  }
  return quotes;
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

  public authenticate(email: string, pass: string): Promise<AuthUser> {
    // Authenticates user, only returns subset of result we care about
    return this.app
      .auth()
      .signInWithEmailAndPassword(email, pass)
      .then(handleAuthUser)
  }

  public register(email: string, pass: string): Promise<AuthUser> {
    return this.app
      .auth()
      .createUserWithEmailAndPassword(email, pass)
      .then(handleAuthUser)
  }

  public getProfile(uid: string): Promise<Profile> {
    return this.app
      .database()
      .ref('profiles/' + uid)
      .once('value')
      .then(handleProfileSnap) as Promise<Profile>
  }

  public getProfileByUrlId(urlId: string): Promise<Profile> {
    return this.app
      .database()
      .ref('profiles')
      .orderByChild('urlId')
      .equalTo(urlId)
      .once('value')
      .then(handleProfileSnap) as Promise<Profile>
  }

  public createProfile(uid: string): Promise<Profile> {
    const urlId = shortid.generate();
    return this.app
      .database()
      .ref('profiles/' + uid)
      .set({ urlId  })
      .then(() => ({ urlId })) as Promise<Profile>
  }

  public updateProfile () {}

  public getQuotes(uid: string): Promise<Quote[]> {
    return this.app
      .database()
      .ref('quotes/' + uid)
      .once('value')
      .then(handleQuotesSnap) as Promise<Quote[]>
  }

  public createQuote() {}

  public updateQuote() {}
}
