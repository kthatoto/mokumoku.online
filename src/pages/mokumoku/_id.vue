<template lang="pug">
.event(v-if="event && event.id")
  .event__detail
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
      template(v-if="!joining")
        el-tooltip(effect="dark" placement="bottom-end")
          span(slot="content")
            p もくもく会に参加できるリンクを取得できます
            p コメントの閲覧と投稿が可能になります
          icon.icon.-x-large(name="question-circle")
        el-button(type="primary" @click="joinEvent") 参加する
      template(v-else)
        el-button 参加中
  .event__comments
    h4.comments__header コメント
    comment-field.comment-field(v-if="joining" @getComments="getComments")
    .comment-list
      comment-item(v-for="comment in comments" v-if="comment" :key="comment.id"
        :comment="comment")
  .event__achieves
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
  components: { EditEventModal, CommentField, CommentItem },
  setup (_, context: any) {
    const store = injectBy(indexStoreInjectionKey)
    const eventId: string = context.root.$route.params.id
    const eventStore = buildEventStore(context, store, eventId)
    provide(eventStoreInjectionKey, eventStore)
    eventStore.getEvent().then(() => {
      eventStore.getComments()
    })

    const showingForm = ref<boolean>(false)
    const openForm = () => { showingForm.value = true }
    const closeForm = () => { showingForm.value = false }

    const joinEvent = () => {
      const confirmMessage: string = `参加しますか？

もくもく会に参加できるリンクを取得できます
コメントの閲覧と投稿が可能になります`
      context.root.$confirm(confirmMessage, {
        title: eventStore.event.value.title,
        confirmButtonText: '参加',
        cancelButtonText: 'キャンセル',
        customClass: 'joining-confirm',
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
  width: 1000px
  margin: 30px auto 0
  display: flex
  justify-content: space-between
  &__detail
    width: 300px
    .title
      font-size: 24px
      margin-bottom: 20px
      height: 30px
      line-height: 30px
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
      .icon
        color: color3
        margin-right: 15px
  &__comments
    width: 300px
    h4
      height: 30px
      line-height: 30px
    .comment-field
      margin-bottom: 15px
    .comments
      &__header
        margin-bottom: 20px
  &__achieves
    width: 300px
</style>

<style lang="stylus">
.joining-confirm
  .el-message-box__message
    white-space: pre-wrap
</style>
