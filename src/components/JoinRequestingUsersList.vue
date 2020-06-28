<template lang="pug">
.join-request
  p.-underline(v-if="event.joinRequestingUsers.length > 0" @click="showingDialog = true")
    icon.icon.-r(name="exclamation-circle")
    span 参加申請中のユーザーが{{ event.joinRequestingUsers.length }}人います
  p(v-else)
    icon.icon.-r(name="exclamation-circle")
    span 参加申請中のユーザーはいません
  el-dialog(:visible.sync="showingDialog")
    h3(slot="title")
      icon.icon.-r.-x-large(name="user-friends")
      span 参加申請中のユーザー
    .users
      .user(v-for="user in event.joinRequestingUsers" :key="user.uid")
        div
          Avatar.avatar(:user="user")
          span.name {{ user.displayName }}
        el-button(type="primary" size="mini" @click="joinUser(user)")
          icon.icon.-r(name="sign-in-alt")
          span 参加許可
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'

import injectBy from '@/utils/injectBy'
import { eventStoreInjectionKey } from '@/stores/eventStore'
import { User } from '@/stores/indexStore'

export default defineComponent({
  setup (_, context: any) {
    const eventStore = injectBy(eventStoreInjectionKey)
    const showingDialog = ref<boolean>(false)
    const joinUser = async (user: User) => {
      const result: boolean = await eventStore.joinUserToEvent(user)
      if (result) {
        context.root.$message({
          message: `${user.displayName}さんをイベントに参加させました`,
          type: 'success',
          duration: 5000
        })
      } else {
        context.root.$message({
          message: '参加許可に失敗しました',
          type: 'error',
          duration: 5000
        })
      }
      eventStore.getEvent()
    }

    return {
      event: eventStore.event,
      showingDialog,
      joinUser
    }
  }
})
</script>

<style lang="stylus" scoped>
.join-request
  .-underline
    text-decoration: underline
    cursor: pointer
    font-weight: bold
    hover()
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
