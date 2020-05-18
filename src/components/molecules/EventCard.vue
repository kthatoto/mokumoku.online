<template lang="pug">
el-card.event-card
  nuxt-link.title(:to="'/mokumoku/' + event.id")
    h3 {{ event.title }}
  h4 詳細
  p.description {{ event.description }}
  h4 時間
  p.datetime
    span.date {{ event.dateString }}
    span {{ event.startDatetime }}
    span 〜
    span {{ event.endDatetime }}
  h4 参加ユーザー
  .users
    Avatar.user(v-for="u in event.users" :key="u.uid" :user="u")
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

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
  setup (props: Props, _context: any) {
    return {
    }
  }
})
</script>

<style lang="stylus" scoped>
.event-card
  event-card()
  .description
    text-truncate()
</style>
