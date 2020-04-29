<template lang="pug">
.dialog
  el-dialog(:visible="showing" @close="close" width="90%")
    h3
      icon.icon.-r(name="terminal")
      span もくもく会をつくる
    el-form(:model="form" ref="form" label-width="80px")
      el-form-item(label="タイトル" required :error="errors.title")
        el-input(v-model="form.title" placeholder="オンラインもくもく会")
      el-form-item(label="説明")
        el-input(type="textarea" v-model="form.description" placeholder="作業内容は何でもOK！\n出入り自由です！")
      el-form-item(label="日付" required)
        el-date-picker(type="date" v-model="form.date" :clearable="false" :editable="false"
          :pickerOptions="datePickerOptions")
      el-form-item(label="時間" required :error="errors.startDatetime")
        .flex
          el-time-select(v-model="form.startDatetime" :picker-options="timeSelectOptions"
            :clearable="false" :editable="false" style="width: 100%")
          span 〜
          el-time-select(v-model="form.endDatetime" :picker-options="timeSelectOptions"
            :clearable="false" :editable="false" style="width: 100%")
      el-form-item(label="URL")
        el-input(type="url" placeholder="https://us04web.zoom.us/j/0123456789a")
        span.-note あとで編集できます
      .buttons
        el-button(type="primary" @click="submit")
          icon.icon.-r(name="plus")
          span 作成
</template>

<script lang="ts">
import { defineComponent, reactive, computed, ref } from '@vue/composition-api'

import injectBy from '@/utils/injectBy'
import { Event, indexStoreInjectionKey } from '@/stores/indexStore'

interface Errors {
  title: string | null
  startDatetime: string | null
  [key: string]: any
}

export default defineComponent({
  props: {
    showing: { type: Boolean, required: true }
  },
  setup (_, context: any) {
    const store = injectBy(indexStoreInjectionKey)

    const form = reactive<Event>({
      title: '',
      description: '',
      date: new Date(),
      startDatetime: '20:00',
      endDatetime: '22:00'
    })
    const resetForm = () => {
      form.title = ''
      form.description = ''
      form.date = new Date()
      form.startDatetime = '20:00'
      form.endDatetime = '22:00'
    }
    const close = () => { context.emit('closeModal') }
    const submitting = ref<boolean>(false)

    const errors = reactive<Errors>({ title: null, startDatetime: null })
    const clearErrors = () => {
      Object.keys(errors).forEach((key: string) => {
        errors[key] = null
      })
    }
    const validate = () => {
      if (form.title.length === 0) errors.title = 'タイトルを入力してください'
      if (parseInt(form.startDatetime.split(':').join()) >= parseInt(form.endDatetime.split(':').join())) {
        errors.startDatetime = '終了時間が終了時間を超えています'
      }
    }
    const existsErrors = computed<boolean>(() => {
      return Object.values(errors).every(v => v === null)
    })
    const submit = async () => {
      clearErrors()
      validate()
      if (!existsErrors.value) return
      if (submitting.value) return
      submitting.value = true
      const date: Date = new Date(form.date.toString())
      const res: boolean = await store.createEvent({ ...form, date })
      if (res) {
        context.root.$message({ message: 'もくもく会を作成しました', type: 'success', duration: 5000 })
        resetForm()
      } else {
        context.root.$message({ message: 'もくもく会の作成に失敗しました', type: 'error', duration: 5000 })
      }
      submitting.value = false
      close()
      store.getEvents()
    }

    const datePickerOptions = {
      disabledDate: (date: Date) => {
        const today: Date = new Date()
        return date < new Date(today.getFullYear(), today.getMonth(), today.getDate())
      }
    }
    const timeSelectOptions = { start: '00:00', end: '30:00', step: '00:30' }

    return {
      form,
      close,
      errors,
      submit,
      datePickerOptions,
      timeSelectOptions
    }
  }
})
</script>

<style lang="stylus" scoped>
.dialog
  h3
    color: color5
    margin-bottom: 20px
    margin-left: 15px
    font-size: 22px
    .icon
      circle-icon(24px)
  .buttons
    text-align: center
    .el-button
      width: 100px
  .flex
    display: flex
    > span
      margin: 0 5px
  .-note
    color: color3
    font-size: 12px
  >>> .el-dialog
    max-width: 500px
  >>> .el-date-editor--time-select
    max-width: 100px
    .el-input__inner
      padding-right: 0
  >>> .el-date-editor--date
    width: 160px
</style>
