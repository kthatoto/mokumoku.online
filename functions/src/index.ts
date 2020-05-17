import * as functions from 'firebase-functions'
// import express from 'express'
// import cors from 'cors'
//
// const api = express()
//
// api.use(cors({ origin: true }))
//
// api.get('/messages', (_req, res) => {
//   res.send(['foo', 'bar'])
// })
//
// exports.api = functions.https.onRequest(api)

exports.tagTrigger = functions.firestore.document('events/{_eventId}')
  .onWrite((change: any, _context: any) => {
    console.log('before.tags', change.before.tags)
    console.log('after.tags', change.after.tags)
  })
