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

interface Event {
  id: string
  tags: string[]
}

exports.tagTrigger = functions.firestore.document('events/{_eventId}')
  .onWrite((change: any, _context: any) => {
    const beforeEvent: Event = change.before.data()
    const afterEvent: Event = change.after.data()
    console.log(beforeEvent.tags)
    console.log(afterEvent.tags)
  })
