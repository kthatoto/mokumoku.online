<template lang="pug">
.index
  h2
    icon.icon.-r(name="terminal")
    span 開催中のもくもく会
  .console
    el-button.button(type="primary" @click="openForm")
      icon.icon.-r(name="plus")
      span ホストする
  .events
    el-card.event(v-for="event in events" :key="event.id")
      h3 {{ event.title }}
      p {{ event.description }}
  new-event-modal(:showing="showingForm" @closeModal="closeForm")
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from '@vue/composition-api'

import { buildIndexStore } from '@/stores/indexStore'
import NewEventModal from '@/components/NewEventModal.vue'

export default defineComponent({
  meta: { auth: true },
  components: { NewEventModal },
  setup (_, context) {
    const store = buildIndexStore(context)

    const showingForm = ref<boolean>(false)
    const openForm = () => { showingForm.value = true }
    const closeForm = () => { showingForm.value = false }

    onMounted(async () => {
      await store.getResources()
    })

    return {
      events: store.events,
      showingForm,
      openForm,
      closeForm
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
      circle-icon()
  .console
    text-align: right
    margin-bottom: 20px
  .events
    .event
      h3
        font-size: 20px
      p
        font-size: 18px
</style>
