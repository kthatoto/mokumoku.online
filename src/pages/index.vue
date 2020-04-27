<template lang="pug">
.index
  h2
    icon.icon.-r(name="terminal")
    span 開催中のもくもく会
  .events
    .event(v-for="event in events")
      h3 {{ event.title }}
      h4 {{ event.description }}
</template>

<script lang="ts">
import { defineComponent, onMounted } from '@vue/composition-api'

import { buildIndexStore } from '@/stores/indexStore'

export default defineComponent({
  meta: { auth: true },
  setup (_, context) {
    const store = buildIndexStore(context)

    onMounted(async () => {
      await store.getResources()
    })

    return {
      events: store.events
    }
  }
})
</script>

<style lang="stylus" scoped>
.index
  width: 400px
  margin: 50px auto 0
  h2
    font-size: 28px
    margin-bottom: 20px
    color: color5
    .icon
      background-color: color5
      color: color1
      padding: 7px
      border-radius: 50%
      width: 30px
      height: 30px
</style>
