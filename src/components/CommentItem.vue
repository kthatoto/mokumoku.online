<template lang="pug">
.comment
  .comment__user
    Avatar(:user="comment.commenter" :size="50")
  .comment__main
    el-card(:class="{'-image': comment.type === 'image', '-editing': editing}")
      .comment__header(slot="header")
        span {{ comment.commenter.displayName }}
        span.timestamp {{ timestampString }}
      .comment__content(v-if="comment.type === 'text'")
        template(v-if="!editing")
          vue-markdown.markdown(:anchorAttributes="{target: '_blank'}")
            | {{ comment.content }}
        .comment__edit(v-else)
          el-tabs.tabs(type="border-card")
            el-tab-pane
              span(slot="label")
                icon.icon.-r(name="pen")
                span 入力
              .buttons
                el-button(@click="cancelEdit") キャンセル
            el-tab-pane
              span(slot="label")
                icon.icon.-r(name="comment")
                span プレビュー
              .buttons
                el-button(@click="cancelEdit") キャンセル
      .comment__image(v-if="comment.type === 'image'")
        img(:src="comment.imageUrl")
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
      editingText.value = props.comment.content
    }
    const cancelEdit = () => { editing.value = false }

    return {
      timestampString,
      isCommenter,
      deleteComment,
      editing,
      editComment,
      cancelEdit
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

  &__edit
    .buttons
      text-align: right

  .-image
    >>> .el-card__body
      padding: 0
  .-editing
    >>> .el-card__body
      padding: 5px

  .tabs >>> .el-tabs__item
    padding: 0 10px !important

  >>>
    .el-card__header
      padding: 5px
    .el-card__body
      padding: 10px 15px
</style>
