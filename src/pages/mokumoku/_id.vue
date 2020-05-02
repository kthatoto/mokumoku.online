<template lang="pug">
.event
  .event__wrapper(v-if="event")
    h1.title
      span {{ event.title }}
      el-button(v-if="hosting" type="primary" icon="el-icon-edit" circle @click="openForm")
    .edit-form(v-if="showingForm")
      edit-event-modal(:showing="showingForm" @closeModal="closeForm" :event="event")
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
      template(v-if="joining")
        h4 参加リンク
        a.url(v-if="event.url" :href="event.url" target="_blank") {{ event.url }}
    .console
      el-button(v-if="!joining" type="primary" @click="joinEvent") 参加する
      el-button(v-else) 参加中
</template>

<script lang="ts">
import { defineComponent, provide, ref } from '@vue/composition-api'

import injectBy from '@/utils/injectBy'
import { indexStoreInjectionKey, Event } from '@/stores/indexStore'
import { buildEventStore, eventStoreInjectionKey } from '@/stores/eventStore'
import EditEventModal from '@/components/EditEventModal.vue'

export default defineComponent({
  meta: { auth: true },
  components: { EditEventModal },
  setup (_, context: any) {
    const store = injectBy(indexStoreInjectionKey)
    const eventId: string = context.root.$route.params.id
    const eventStore = buildEventStore(context, store, eventId)
    provide(eventStoreInjectionKey, eventStore)
    eventStore.getEvent()

    const showingForm = ref<boolean>(false)
    const openForm = () => { showingForm.value = true }
    const closeForm = () => { showingForm.value = false }

    return {
      event: eventStore.event,
      showingForm,
      openForm,
      closeForm,
      joinEvent: eventStore.joinEvent,
      hosting: eventStore.hosting,
      joining: eventStore.joining
    }
  }
})
</script>

<style lang="stylus" scoped>
.event
  width: 400px
  margin: 50px auto 0
  .title
    font-size: 24px
    margin-bottom: 20px
    color: color5
    display: flex
    justify-content: space-between
  .card
    margin-bottom: 15px
    .description
      word-break: break-word
      font-size: 16px
      overflow: hidden
      margin-bottom: 5px
      white-space: pre-wrap
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
      margin-bottom: 5px
    .user
      margin-right: 5px
      width: 30px
      height: 30px
      img
        width: 100%
        height: 100%
        border-radius: 50%
        border: 1px solid color1
    .url
      &:hover
        text-decoration: underline
  .console
    text-align: right
    margin-bottom: 10px
    .joining
      display: flex
      justify-content: space-between
      &__url
        width: 200px
</style>
