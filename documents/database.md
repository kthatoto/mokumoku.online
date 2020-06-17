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
* groupRefs: DocumentReference<group>[]
* achievementRefs: DocumentReference<achievement>[]
* tags: string[]
* createdAt: Date
## Events
* title: string
* description: string
* hostRef: DocumentReference<user | group>
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
* tags: string[]
* reactions: { key: string, userRef: DocumentReference<user> }[]
* public: boolean
## Groups
* name: string
* description: string
* imageURL: string
* tags: string[]
* adminRefs: DocumentReference<user>[]
## Tags
* name: string
* userRefs: DocumentReference<user>[]
* eventRefs: DocumentReference<event>[]
* groupRefs: DocumentReference<group>[]
* achievementRefs: DocumentReference<achievement>[]
