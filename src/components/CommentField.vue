<template lang="pug">
.comment-field
  el-tabs.tabs(type="border-card")
    el-tab-pane(label="入力")
      span(slot="label")
        icon.icon.-r(name="pen")
        span 入力
      el-input.textarea(type="textarea" v-model="form.content"
        :autosize="{ minRows: 2, maxRows: 5 }")
      .buttons
        el-button(type="primary" :disabled="!submittable") 送信
    el-tab-pane
      span(slot="label")
        icon.icon.-r(name="comment")
        span プレビュー
      vue-markdown.markdown(:source="form.content")
      .buttons
        el-button(type="primary" :disabled="!submittable") 送信
    el-tab-pane
      span(slot="label")
        icon.icon.-r(name="image")
        span 画像
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from '@vue/composition-api'

export default defineComponent({
  setup (_, context: any) {
    const form = reactive({ content: '' })
    const submittable = computed<boolean>(() => form.content.split(' ').join('').length > 0)
    return { form, submittable }
  }
})
</script>

<style lang="stylus" scoped>
.comment-field
  width: 100%
  .markdown
    markdown()
    border-bottom: 1px solid #ccc
    padding-bottom: 10px
    margin-bottom: 10px
  .textarea
    margin-bottom: 10px
    >>> .el-textarea__inner
      padding: 5px
  .tabs >>> .el-tabs__item
    padding: 0 10px !important
  .buttons
    text-align: right
</style>
