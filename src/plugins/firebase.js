import firebase from 'firebase/app'
import 'firebase/auth'

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

export default ({ app, store, redirect }, inject) => {
  firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      store.dispatch('signout')
      if (app.context.from.meta[0].auth) {
        app.$message({ message: 'Please signin', type: 'warning', duration: 5000 })
        return redirect('/signin')
      }
      return
    }
    store.dispatch('signin', user)
    if (!user.emailVerified) {
      app.$message({
        message: 'Please confirm your email address',
        type: 'warning',
        duration: 5000
      })
      return redirect('/signin')
    }
    if (app.context.from.meta[0].shouldGuest) {
      return redirect('/')
    }
  })
  inject('firebase', firebase)
}
