<template lang="pug">
.default(v-loading="loading")
  el-container(v-if="!loading")
    el-header.default__header
      .header__container
        nuxt-link.logo.-hover(to="/")
          img(src="~/assets/mokumoku-face.png")
          h1 mokumoku.online
        el-dropdown.dropdown(trigger="click" @command="handleCommand")
          el-button.dropdown__button.-hover
            icon.icon(name="user")
          el-dropdown-menu(slot="dropdown")
            el-dropdown-item(command="signout") ログアウト
    nuxt.root
</template>

<script lang="ts">
import { defineComponent, provide, ref, onBeforeUnmount } from '@vue/composition-api'
import { buildIndexStore, indexStoreInjectionKey } from '@/stores/indexStore'

export default defineComponent({
  setup (_, context: any) {
    const store = buildIndexStore(context)
    provide(indexStoreInjectionKey, store)

    const signout = async () => {
      if (store.currentUser.value === null) return
      await context.root.$firebase.auth().signOut()
      context.root.$message({ message: 'ログアウトしました', type: 'success', duration: 5000 })
    }
    const handleCommand = (command: string) => {
      if (command === 'signout') signout()
    }

    const loading = ref<boolean>(true)
    const timerId: number = window.setInterval(() => {
      const onAuthStateChanged: boolean = context.root.context.app.onAuthStateChanged
      if (onAuthStateChanged) {
        loading.value = false
        clearInterval(timerId)
        store.getCurrentUser()
      }
    }, 500)

    onBeforeUnmount(() => { clearInterval(timerId) })

    return { handleCommand, loading }
  }
})
</script>

<style lang="stylus" scoped>
.default
  height: 100vh
  &__header
    border-bottom: 1px solid #d7dae2
    background-color: color4
  .header__container
    display: flex
    justify-content: space-between
    height: 100%
    width: 95%
    max-width: 800px
    margin: auto
    .logo
      display: inline-block
      height: 100%
      width: 300px
      h1
        color: color1
        display: inline-block
        font-size: 20px
        monospaced-font()
      img
        height: 70%
        margin-top: 10px
        transition: transform .2s
        filter: brightness(0) invert(1)
      &:hover
        img
          transform: rotate(20deg)
    .dropdown
      height: 80%
      &__button
        margin-top: 5%
        height: 100%
        width: 100px

@media (max-width: 450px)
  .default
    .header__container
      .logo
        width: 60px
        h1
          display: none
    .root
      width: 300px
</style>
