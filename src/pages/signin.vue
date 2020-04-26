<template lang="pug">
.signin
  el-card.signin__card
    .signin__header(slot="header")
      h2 Signin
    .signin__row
      el-button.signin__buttonTop(@click="twitterAuth")
        span Signin with Twitter
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  layout: 'beforeSignin',
  meta: { shouldGuest: true },
  setup (_, context: any) {
    const twitterAuth = async () => {
      await context.root.$firebase.auth().signOut()
      const TwitterAuthProvider = context.root.$firebase.auth.TwitterAuthProvider
      const provider = new TwitterAuthProvider()
      context.root.$firebase.auth().signInWithRedirect(provider)
    }

    return { twitterAuth }
  }
})
</script>

<style lang="stylus" scoped>
.signin
  text-align: center
  padding: 200px 0
  &__card
    width: 300px
    margin: auto
    h2
      text-align: center
  &__row
    &:not(.-last)
      margin-bottom: 15px
  &__buttonTop
    width: 240px
</style>
