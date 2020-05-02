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

const upsertUser = async (user) => {
  const db = firebase.firestore()
  const doc = await db.collection('users').doc(user.uid).get()
  if (doc.exists) return
  db.collection('users').doc(user.uid).set({
    uid: user.uid,
    displayName: user.displayName,
    photoURL: user.photoURL
  })
}

export default ({ route, redirect }, inject) => {
  firebase.auth().onAuthStateChanged(async (user) => {
    if (!user) {
      if (route.meta[0].auth) {
        Message({ message: 'ログインしてください', type: 'warning', duration: 5000 })
        return redirect('/signin')
      }
      return
    }
    await upsertUser(user)
    if (route.meta[0].shouldGuest) return redirect('/')
  })
  inject('firebase', firebase)
}
