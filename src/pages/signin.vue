<template lang="pug">
.signin
  el-card.signin__card
    .signin__header(slot="header")
      h2 ログイン
    .signin__row
      el-button.signin__button.-twitter(@click="twitterAuth" :disabled="pushedTwitterAuth")
        img(src="~/assets/twitter-icon-white.png")
        span Twitterでログイン
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { Message } from 'element-ui'

export default defineComponent({
  layout: 'beforeSignin',
  meta: { shouldGuest: true },
  setup (_, context: any) {
    const pushedTwitterAuth = ref<boolean>(false)
    const twitterAuth = async () => {
      if (pushedTwitterAuth.value) return
      pushedTwitterAuth.value = true
      try {
        await context.root.$firebase.auth().signOut()
        const TwitterAuthProvider = context.root.$firebase.auth.TwitterAuthProvider
        const provider = new TwitterAuthProvider()
        context.root.$firebase.auth().signInWithRedirect(provider)
      } catch (e) {
        console.log(e)
        pushedTwitterAuth.value = false
        Message({ message: 'ログインに失敗しました。時間をおいてやり直してください。', type: 'error', duration: 5000 })
      }
    }

    return { twitterAuth, pushedTwitterAuth }
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
  &__button
    width: 240px
    height: 50px
    &.-twitter
      background-color: twitterColor
      color: white
      >>> > span
        width: 100%
        height: 100%
        vertical-align: middle
        display: flex
        margin: auto
        align-items: center
        justify-content: center
      img
        width: 30px
        margin-right: 10px
</style>
