<template lang="pug">
.event
  h1 aaa
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  setup (_, context) {
    console.log(context.root.$route.params.id)
  }
})
</script>

<style lang="stylus" scoped>
.event
  width: 400px
  margin: 50px auto 0
  h1
    font-size: 24px
    margin-bottom: 20px
    color: color5
</style>
