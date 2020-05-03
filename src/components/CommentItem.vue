<template lang="pug">
.comment
  .comment__user
    Avatar(:user="comment.commenter" :size="50")
  el-card.comment__main
    .comment__content(v-if="comment.type === 'text'")
      vue-markdown.markdown {{ comment.content }}
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

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
  setup (props: Props, _context: any) {
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
</style>
