import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

import { Quote } from 'src/interfaces'

// I KNOW I KNOW
// this is an evil thing
// singleton app state
let fireapp

export const init = () => {
  if (fireapp) return
  fireapp = firebase.initializeApp({
    apiKey: 'AIzaSyDR2zyCGLTU9cx6SZmsTvzUq31DLfoAd3U',
    authDomain: 'quotes-92672.firebaseapp.com',
    databaseURL: 'https://quotes-92672.firebaseio.com',
    storageBucket: 'quotes-92672.appspot.com',
    messagingSenderId: '936175857202',
  })
}

export const getQuotes = async ({
  path,
  uid,
}: {
  path?: string
  uid?: string
}): Promise<Quote[] | void> => {
  if (!fireapp) init()
  if (!path && !uid) return console.error('Need user path or uid')
  return [
    {
      id: 1,
      key: 'cheese',
      words: 'Would I be a quote someday',
      source: 'Somebody',
    },
  ]
}
