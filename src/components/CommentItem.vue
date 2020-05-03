<template lang="pug">
.comment
  .comment__user
    Avatar(:user="comment.commenter" :size="50")
  el-card.comment__main
    .comment__header(slot="header")
      span {{ comment.commenter.displayName }}
      span.timestamp {{ timestampString }}
    .comment__content(v-if="comment.type === 'text'")
      vue-markdown.markdown {{ comment.content }}
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'

import { Comment } from '@/stores/indexStore'

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
    const timestampString = computed<string>(() => {
      const date: Date = props.comment.createdAt.toDate()
      return context.root.$dayjs(date).format('YYYY-MM-DD HH:mm')
    })

    return { timestampString }
  }
})
</script>

<style lang="stylus" scoped>
.comment
  display: flex
  justify-content: space-between
  margin-bottom: 10px
  &__user
    width: 50px

  &__main
    width: calc(100% - 60px)
  &__header
    display: flex
    justify-content: space-between
    .timestamp
      color: color3

  >>>
    .el-card__header
      padding: 5px
    .el-card__body
      padding: 10px 15px
</style>
