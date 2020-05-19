<template lang="pug">
el-card.event-card
  .main
    .time-info
      .year {{ year }}
      .month-day
        span {{ month }}
        span /
        span {{ day }}
        span ({{ weekChar }})
    .main-info
      .group
      .title
        nuxt-link(:to="'/mokumoku' + event.id")
          h3 {{ event.title }}
  .sub
    .tags
      Tag(v-for="tag in event.tags" :key="tag" :label="tag")
    .description
  //- nuxt-link.title(:to="'/mokumoku/' + event.id")
  //-   h3 {{ event.title }}
  //- h4 詳細
  //- p.description {{ event.description }}
  //- h4 時間
  //- p.datetime
  //-   span.date {{ event.dateString }}
  //-   span {{ event.startDatetime }}
  //-   span 〜
  //-   span {{ event.endDatetime }}
  //- h4 参加ユーザー
  //- .users
  //-   Avatar.user(v-for="u in event.users" :key="u.uid" :user="u")
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'

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
    // const timeRangeText = computed<string>(() => {
    //   const startTime = dayjs(props.event.startDatetime).format()
    // })

    return {
      year,
      month,
      day,
      weekChar
    }
  }
})
</script>

<style lang="stylus" scoped>
.event-card
  .main
    display: flex
    justify-content: space-between
    margin-bottom: 10px
  time-info-width = 100px
  .time-info
    width: time-info-width
  .main-info
    width: 'calc(100% - %s)' % time-info-width
    .group
      height: 30px
</style>
