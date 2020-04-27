<template lang="pug">
el-container.default
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
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  setup (_, context: any) {
    const signout = async () => {
      await context.root.$firebase.auth().signOut()
      context.root.$message({ message: 'ログアウトしました', type: 'success', duration: 5000 })
      context.root.$router.push('/signin')
    }
    const handleCommand = (command: string) => {
      if (command === 'signout') signout()
    }

    return { handleCommand }
  }
})
</script>

<style lang="stylus" scoped>
.default
  &__header
    border-bottom: 1px solid #d7dae2
    background-color: color4
  .header__container
    display: flex
    justify-content: space-between
    height: 100%
    width: 95%
    max-width: 700px
    margin: auto
    .logo
      display: inline-block
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
        border-radius: 0
        border: none
        background-color: color1
        color: color4
        border-radius: 5%

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
