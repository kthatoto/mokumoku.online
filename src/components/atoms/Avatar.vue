<template lang="pug">
.avatar(:style="sizeStyle")
  img(:src="user.photoURL" :style="sizeStyle")
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'

import { User } from '@/stores/indexStore'

interface Props {
  user: User
  hosting: boolean
  size: number
}

export default defineComponent({
  props: {
    user: {
      type: Object,
      required: true
    },
    hosting: {
      type: Boolean,
      required: false,
      default: false
    },
    size: {
      type: Number,
      required: false,
      default: 40
    }
  },
  setup (props: Props, _context: any) {
    const sizeStyle = computed(() => {
      const size: string = `${props.size}px`
      return { width: size, height: size }
    })
    return { sizeStyle }
  }
})
</script>

<style lang="stylus" scoped>
.avatar
  img
    border-radius: 50%
    border: 1px solid color2
</style>
