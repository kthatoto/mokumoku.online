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
    el-card.card(v-for="event in events" :key="event.id")
      nuxt-link.title(:to="'/mokumoku/' + event.id")
        h3 {{ event.title }}
      h4 詳細
      p.description {{ event.description }}
      h4 時間
      p.datetime
        span.date {{ event.dateString }}
        span {{ event.startDatetime }}
        span 〜
        span {{ event.endDatetime }}
      h4 参加しているユーザー
      .users
        .user(v-for="u in event.users" :key="u.uid")
          img(:src="u.photoURL")
  new-event-modal(:showing="showingForm" @closeModal="closeForm")
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'

import injectBy from '@/utils/injectBy'
import { indexStoreInjectionKey } from '@/stores/indexStore'
import NewEventModal from '@/components/NewEventModal.vue'

export default defineComponent({
  meta: { auth: true },
  components: { NewEventModal },
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
  width: 400px
  margin: 50px auto 0
  h2
    font-size: 24px
    margin-bottom: 20px
    color: color5
    .icon
      circle-icon()
  .console
    text-align: right
    margin-bottom: 20px
  .card
    event-card()
</style>
