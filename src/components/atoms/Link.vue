<template lang="pug">
nuxt-link(:to="to")
  el-link(:type="type" :disabled="disabled")
    slot
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  props: {
    to: { type: String, required: true },
    type: { type: String, required: false, default: 'default' },
    disabled: { type: Boolean, required: false, default: null }
  }
})
</script>
