<template lang="pug">
.root(v-loading="loading")
  nuxt
</template>

<script lang="ts">
import { defineComponent, ref, onBeforeUnmount } from '@vue/composition-api'

export default defineComponent({
  setup (_, context: any) {
    const loading = ref<boolean>(true)
    const timerId: number = window.setInterval(() => {
      const onAuthStateChanged: boolean = context.root.context.app.onAuthStateChanged
      const currentUser = context.root.$firebase.auth().currentUser
      if (onAuthStateChanged && !currentUser) {
        loading.value = false
        clearInterval(timerId)
      }
    }, 500)

    onBeforeUnmount(() => { clearInterval(timerId) })

    return { loading }
  }
})
</script>

<style lang="stylus" scoped>
.root
  height: 100vh
</style>
