<template lang="pug">
.event-search-console
  .consoles
    .tags-console
      h3(@click="toggleStatus('tags')")
        span タグで絞り込む
        icon.icon.-l(v-if="showingStatuses.tags" name="chevron-down")
        icon.icon.-l(v-else name="chevron-left")
      el-card
        el-collapse-transition
          div(v-if="!showingStatuses.tags")
            .tags
              el-tag(v-for="tag in form.tags" :key="tag") {{ tag }}
        el-collapse-transition
          tag-console(v-if="showingStatuses.tags" :tags="form.tags" @input="tags => form.tags = tags")
    .calendar-console
      h3(@click="toggleStatus('calendar')")
        span 日付で絞り込む
        icon.icon.-l(v-if="showingStatuses.calendar" name="chevron-down")
        icon.icon.-l(v-else name="chevron-left")
      el-card
        el-collapse-transition
          div(v-if="!showingStatuses.calendar")
            p {{ form.dateRange.start }}
            p {{ form.dateRange.end }}
        el-collapse-transition
          v-date-picker(v-if="showingStatuses.calendar" v-model="form.dateRange" mode="range" is-inline)
            span(slot="header-title" slot-scope="{ year, month }") {{ year }}年 {{ month }}月
  .search
    el-button(@click="toggleAllStatuses")
      span(v-if="anyShowing") 閉じる
      span(v-else) 開く
    el-button(type="primary") 検索
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from '@vue/composition-api'

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
    const showingStatuses = reactive({ tags: true, calendar: true })
    const toggleStatus = (key: string) => {
      if (key === 'tags') showingStatuses.tags = !showingStatuses.tags
      if (key === 'calendar') showingStatuses.calendar = !showingStatuses.calendar
    }
    const anyShowing = computed<boolean>(() => {
      return showingStatuses.tags || showingStatuses.calendar
    })
    const toggleAllStatuses = () => {
      if (anyShowing.value) {
        showingStatuses.tags = false
        showingStatuses.calendar = false
      } else {
        showingStatuses.tags = true
        showingStatuses.calendar = true
      }
    }

    return {
      form,
      showingStatuses,
      toggleStatus,
      toggleAllStatuses,
      anyShowing
    }
  }
})
</script>

<style lang="stylus" scoped>
.event-search-console
  margin-bottom: 30px
  .consoles
    display: flex
    justify-content: space-between
    margin-bottom: 10px
  .tags-console
    width: 280px
  .calendar-console
    width: 260px
  h3
    margin-bottom: 10px
    cursor: pointer
    &:hover
      text-decoration: underline

  .search
    text-align: right

  >>> .vc-day
    &.weekday-1
      color: #fc9896
    &.weekday-7
      color: #65a7d6

  .tags-console
    >>> .el-card__body
      padding: 15px 10px 5px
  .calendar-console
    >>> .el-card__body
      padding: 0
      .vc-container
        border: none
</style>
