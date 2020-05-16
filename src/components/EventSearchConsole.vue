<template lang="pug">
.event-search-console
  .tags-console
  .calendar-console
    el-calendar(:first-day-of-week="7" v-model="date")
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'

export default defineComponent({
  setup (_, _context) {
    const date = ref<Date>(new Date())
    return { date }
  }
})
</script>

<style lang="stylus" scoped>
.event-search-console
  display: flex
  justify-content: space-between
  .calendar
    &-console
      width: 370px
  >>> .el-calendar
    border-radius: 5px
    &__body
      padding-top: 0
      padding-bottom: 12px
    &-table__row
      .is-selected
        background-color: color4
        color: color1
        .el-calendar-day
          &:hover
            background-color: color4
    &-day
      height: 50px
</style>
