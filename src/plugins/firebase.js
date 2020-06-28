import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

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

const createUser = async (user) => {
  const db = firebase.firestore()
  const userSnapshot = await db.collection('users').doc(user.uid).get()
  if (userSnapshot.exists) return
  const providerId = user.providerData[0].providerId.split('.')[0]
  db.collection('users').doc(user.uid).set({
    displayName: user.displayName,
    twitterScreenName: '',
    githubScreenName: '',
    imageURL: user.photoURL,
    providerId,
    uid: user.uid,
    description: '',
    eventRefs: [],
    achievementRefs: [],
    tags: [],
    createdAt: new Date()
  })
}

export default ({ app, route, redirect }, inject) => {
  app.onAuthStateChanged = false
  firebase.auth().onAuthStateChanged(async (user) => {
    app.onAuthStateChanged = true
    if (user) {
      await createUser(user)
      if (route.meta[0].shouldGuest) return redirect('/')
    }
  })
  inject('firebase', firebase)
}
