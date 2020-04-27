import * as functions from 'firebase-functions'

export const hello_world = functions.https.onRequest((req, res) => {
  res.send("Hello from Firebase!")
})
