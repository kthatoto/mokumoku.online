<template lang="pug">
.index
  .event-list
    .event-list__header
      h2
        icon.icon.-r(name="terminal")
        span もくもく会を探す
      .console
        el-button.button(type="primary" @click="openForm")
          icon.icon.-r(name="plus")
          span ホストする
    event-search-console.event-search-console
    .events
      event-card.event-card(v-for="event in events" :key="event.id" :event="event")
    new-event-modal(:showing="showingForm" @closeModal="closeForm")
  .achievement-list
    h2
      icon.icon.-r(name="list-alt")
      span もくもく一覧
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'

import injectBy from '@/utils/injectBy'
import { indexStoreInjectionKey } from '@/stores/indexStore'
import EventSearchConsole from '@/components/EventSearchConsole.vue'
import NewEventModal from '@/components/NewEventModal.vue'
import EventCard from '@/components/molecules/EventCard.vue'

export default defineComponent({
  components: { EventSearchConsole, NewEventModal, EventCard },
  setup (_, _context: any) {
    const store = injectBy(indexStoreInjectionKey)

    const showingForm = ref<boolean>(false)
    const openForm = () => { showingForm.value = true }
    const closeForm = () => { showingForm.value = false }
    store.getEvents()

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
  width: 900px
  margin: 30px auto 0
  display: flex
  justify-content: space-between
  h2
    font-size: 24px
    margin-bottom: 20px
    color: color5
    .icon
      circle-icon()
  .event-list
    width: 570px
    &__header
      display: flex
      justify-content: space-between
    .console
      text-align: right
      margin-bottom: 20px
  .achievement-list
    width: 300px
</style>
