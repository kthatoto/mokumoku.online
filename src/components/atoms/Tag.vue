<template lang="pug">
el-tag.tag(:closable="closable" @close="close")
  icon.icon.-r(name="hashtag")
  span {{ label }}
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

interface Props {
  label: string
  closable: boolean
}

export default defineComponent({
  props: {
    label: { type: String, required: true },
    closable: { type: Boolean, required: false, default: false }
  },
  setup (props: Props, context) {
    const close = () => { context.emit('close', props.label) }
    return { close }
  }
})
</script>

<style lang="stylus" scoped>
.tag
  font-size: 12px
  margin-bottom: 5px
  background-color: color1
  padding: 0 7px 0 5px
  &:not(:last-child)
    margin-right: 10px
  .icon
    vertical-align: -2px
</style>
