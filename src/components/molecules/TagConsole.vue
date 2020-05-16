<template lang="pug">
.tag-console
  el-autocomplete.autocomplete(v-model="tagInput" :fetch-suggestions="searchFromTags" :trigger-on-focus="false"
      @keydown.enter.native="handleAutocompleteEnter" placeholder="タグを入力")
  .tags
    Tag(v-for="tag in tags" :key="tag" :label="tag" :closable="true" @close="tag => removeTag(tag)")
  h4 おすすめのタグ
  .tags.recommend
    Tag(v-for="tag in recommendTags" :key="tag" :label="tag" @click.native="addRecommendTag(tag)")
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
        return tag.value.toLowerCase().includes(query.toLowerCase())
      }) : tags
      callback(results)
    }
    const handleAutocompleteEnter = (event: any) => {
      if (event.keyCode !== 13) return
      const tag: string = event.target.value
      if (!tag) return
      if (!props.tags.includes(tag)) context.emit('input', [...props.tags, tag])
      tagInput.value = ''
    }
    const removeTag = (tag: string) => {
      const newTags: string[] = props.tags.filter((t: string) => tag !== t)
      context.emit('input', newTags)
    }

    const recommendTags = ref<string[]>([
      '個人開発', 'もくもく弱め', 'もくもく強め'
    ])
    const addRecommendTag = (tag: string) => {
      if (!props.tags.includes(tag)) context.emit('input', [...props.tags, tag])
    }

    return {
      tagInput,
      searchFromTags,
      handleAutocompleteEnter,
      removeTag,
      recommendTags,
      addRecommendTag
    }
  }
})
</script>

<style lang="stylus" scoped>
.tag-console
  .autocomplete
    margin-bottom: 5px
    width: 100%
  .tags
    margin-bottom: 10px
    height: 80px
    overflow-y: scroll
    border: 1px solid color2
    border-radius: 3px
    padding: 5px
    &.recommend
      .el-tag
        cursor: pointer
</style>
