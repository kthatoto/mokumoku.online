<template lang="pug">
.comment
  .comment__user
    Avatar(:user="comment.commenter" :size="50")
  .comment__main
    el-card
      .comment__header(slot="header")
        span {{ comment.commenter.displayName }}
        span.timestamp {{ timestampString }}
      .comment__content(v-if="comment.type === 'text'")
        vue-markdown.markdown {{ comment.content }}
    .comment__console(v-if="isCommenter")
      span(@click="deleteComment")
        icon.icon(name="trash-alt")
        span 削除
      span
        icon.icon(name="edit")
        span 編集
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'

import injectBy from '@/utils/injectBy'
import { Comment, indexStoreInjectionKey } from '@/stores/indexStore'
import { eventStoreInjectionKey } from '@/stores/eventStore'

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

    return {
      timestampString,
      isCommenter,
      deleteComment
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

  >>>
    .el-card__header
      padding: 5px
    .el-card__body
      padding: 10px 15px
</style>
