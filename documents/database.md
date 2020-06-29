# database
## Users
* displayName: string
* twitterScreenName: string
* githubScreenName: string
* imageURL: string
* providerId: 'twitter' | 'github'
* uid: string
* description: string
* eventRefs: DocumentReference<event>[]
* achievementRefs: DocumentReference<achievement>[]
* tags: string[]
* createdAt: Date
## Events
* title: string
* description: string
* startDatetime: Date
* endDatetime: Date
* url: string
* limitUserCount: boolean
* maxUserCount: number
* joinPermission: boolean
* userRefs: DocumentReference<user>[]
* achievementRefs: DocumentReference<achievement>[]
* joinRequestingUserRefs: DocumentReference<user>[]
* tags: string[]
* createdAt: Date
* comments: SubCollection
    * commenter: DocumentReference<user>
    * type: 'text' | 'image'
    * content?: string
    * imageURL?: string
    * reactions: { key: string, userRef: DocumentReference<user> }[]
## Achievements
* content: string
* result: string
* tags: string[]
* reactions: { key: string, userRef: DocumentReference<user> }[]
* public: boolean
## Tags
* name: string
* userRefs: DocumentReference<user>[]
* eventRefs: DocumentReference<event>[]
* achievementRefs: DocumentReference<achievement>[]
