<template lang="pug">
.event-search-console
  .tags-console
    h3 タグで絞り込む
    tag-console(:tags="form.tags" @input="tags => form.tags = tags")
  .calendar-console
    h3 日付で絞り込む
    v-date-picker(v-model="form.dateRange" mode="range" is-inline)
      span(slot="header-title" slot-scope="{ year, month }") {{ year }}年 {{ month }}月
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from '@vue/composition-api'

import TagConsole from '@/components/molecules/TagConsole.vue'

interface DateRange {
  start: Date
  end: Date
}

interface Form {
  tags: string[]
  dateRange: DateRange
}

export default defineComponent({
  components: { TagConsole },
  setup (_, _context) {
    const form = reactive<Form>({
      tags: [],
      dateRange: { start: new Date(), end: new Date() }
    })

    return {
      form
    }
  }
})
</script>

<style lang="stylus" scoped>
.event-search-console
  display: flex
  justify-content: space-between
  .calendar
    &-console
      width: auto
  >>> .vc-day
    &.weekday-1
      color: #fc9896
    &.weekday-7
      color: #65a7d6
</style>