
export const hello_world = functions.https.onRequest((req, res) => {
  res.send("Hello from Firebase!")
})

import * as functions from 'firebase-functions'
import express from 'express'
import cors from 'cors'

const api = express()

api.use(cors({ origin: true }))

api.get('/messages', (req, res) => {
  res.send(['foo', 'bar'])
})

export default functions.https.onRequest(api)
