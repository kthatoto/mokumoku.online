<template lang="pug">
.event(v-if="event && event.id")
  .event__detail
    h1.title {{ event.title }}
    .edit-form(v-if="showingForm")
      edit-event-modal(:showing="showingForm" @closeModal="closeForm" :event="event")
    el-card.card
      el-button.edit(v-if="hosting" type="primary" icon="el-icon-edit" circle @click="openForm")
      .datetime
        h4 時間
        p
          span.date {{ event.dateString }}
          span {{ event.startDatetime }}
          span 〜
          span {{ event.endDatetime }}
      .joining-link
        h4 参加リンク
        template(v-if="joining")
          a.link(v-if="event.url" :href="event.url" target="_blank") {{ event.url }}
          span(v-else) ---
        template(v-else)
          span.-not-joining 参加すると表示されます
      .users
        h4 参加ユーザー
        .users__list
          Avatar.user(v-for="u in event.users" :key="u.uid" :user="u")
      .tags
        h4 タグ
        template(v-if="event.tags.length > 0")
          Tag(v-for="tag in event.tags" :key="tag" :label="tag")
        span(v-else) ---
      .description
        h4 詳細
        vue-markdown.markdown(:anchorAttributes="{target: '_blank'}" :source="event.description")
    .console
      el-tooltip(v-if="event.joinPermission" effect="dark" placement="bottom-end")
        span(slot="content")
          p 参加許可制です
          p 参加申請をしてイベント管理者が許可することで参加できます
        icon.icon.-x-large(name="lock")
      template(v-if="!joining")
        el-tooltip(effect="dark" placement="bottom-end")
          span(slot="content")
            p もくもく会に参加できるリンクを取得できます
            p コメントの投稿も可能になります
          icon.icon.-x-large.-gray(name="question-circle")
        template(v-if="event.joinPermission")
          el-button(v-if="!applying" type="primary" @click="applyJoiningEvent")
            icon.icon.-r(name="lock")
            span 参加申請する
          el-button(v-else @click="cancelEventApplying")
            icon.icon.-r(name="lock")
            span 参加申請中
        template(v-else)
          el-button(type="primary" @click="joinEvent") 参加する
      template(v-else)
        el-button(@click="cancelEventJoining") 参加中
    .requesting(v-if="hosting")
      join-requesting-users-list
  .event__comments
    h4 コメント
    comment-field.comment-field(v-if="joining" @getComments="getComments")
    .comment-list
      comment-item(v-for="comment in comments" v-if="comment" :key="comment.id"
        :comment="comment")
  .event__achievements
    h4
      span もくもく一覧
      el-button(type="primary" size="mini")
        icon.icon.-r(name="plus")
        span 記録する
    el-card
      // achievement-field
</template>

<script lang="ts">
import { defineComponent, provide, ref } from '@vue/composition-api'

import injectBy from '@/utils/injectBy'
import { indexStoreInjectionKey } from '@/stores/indexStore'
import { buildEventStore, eventStoreInjectionKey } from '@/stores/eventStore'
import EditEventModal from '@/components/EditEventModal.vue'
import CommentField from '@/components/CommentField.vue'
import CommentItem from '@/components/CommentItem.vue'
import JoinRequestingUsersList from '@/components/JoinRequestingUsersList.vue'

export default defineComponent({
  components: { EditEventModal, CommentField, CommentItem, JoinRequestingUsersList },
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

    const applyJoiningEvent = () => {
      const confirmMessage: string = `参加申請しますか？

参加申請をしてイベント管理者が許可することで参加できます
参加を許可されると、もくもく会に参加できるリンクを取得できます
コメントの投稿も可能になります`
      context.root.$confirm(confirmMessage, {
        title: eventStore.event.value.title,
        confirmButtonText: '参加申請',
        cancelButtonText: 'キャンセル',
        customClass: 'joining-confirm',
        callback: async (res: string) => {
          if (res !== 'confirm') return
          const result: boolean = await eventStore.applyJoiningEvent()
          if (result) {
            eventStore.getEvent()
            context.root.$message({
              message: `${eventStore.event.value.title}へ参加申請しました`,
              type: 'success',
              duration: 5000
            })
          } else {
            context.root.$message({
              message: '参加申請できませんでした',
              type: 'error',
              duration: 5000
            })
          }
        }
      })
    }
    const joinEvent = () => {
      const confirmMessage: string = `参加しますか？

もくもく会に参加できるリンクを取得できます
コメントの投稿も可能になります`
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

    const cancelEventApplying = () => {
      const confirmMessage: string = 'イベントへの参加申請をキャンセルしますか？'
      context.root.$confirm(confirmMessage, {
        title: eventStore.event.value.title,
        confirmButtonText: 'キャンセル',
        cancelButtonText: '戻る',
        customClass: 'joining-confirm',
        callback: async (res: string) => {
          if (res !== 'confirm') return
          const result: boolean = await eventStore.cancelEventApplying()
          if (result) {
            eventStore.getEvent()
            context.root.$message({
              message: `${eventStore.event.value.title}への参加申請をキャンセルしました`,
              type: 'success',
              duration: 5000
            })
          } else {
            context.root.$message({
              message: 'キャンセルできませんでした',
              type: 'error',
              duration: 5000
            })
          }
        }
      })
    }
    const cancelEventJoining = () => {
      if (eventStore.hosting.value) return
      const confirmMessage: string = 'イベントへの参加をキャンセルしますか？'
      context.root.$confirm(confirmMessage, {
        title: eventStore.event.value.title,
        confirmButtonText: 'キャンセル',
        cancelButtonText: '戻る',
        customClass: 'joining-confirm',
        callback: async (res: string) => {
          if (res !== 'confirm') return
          const result: boolean = await eventStore.cancelEventJoining()
          if (result) {
            eventStore.getEvent()
            context.root.$message({
              message: `${eventStore.event.value.title}への参加をキャンセルしました`,
              type: 'success',
              duration: 5000
            })
          } else {
            context.root.$message({
              message: 'キャンセルできませんでした',
              type: 'error',
              duration: 5000
            })
          }
        }
      })
    }

    const showingJoinRequestingUsersList = ref<boolean>(false)

    return {
      event: eventStore.event,
      comments: eventStore.comments,
      showingForm,
      showingJoinRequestingUsersList,
      openForm,
      closeForm,
      applyJoiningEvent,
      cancelEventApplying,
      joinEvent,
      cancelEventJoining,
      getComments: eventStore.getComments,
      hosting: eventStore.hosting,
      joining: eventStore.joining,
      applying: eventStore.applying
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
    width: 250px
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
      position: relative
      .edit
        position: absolute
        top: 10px
        right: 10px
    .console
      text-align: right
      margin-bottom: 10px
      .icon
        &.-x-large
          margin-right: 15px
        &.-gray
          color: color3
  &__comments, &__achievements
    h4
      font-size: 16px
      height: 20px
      line-height: 20px
      margin: 20px 0 10px
  &__comments
    width: 400px
    .comment-field
      margin-bottom: 15px
  &__achievements
    width: 300px
    h4
      position: relative
      .el-button
        position: absolute
        right: 0
        bottom: 0

</style>

<style lang="stylus">
.joining-confirm
  width: 450px
  .el-message-box__message
    white-space: pre-wrap
</style>
