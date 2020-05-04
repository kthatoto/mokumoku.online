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
        el-button(type="primary" :disabled="!submittable" @click="addTextComment") 投稿
    el-tab-pane
      span(slot="label")
        icon.icon.-r(name="comment")
        span プレビュー
      vue-markdown.markdown(:source="form.content")
      .buttons
        el-button(type="primary" :disabled="!submittable" @click="addTextComment") 投稿
    el-tab-pane
      span(slot="label")
        icon.icon.-r(name="image")
        span 画像
      .uploader
        el-upload(list-type="picture-card" :limit="3" action="" :auto-upload="false"
          :on-change="handleFilesChange" :on-remove="handleFilesChange")
          i.el-icon-plus
        .buttons
          el-button(type="primary" :disabled="!imagesSubmittable" @click="postImages")
</template>

<script lang="ts">
import { defineComponent, reactive, computed, ref } from '@vue/composition-api'

import injectBy from '@/utils/injectBy'
import { eventStoreInjectionKey } from '@/stores/eventStore'

export default defineComponent({
  setup (_, context: any) {
    const eventStore = injectBy(eventStoreInjectionKey)
    const form = reactive({ content: '' })
    const submittable = computed<boolean>(() => form.content.split(' ').join('').length > 0)

    const submitting = ref<boolean>(false)

    const addTextComment = async () => {
      if (!submittable.value) return
      if (submitting.value) return
      submitting.value = true
      const result: boolean = await eventStore.addTextComment(form.content)
      if (result) {
        context.root.$message({
          message: 'コメントを投稿しました',
          type: 'success',
          duration: 5000
        })
      } else {
        context.root.$message({
          message: 'コメントの投稿に失敗しました',
          type: 'error',
          duration: 5000
        })
      }
      submitting.value = false
      form.content = ''
      context.emit('getComments')
    }

    const imagesList = ref<any[]>([])
    const handleFilesChange = (_, fileList: any[]) => { imagesList.value = fileList }
    const imagesSubmittable = computed<boolean>(() => imagesList.value.length > 0)
    const postImages = () => {
      const storageRef = context.root.$firebase.storage().ref()
      imagesList.forEach((image) => {
        const imageRef = storageRef.child(`test/${Math.random().toString(32).substring(2)}`)
        imageRef.put(image)
      })
    }

    return {
      form,
      submittable,
      addTextComment,
      handleFilesChange,
      imagesSubmittable,
      postImages
    }
  }
})
</script>

<style lang="stylus" scoped>
.comment-field
  width: 100%
  .markdown
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
