<template lang="pug">
.comment-field
  el-tabs(type="border-card")
    el-tab-pane(label="入力")
      el-input.textarea(type="textarea" v-model="form.content" :autosize="{ minRows: 3 }")
    el-tab-pane(label="プレビュー")
      vue-markdown.markdown(:source="form.content")
    el-tab-page(label="画像")
</template>

<script lang="ts">
import { defineComponent, reactive } from '@vue/composition-api'

export default defineComponent({
  setup (_, context: any) {
    const form = reactive({ content: '' })
    return { form }
  }
})
</script>

<style lang="stylus" scoped>
.comment-field
  width: 100%
  .markdown
    markdown()
  .textarea >>> .el-textarea__inner
    padding: 5px
</style>
