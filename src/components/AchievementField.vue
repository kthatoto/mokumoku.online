<template lang="pug">
.achievement-field
  el-button(type="primary" size="mini" @click="showingDialog = true")
    icon.icon.-r(name="plus")
    span 記録する
  el-dialog(:visible.sync="showingDialog")
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'

import injectBy from '@/utils/injectBy'
import { eventStoreInjectionKey } from '@/stores/eventStore'

export default defineComponent({
  setup (_, context: any) {
    const eventStore = injectBy(eventStoreInjectionKey)
    const showingDialog = ref<boolean>(false)

    return {
      showingDialog
    }
  }
})
</script>
