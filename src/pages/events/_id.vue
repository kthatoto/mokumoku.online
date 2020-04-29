<template lang="pug">
.event
  .event__wrapper(v-if="event")
    h1.title {{ event.title }}
    el-card.card
      p.description {{ event.description }}
      h4 時間
      p.datetime
        span.date {{ event.dateString }}
        span {{ event.startDatetime }}
        span 〜
        span {{ event.endDatetime }}
      h4 参加しているユーザー
      .users
        .user(v-for="u in event.users" :key="u.uid")
          img(:src="u.photoURL")
</template>

<script lang="ts">
import { defineComponent, onMounted } from '@vue/composition-api'

import injectBy from '@/utils/injectBy'
import { indexStoreInjectionKey, Event } from '@/stores/indexStore'

export default defineComponent({
  setup (_, context: any) {
    const store = injectBy(indexStoreInjectionKey)
    const eventId: string = context.root.$route.params.id

    onMounted(async () => {
      await store.getEvent(eventId)
    })

    return {
      event: store.event
    }
  }
})
</script>

<style lang="stylus" scoped>
.event
  width: 400px
  margin: 50px auto 0
  h1
    font-size: 24px
    margin-bottom: 20px
    color: color5
  .description
    word-break: break-word
    font-size: 16px
    overflow: hidden
    margin-bottom: 5px
    text-truncate()
  h4
    font-size: 16px
    margin-bottom: 5px
  .datetime
    font-size: 16px
    color: gray
    margin-bottom: 5px
    .date
      margin-right: 10px
  .users
    display: flex
  .user
    margin-right: 5px
    width: 30px
    height: 30px
    img
      width: 100%
      height: 100%
      border-radius: 50%
      border: 1px solid color1
</style>
