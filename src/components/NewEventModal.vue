<template lang="pug">
.dialog
  el-dialog(:visible="showing" @close="close")
    h3
      icon.icon.-r(name="terminal")
      span もくもく会をつくる
    el-form(:model="form" ref="form" label-width="100px")
      el-form-item(label="タイトル" required)
        el-input(v-model="form.title" placeholder="オンラインもくもく会")
      el-form-item(label="説明")
        el-input(type="textarea" v-model="form.description" placeholder="作業内容は何でもOK！\n出入り自由です！")
      el-form-item(label="日付" required)
        el-date-picker(type="date" v-model="form.date" :clearable="false" :editable="false")
      el-form-item(label="時間" required)
        el-row
          el-col(:span="8")
            el-time-select(v-model="form.startDatetime" :picker-options="pickerOptions"
              :clearable="false" :editable="false" style="width: 100%")
          el-col(:span="2" style="text-align: center") 〜
          el-col(:span="8")
            el-time-select(v-model="form.endDatetime" :picker-options="pickerOptions"
              :clearable="false" :editable="false" style="width: 100%")
      el-form-item(label="URL")
        el-input(type="url" placeholder="https://us04web.zoom.us/j/0123456789a")
      .buttons
        el-button(type="primary" @click="submit")
          icon.icon.-r(name="plus")
          span 作成
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from '@vue/composition-api'

interface Form {
  title: string
  description: string
  date: Date
  startDatetime: string
  endDatetime: string
}

interface Errors {
  title: string | null
  [key: string]: any
}

export default defineComponent({
  props: {
    showing: { type: Boolean, required: true }
  },
  setup (_, context: any) {
    const form = reactive<Form>({
      title: '',
      description: '',
      date: new Date(),
      startDatetime: '20:00',
      endDatetime: '22:00'
    })
    const pickerOptions = { start: '00:00', end: '30:00', step: '00:30' }
    const close = () => { context.emit('closeModal') }

    const errors = reactive<Errors>({ title: null })
    const clearErrors = () => {
      Object.keys(errors).forEach((key: string) => {
        errors[key] = null
      })
    }
    const submit = async () => {
      clearErrors()
      const valid = await context.refs.form.valudate
      if (!valid) return
      alert('submit')
    }

    return {
      form,
      pickerOptions,
      close,
      submit
    }
  }
})
</script>

<style lang="stylus" scoped>
.dialog
  h3
    color: color5
    margin-bottom: 20px
    margin-left: 20px
    font-size: 22px
    .icon
      circle-icon(24px)
  .buttons
    text-align: center
    .el-button
      width: 100px
</style>
