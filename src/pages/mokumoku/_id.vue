<template lang="pug">
.event
  .event__wrapper(v-if="event && event.id")
    h1.title
      span {{ event.title }}
      el-button(v-if="hosting" type="primary" icon="el-icon-edit" circle @click="openForm")
    .edit-form(v-if="showingForm")
      edit-event-modal(:showing="showingForm" @closeModal="closeForm" :event="event")
    el-card.card
      h4 詳細
      p.description {{ event.description }}
      h4 時間
      p.datetime
        span.date {{ event.dateString }}
        span {{ event.startDatetime }}
        span 〜
        span {{ event.endDatetime }}
      h4 参加ユーザー
      .users
        Avatar.user(v-for="u in event.users" :key="u.uid" :user="u")
      template(v-if="joining")
        h4 参加リンク
        a.url(v-if="event.url" :href="event.url" target="_blank") {{ event.url }}
    .console
      el-button(v-if="!joining" type="primary" @click="joinEvent") 参加する
      el-button(v-else) 参加中
    .comments(v-if="joining")
      comment-field.comment-field(@getComments="getComments")
      h4.comments__header コメント
      .comment-list
        comment-item(v-for="comment in comments" :comment="comment" :key="comment.id")
</template>

<script lang="ts">
import { defineComponent, provide, ref } from '@vue/composition-api'

import injectBy from '@/utils/injectBy'
import { indexStoreInjectionKey } from '@/stores/indexStore'
import { buildEventStore, eventStoreInjectionKey } from '@/stores/eventStore'
import EditEventModal from '@/components/EditEventModal.vue'
import CommentField from '@/components/CommentField.vue'
import CommentItem from '@/components/CommentItem.vue'

export default defineComponent({
  meta: { auth: true },
  components: { EditEventModal, CommentField, CommentItem },
  setup (_, context: any) {
    const store = injectBy(indexStoreInjectionKey)
    const eventId: string = context.root.$route.params.id
    const eventStore = buildEventStore(context, store, eventId)
    provide(eventStoreInjectionKey, eventStore)
    eventStore.getEvent()
    eventStore.getComments()

    const showingForm = ref<boolean>(false)
    const openForm = () => { showingForm.value = true }
    const closeForm = () => { showingForm.value = false }

    const joinEvent = () => {
      context.root.$confirm('参加しますか？', {
        title: eventStore.event.value.title,
        confirmButtonText: '参加',
        cancelButtonText: 'キャンセル',
        callback: async (res: string) => {
          if (res !== 'confirm') return
          const result: boolean = await eventStore.joinEvent()
          if (result) {
            eventStore.getEvent()
            context.root.$message({
              message: `${eventStore.event.value.title}に参加しました`,
              type: 'success',
              duration: 5000
            })
          } else {
            context.root.$message({
              message: '参加できませんでした',
              type: 'error',
              duration: 5000
            })
          }
        }
      })
    }

    return {
      event: eventStore.event,
      comments: eventStore.comments,
      showingForm,
      openForm,
      closeForm,
      joinEvent,
      getComments: eventStore.getComments,
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
  padding-bottom: 100px
  .title
    font-size: 24px
    margin-bottom: 20px
    color: color5
    display: flex
    justify-content: space-between
  .card
    event-card()
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
  .comment-field
    margin-bottom: 15px
  .comments
    &__header
      margin-bottom: 10px
</style>
