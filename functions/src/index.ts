import * as functions from 'firebase-functions'

export const helloWorld = functions.https.onRequest((req, res) => {
  response.send("Hello from Firebase!")
})
