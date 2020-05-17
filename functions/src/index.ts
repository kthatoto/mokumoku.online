import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp({
  credential: admin.credential.applicationDefault()
})
const db = admin.firestore()

interface Event {
  id: string
  tags: string[]
}

exports.eventTagTrigger = functions.firestore.document('events/{eventId}')
  .onWrite(async (change: any, context: any) => {
    const eventId: string = context.params.eventId
    const eventRef: any = db.collection('events').doc(eventId)
    const beforeEvent: Event = change.before.data()
    const afterEvent: Event = change.after.data()

    const newTags: string[] = afterEvent.tags.filter((tag: string) => !beforeEvent.tags.includes(tag))
    const removedTags: string[] = beforeEvent.tags.filter((tag: string) => !afterEvent.tags.includes(tag))
    console.log('newTags', newTags)
    console.log('removedTags', removedTags)
    newTags.forEach(async (newTag: string) => {
      const tagRef: any = db.collection('tags').doc(newTag)
      const docSnapshot: any = await tagRef.get()
      if (docSnapshot.exists) {
        const data: any = docSnapshot.data()
        if (data.eventRefs.find((eRef: any) => eRef.id === eventId)) return
        tagRef.update({ eventRefs: [...data.eventRefs, eventRef] })
      } else {
        tagRef.set({
          name: newTag,
          userRefs: [],
          eventRefs: [eventRef],
          groupRefs: [],
          achievementRefs: []
        })
      }
    })

    removedTags.forEach(async (removedTag: string) => {
      const tagRef: any = db.collection('tags').doc(removedTag)
      const docSnapshot: any = await tagRef.get()
      if (!docSnapshot.exists) return
      const data: any = docSnapshot.get()
      if (!data.eventRefs.find((eRef: any) => eRef.id === eventId)) return
      tagRef.update({
        eventRefs: data.eventRefs.filter((eRef: any) => eRef.id !== eventId)
      })
    })
    return 0
  })
