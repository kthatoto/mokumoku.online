import * as functions from 'firebase-functions'
import express from 'express'
import cors from 'cors'

const api = express()

api.use(cors({ origin: true }))

api.get('/messages', (req, res) => {
  res.send(['foo', 'bar'])
})

exports.api = functions.https.onRequest(api)
