import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

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
  const providerId = user.providerData[0].providerId.split('.')[0]
  const docSnapshot = await db.collection('users').doc(user.uid).get()
  if (docSnapshot.exists) {
    db.collection('users').doc(user.uid).update({
      displayName: user.displayName,
      photoURL: user.photoURL
    })
  } else {
    db.collection('users').doc(user.uid).set({
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
      providerId
    })
  }
}

export default ({ app, route, redirect }, inject) => {
  app.onAuthStateChanged = false
  firebase.auth().onAuthStateChanged(async (user) => {
    app.onAuthStateChanged = true
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
