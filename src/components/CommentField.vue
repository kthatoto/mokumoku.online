<template lang="pug">
.comment-field
  el-tabs.tabs(type="border-card")
    el-tab-pane
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
      vue-markdown.markdown(:anchorAttributes="{target: '_blank'}" :source="form.content")
      .buttons
        el-button(type="primary" :disabled="!submittable" @click="addTextComment") 投稿
    el-tab-pane
      span(slot="label")
        icon.icon.-r(name="image")
        span 画像
      .uploader(v-loading="uploading")
        el-upload(list-type="picture-card" :limit="1" action="" :auto-upload="false"
          :file-list="imageList" :disabled="imageSubmittable"
          :show-file-list="false" :on-change="handleFilesChange" :on-remove="handleFilesChange")
          .thumbnail(v-if="image" :style="{backgroundImage: `url(${image.url})`}")
          i.el-icon-plus(v-else)
        .buttons
          el-button(@click="clearImage") 削除
          el-button(type="primary" :disabled="!imageSubmittable" @click="postImage") 投稿
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

    const image = ref<any>(null)
    const imageList = computed<any[]>(() => image.value === null ? [] : [image.value])
    const handleFilesChange = (file: any, fileList: any[]) => {
      if (fileList.length === 0) {
        image.value = null
        return
      }
      image.value = file
    }
    const imageSubmittable = computed<boolean>(() => image.value !== null)
    const clearImage = () => { image.value = null }
    const uploading = ref<boolean>(false)

    const postImage = () => {
      const randomId: string = context.root.$firebase.firestore().collection('d').doc().id
      const imageRef = context.root.$firebase.storage()
        .ref(`${eventStore.event.value.id}/${randomId}`)
      const uploadTask = imageRef.put(image.value.raw)
      uploading.value = true

      const postProcess = async (completed: boolean) => {
        uploading.value = false
        clearImage()
        if (!completed) return false
        const imageUrl: string = await imageRef.getDownloadURL()
        const result: boolean = await eventStore.addImageComment(imageUrl)
        return result
      }
      const showErrorMessage = () => {
        context.root.$message({
          message: '画像のアップロードに失敗しました<br>リロードしてやり直してください',
          dangerouslyUseHTMLString: true,
          type: 'error',
          duration: 5000
        })
      }
      const showSuccessMessage = () => {
        context.root.$message({
          message: '画像を投稿しました',
          type: 'success',
          duration: 5000
        })
      }
      uploadTask.on('state_changed', {
        error: async () => {
          await postProcess(false)
          return showErrorMessage()
        },
        complete: async () => {
          const result: boolean = await postProcess(true)
          if (!result) return showErrorMessage()
          eventStore.getComments()
          showSuccessMessage()
        }
      })
    }

    return {
      form,
      submittable,
      addTextComment,
      handleFilesChange,
      image,
      imageList,
      imageSubmittable,
      clearImage,
      postImage,
      uploading
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
  .uploader
    >>> .el-upload--picture-card
      width: 100%
      margin-bottom: 10px
    .thumbnail
      width: 100%
      height: 100%
      background-size: contain
      background-repeat: no-repeat
      background-position: center
      background-color: color1
</style>
