<template lang="pug">
el-card.event-card
  .header
    .time-info
      .year {{ year }}
      .month-day
        span {{ month }}
        span /
        span {{ day }}
        span ({{ weekChar }})
      .time-range {{ timeRangeText }}
    .main-info
      .title
        nuxt-link(:to="'/mokumoku/' + event.id")
          h3 {{ event.title }}
      .host
        icon.icon.-r.-large(name="user")
        .host-plate
          Avatar.avatar(:user="event.host" :size="30")
          span {{ event.host.displayName }}
  .footer
    .tags
      Tag(v-for="tag in event.tags" :key="tag" :label="tag")
    .join-number
      span.joining-number {{ event.users.length }}
      span(v-if="event.limitUserCount") /{{ event.maxUserCount }}
      span.unit 人
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'

import { Event } from '@/stores/indexStore'
import timeConvertToOver24 from '@/utils/timeConvertToOver24'

interface Props {
  event: Event
}

export default defineComponent({
  props: {
    event: {
      type: Object,
      required: true
    }
  },
  setup (props: Props, context: any) {
    const dayjs = context.root.$dayjs
    const date = computed<Date>(() => props.event.date)

    const year = computed<number>(() => date.value.getFullYear())
    const month = computed<number>(() => date.value.getMonth() + 1)
    const day = computed<number>(() => date.value.getDate())
    const weekChar = computed<number>(() => dayjs(date.value).format('dd'))

    const timeRangeText = computed<string>(() => {
      return `${props.event.startDatetime}〜${props.event.endDatetime}`
    })

    return {
      year,
      month,
      day,
      weekChar,
      timeRangeText
    }
  }
})
</script>

<style lang="stylus" scoped>
.event-card
  margin-bottom: 15px
  .header
    flex()
    margin-bottom: 10px
  time-info-width = 100px
  .time-info
    width: time-info-width
    .year
      font-size: 14px
      font-weight: bold
    .month-day
      font-size: 18px
      font-weight: bold
      color: color4
  .main-info
    margin-left: 20px
    width: 'calc(100% - %s - 20px)' % time-info-width
    .title
      text-decoration: underline
      font-size: 18px
      margin-bottom: 5px
    .host
      .icon
        vertical-align: middle
      .avatar
        vertical-align: middle
        margin-right: 5px
      &-plate
        display: inline-block
        border: 1px solid #ccc
        border-radius: 3px
        padding: 3px 5px
  .footer
    flex()
    align-items: flex-end
    .tags
      width: calc(100% - 60px)
    .join-number
      text-align: right
      .joining-number
        font-weight: bold
        font-size: 14px
      .unit
        margin-left: 3px
        font-size: 11px
</style>
