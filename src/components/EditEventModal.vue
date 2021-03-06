<template lang="pug">
.dialog
  el-dialog(:visible="showing" @close="close" width="90%")
    h3
      icon.icon.-r(name="terminal")
      span もくもく会を編集する
    el-form(:model="form" ref="form" label-width="85px")
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
        el-input(type="url" v-model="form.url" placeholder="https://us04web.zoom.us/j/0123456789a")
      el-form-item(label="参加人数")
        el-radio-group.radio-group(@change="toggleLimitUserCount" v-model="form.limitUserCount")
          el-radio-button(:label="false") 制限しない
          el-radio-button(:label="true") 制限する
        el-input-number(v-if="form.limitUserCount" v-model="form.maxUserCount" :min="1" :max="100")
      el-form-item(label="参加許可制")
        el-radio-group.radio-group(v-model="form.joinPermission")
          el-radio-button(:label="false") 誰でも
          el-radio-button(:label="true") 制限する
      el-form-item(label="タグ")
        tag-console(:tags="form.tags" @input="tags => form.tags = tags")
      .buttons
        el-button.submit(type="primary" @click="submit")
          icon.icon.-r(name="plus")
          span 更新
        el-button.right(type="danger" icon="el-icon-delete" circle @click="deleteConfirm")
</template>

<script lang="ts">
import { defineComponent, reactive, computed, ref } from '@vue/composition-api'

import injectBy from '@/utils/injectBy'
import { Event, EventInfo, indexStoreInjectionKey } from '@/stores/indexStore'
import { eventStoreInjectionKey } from '@/stores/eventStore'
import TagConsole from '@/components/molecules/TagConsole.vue'

interface Errors {
  title: string | null
  startDatetime: string | null
  [key: string]: any
}

interface Props {
  showing: boolean
  event: Event
}

export default defineComponent({
  props: {
    showing: { type: Boolean, required: true },
    event: { type: Object, required: true }
  },
  components: { TagConsole },
  setup (props: Props, context: any) {
    const store = injectBy(indexStoreInjectionKey)
    const eventStore = injectBy(eventStoreInjectionKey)

    const form = reactive<Event>(JSON.parse(JSON.stringify(props.event)))
    const toggleLimitUserCount = (flag: boolean) => {
      if (flag) form.maxUserCount = eventStore.event.value.maxUserCount || 10
      if (!flag) form.maxUserCount = null
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
      const eventInfo: EventInfo = {
        title: form.title,
        description: form.description,
        date,
        startDatetime: form.startDatetime,
        endDatetime: form.endDatetime,
        url: form.url,
        limitUserCount: form.limitUserCount,
        maxUserCount: form.maxUserCount,
        joinPermission: form.joinPermission,
        tags: form.tags
      }
      const result: boolean = await eventStore.updateEvent(eventInfo)
      if (result) {
        context.root.$message({
          message: 'もくもく会を編集しました',
          type: 'success',
          duration: 5000
        })
      } else {
        context.root.$message({
          message: 'もくもく会の編集に失敗しました',
          type: 'error',
          duration: 5000
        })
      }
      submitting.value = false
      close()
      eventStore.getEvent()
    }

    const deleteConfirm = () => {
      context.root.$confirm('本当に削除してよろしいですか？<br>(コメントなども全て削除されます)', {
        title: 'もくもく会を削除',
        confirmButtonText: '削除',
        cancelButtonText: 'キャンセル',
        dangerouslyUseHTMLString: true,
        callback: (res: string) => {
          if (res !== 'confirm') return
          eventStore.deleteEvent()
          store.getEvents()
          context.root.$message({ message: 'もくもく会を削除しました', type: 'success', duration: 5000 })
          context.root.$router.push('/')
        }
      })
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
      toggleLimitUserCount,
      close,
      errors,
      submit,
      deleteConfirm,
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
    position: relative
    .submit
      width: 100px
    .right
      position: absolute
      top: 0
      right: 0
      bottom: 0
  .flex
    display: flex
    > span
      margin: 0 5px
  .-note
    color: color3
    font-size: 12px
  .radio-group
    margin-bottom: 10px

  >>> .el-dialog
    max-width: 500px
  >>> .el-date-editor--time-select
    max-width: 100px
    .el-input__inner
      padding-right: 0
  >>> .el-date-editor--date
    width: 160px
</style>
