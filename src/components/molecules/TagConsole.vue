<template lang="pug">
.tag-console
  el-autocomplete(v-model="tagInput" :fetch-suggestions="searchFromTags" :trigger-on-focus="false"
      @keydown.enter.native="handleAutocompleteEnter")
  .tags
    el-tag(v-for="tag in tags" closable @close="removeTag(tag)" :key="tag")
      icon.icon.-r(name="hashtag")
      span {{ tag }}
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'

interface Props {
  tags: string[]
}

export default defineComponent({
  props: {
    tags: {
      type: Array,
      required: true
    }
  },
  setup (props: Props, context) {
    const tagInput = ref<string>('')
    const searchFromTags = (query: string, callback: Function) => {
      const tags: { value: string }[] = [
        { value: 'vue' },
        { value: 'asdf' },
        { value: 'react' },
        { value: 'elm' },
        { value: 'javascript' },
        { value: 'jquery' }
      ]
      const results: { value: string }[] = query ? tags.filter((tag: { value: string }) => {
        return tag.value.toLowerCase().indexOf(query.toLowerCase()) >= 0
      }) : tags
      callback(results)
    }
    const handleAutocompleteEnter = (event: any) => {
      if (event.keyCode !== 13) return
      const tag: string = event.target.value
      if (props.tags.indexOf(tag) < 0) {
        context.emit('input', [...props.tags, tag])
      }
      tagInput.value = ''
    }
    const removeTag = (tag: string) => {
      const newTags: string[] = props.tags.filter((t: string) => tag !== t)
      context.emit('input', newTags)
    }

    return {
      tagInput,
      searchFromTags,
      handleAutocompleteEnter,
      removeTag
    }
  }
})
</script>

<style lang="stylus" scoped>
.tag-console
  .tags
    .el-tag
      font-size: 16px
      &:not(:last-child)
        margin-right: 10px
      .icon
        vertical-align: -2px
</style>
