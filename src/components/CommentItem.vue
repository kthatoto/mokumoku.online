<template lang="pug">
.comment
  .comment__user
    Avatar(:user="comment.commenter" :size="50")
  .comment__main
    el-card.comment__card
      .comment__header(slot="header")
        span {{ comment.commenter.displayName }}
        span.timestamp {{ timestampString }}
      .comment__inner(:class="{'-image': comment.type === 'image', '-editing': editing}")
        .comment__content(v-if="comment.type === 'text'")
          template(v-if="!editing")
            vue-markdown.markdown(:anchorAttributes="{target: '_blank'}" :source="comment.content")
          .comment__edit(v-else)
            el-tabs.tabs(type="border-card")
              el-tab-pane
                span(slot="label")
                  icon.icon.-r(name="pen")
                  span 入力
                el-input.textarea(type="textarea" v-model="editingText"
                  :autosize="{ minRows: 2, maxRows: 5 }")
                .buttons
                  el-button(@click="cancelEdit") キャンセル
                  el-button(@click="updateCommentContent" type="primary") 更新
              el-tab-pane
                span(slot="label")
                  icon.icon.-r(name="comment")
                  span プレビュー
                vue-markdown.markdown(:anchorAttributes="{target: '_blank'}" :source="editingText")
                .buttons
                  el-button(@click="cancelEdit") キャンセル
                  el-button(@click="updateCommentContent" type="primary") 更新
        .comment__image(v-if="comment.type === 'image'")
          img(:src="comment.imageUrl")
        .comment__reactions
          .reactions__list
            span.reactions__item(v-for="(r, i) in comment.reactions")
              template(v-if="r.key === 'smile'") 😁
              template(v-else-if="r.key === 'good'") 👍
              template(v-else-if="r.key === 'eyes'") 👀
              template(v-else-if="r.key === 'pray'") 🙏
              template(v-else-if="r.key === 'circle'") ⭕️
              template(v-else-if="r.key === 'cross'") ❌
          el-popover.reactions__popover(placement="top-end" width="170"
            popper-class="reactions__popper")
            el-button.reactions__button(slot="reference" round type="primary")
              icon.icon.-r.-mini(name="plus")
              icon.icon(name="meh-blank")
            .reactions
              el-button(round @click="toggleReaction('smile')"
                :type="reactionExists('smile') ? 'primary' : 'default'")
                span 😁
              el-button(round @click="toggleReaction('good')"
                :type="reactionExists('good') ? 'primary' : 'default'")
                span 👍
              el-button(round @click="toggleReaction('eyes')"
                :type="reactionExists('eyes') ? 'primary' : 'default'")
                span 👀
              el-button(round @click="toggleReaction('pray')"
                :type="reactionExists('pray') ? 'primary' : 'default'")
                span 🙏
              el-button(round @click="toggleReaction('circle')"
                :type="reactionExists('circle') ? 'primary' : 'default'")
                span ⭕️
              el-button(round @click="toggleReaction('cross')"
                :type="reactionExists('cross') ? 'primary' : 'default'")
                span ❌
    .comment__console(v-if="isCommenter")
      span(v-if="comment.type === 'text'" @click="editComment")
        icon.icon(name="edit")
        span 編集
      span(@click="deleteComment")
        icon.icon(name="trash-alt")
        span 削除
</template>

<script lang="ts">
import { defineComponent, computed, ref } from '@vue/composition-api'

import injectBy from '@/utils/injectBy'
import { indexStoreInjectionKey } from '@/stores/indexStore'
import { Comment, eventStoreInjectionKey } from '@/stores/eventStore'

interface Props {
  comment: Comment
}

export default defineComponent({
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  setup (props: Props, context: any) {
    const store = injectBy(indexStoreInjectionKey)
    const eventStore = injectBy(eventStoreInjectionKey)

    const timestampString = computed<string>(() => {
      return context.root.$dayjs(props.comment.createdAt).format('YYYY-MM-DD HH:mm')
    })
    const isCommenter = computed<boolean>(() => {
      return props.comment.commenter.uid === store.currentUser.value.uid
    })

    const deleteComment = () => {
      context.root.$confirm('削除しますか？', {
        title: 'コメントを削除',
        confirmButtonText: '削除',
        cancelButtonText: 'キャンセル',
        callback: (res: string) => {
          if (res !== 'confirm') return
          eventStore.deleteComment(props.comment.id)
          eventStore.getComments()
          context.root.$message({
            message: 'コメントを削除しました',
            type: 'success',
            duration: 5000
          })
        }
      })
    }

    const editing = ref<boolean>(false)
    const editingText = ref<string>('')
    const editComment = () => {
      editing.value = true
      editingText.value = props.comment.content || ''
    }
    const cancelEdit = () => { editing.value = false }
    const updateCommentContent = async () => {
      const result: boolean = await eventStore.updateCommentContent(
        props.comment.id,
        editingText.value
      )
      if (result) {
        context.root.$message({
          message: 'コメントを編集しました',
          type: 'success',
          duration: 5000
        })
      } else {
        context.root.$message({
          message: 'コメントの編集に失敗しました',
          type: 'error',
          duration: 5000
        })
      }
      editing.value = false
    }

    const toggleReaction = async (key: string) => {
      await eventStore.toggleReaction(props.comment, key)
    }

    const reactionExists = (key: string) => {
      return !!(props.comment.reactions.find((reaction: Reaction) => {
        return reaction.key === key && reaction.user.uid == store.currentUser.value.uid
      }))
    }

    return {
      timestampString,
      isCommenter,
      deleteComment,
      editing,
      editingText,
      editComment,
      cancelEdit,
      updateCommentContent,
      toggleReaction,
      reactionExists
    }
  }
})
</script>

<style lang="stylus" scoped>
.comment
  display: flex
  justify-content: space-between
  margin-bottom: 15px
  &__user
    width: 50px

  &__main
    width: calc(100% - 60px)
  &__header
    display: flex
    justify-content: space-between
    .timestamp
      color: color3

  &__console
    padding: 5px
    text-align: right
    color: color3
    > span
      font-size: 16px
      margin-left: 15px
      hover()
      &:hover
        text-decoration: underline
      .icon
        vertical-align: middle

  &__image
    text-align: center
    img
      max-width: 100%
      max-height: 300px

  &__inner
    position: relative
    padding: 10px 15px
    &.-image
      padding: 0
      .comment__reactions
        padding: 8px 15px 10px
    &.-editing
      padding: 5px

  &__reactions
    display: flex
    justify-content: space-between
    border-top: 1px solid color3
    margin-top: 10px
    padding-top: 10px
  .reactions
    &__button
      padding: 5px 10px
      border: 1px solid color1
      .icon
        &:first-child
          vertical-align: -2px
    &__list
      width: calc(100% - 60px)

  &__edit
    .buttons
      text-align: right
    .textarea
      margin-bottom: 10px
      >>> .el-textarea__inner
        padding: 5px

  .tabs >>> .el-tabs__item
    padding: 0 10px !important

  >>>
    .el-card__header
      padding: 5px
    .el-card__body
      padding: 0

.reactions
  display: flex
  justify-content: space-between
  flex-wrap: wrap
  .el-button
    padding: 10px
    margin: 0 0 10px
</style>

<style lang="stylus">
.reactions__popper
  padding: 10px 10px 0
</style>
