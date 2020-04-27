<template lang="pug">
.index
  h1 mokumoku.online
  .events
    .event(v-for="event in events")
      h2 {{ event.title }}
      h3 {{ event.description }}
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
  margin: 20vh auto 0
  monospaced-font()
  h1
    font-size: 28px
    margin-bottom: 20px
</style>
