import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

import { Message } from 'element-ui'

if (!firebase.apps.length) {
  firebase.initializeApp(
    {
      apiKey: process.env.FIREBASE_APIKEY,
      authDomain: process.env.FIREBASE_AUTHDOMAIN,
      databaseURL: process.env.FIREBASE_DATABASEURL,
      projectId: process.env.FIREBASE_PROJECTID,
      storageBucket: process.env.FIREBASE_STORAGEBUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID
    }
  )
}

export default ({ app, redirect }, inject) => {
  firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      if (app.context.from.meta[0].auth) {
        Message({ message: 'ログインしてください', type: 'warning', duration: 5000 })
        return redirect('/signin')
      }
      return
    }
    if (app.context.from.meta[0].shouldGuest) return redirect('/')
  })
  inject('firebase', firebase)
}
