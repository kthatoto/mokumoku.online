<template lang="pug">
.index
  h1 mokumoku.online
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
      message: store.message
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
