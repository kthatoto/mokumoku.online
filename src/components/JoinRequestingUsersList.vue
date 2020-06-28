<template lang="pug">
.join-request
  el-dialog(:visible="showing" @close="hide")
    h3(slot="title")
      icon.icon.-r.-x-large(name="user-friends")
      span 参加申請中のユーザー
    .users
      .user(v-for="user in event.joinRequestingUsers" :key="user.uid")
        div
          Avatar.avatar(:user="user")
          span.name {{ user.displayName }}
        el-button(type="primary" size="mini")
          icon.icon.-r(name="sign-in-alt")
          span 参加許可
</template>

<script lang="ts">
import { defineComponent, provide, ref } from '@vue/composition-api'

import injectBy from '@/utils/injectBy'
import { eventStoreInjectionKey } from '@/stores/eventStore'

export default defineComponent({
  props: {
    showing: {
      type: Boolean,
      required: true
    }
  },
  setup (_, context: any) {
    const eventStore = injectBy(eventStoreInjectionKey)
    const hide = () => { context.emit('hide') }

    return {
      event: eventStore.event,
      hide
    }
  }
})
</script>

<style lang="stylus" scoped>
.join-request
  h3
    font-size: 22px
  .users
    .user
      margin-bottom: 10px
      flex()
      .avatar
        vertical-align: middle
        margin-right: 10px
      .name
        font-size: 16px
        font-weight: bold
</style>
