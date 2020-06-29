<template lang="pug">
.achievement-field
  el-button(type="primary" size="mini" @click="showingDialog = true")
    icon.icon.-r(name="plus")
    span 投稿
  el-dialog.dialog(:visible.sync="showingDialog" :show-close="false")
    .close(@click="showingDialog = false")
      icon.icon.-large(name="times")
    el-tabs.tabs(type="border-card")
      el-tab-pane
        span(slot="label")
          icon.icon.-r(name="pen")
          span 入力
        .row
          h3
            icon.icon.-r(name="list")
            span すること
          el-input.textarea(type="textarea" v-model="form.content"
            :autosize="{ minRows: 2, maxRows: 5 }")
        .row
          h3
            icon.icon.-r(name="tasks")
            span したこと
          el-input.textarea(type="textarea" v-model="form.result"
            :autosize="{ minRows: 2, maxRows: 5 }")
        .buttons
          el-button(type="primary" :disabled="!submittable") 投稿
      el-tab-pane
        span(slot="label")
          icon.icon.-r(name="comment")
          span プレビュー
        .row
          h3
            icon.icon.-r(name="list")
            span すること
          vue-markdown.markdown(:anchorAttributes="{target: '_blank'}" :source="form.content")
        .row
          h3
            icon.icon.-r(name="tasks")
            span したこと
          vue-markdown.markdown(:anchorAttributes="{target: '_blank'}" :source="form.result")
        .buttons
          el-button(type="primary" :disabled="!submittable") 投稿
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed } from '@vue/composition-api'

import injectBy from '@/utils/injectBy'
import { eventStoreInjectionKey } from '@/stores/eventStore'

export default defineComponent({
  setup (_, context: any) {
    const eventStore = injectBy(eventStoreInjectionKey)
    const showingDialog = ref<boolean>(false)

    const form = reactive({ content: '', result: '' })
    const submittable = computed<boolean>(() => form.content.split(' ').join('').length > 0)

    return {
      showingDialog,
      form,
      submittable
    }
  }
})
</script>

<style lang="stylus" scoped>
.achievement-field
  >>> .el-dialog__header
    display: none
  >>> .el-dialog__body
    padding: 0
  .tabs
    border-radius: 2px
    position: relative
    >>> .el-tabs__item
      padding: 0 10px !important
    .buttons
      text-align: right
  .close
    position: absolute
    top: 10px
    right: 10px
    z-index: 1
    cursor: pointer
  .row
    margin-bottom: 20px
    h3
      margin-bottom: 10px
      display: inline-block
      border-bottom: 1px dashed color3
      padding: 2px
      .icon
        vertical-align: -1px
    .textarea
      >>> .el-textarea__inner
        padding: 5px
</style>
