<template lang="pug">
.avatar(:style="sizeStyle")
  icon.icon(v-if="user.hosting" name="user-circle")
  img(:src="user.photoURL" :style="sizeStyle")
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'

import { User } from '@/stores/indexStore'

interface Props {
  user: User
  size: number
}

export default defineComponent({
  props: {
    user: {
      type: Object,
      required: true
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
  position: relative
  .icon
    position: absolute
    bottom: -15%
    right: -15%
    width: 50%
    height: 50%
    color: color5
    background-color: white
    border-radius: 50%
  img
    border-radius: 50%
    border: 1px solid color2
</style>
