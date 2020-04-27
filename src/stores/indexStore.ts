import { InjectionKey, ref } from '@vue/composition-api'

import { axios } from 'axios'

interface Event {
}

export const buildIndexStore = (context) => {
  console.log(context)
  const getResources = async () => {
    const res = await context.root.$axios.get('https://us-central1-mokumokuonline.cloudfunctions.net/hello_world')
    console.log(res)
  }
  const message = ref<string>('')
  return { getResources, message }
}

export type IndexStore = ReturnType<typeof buildIndexStore>
export const indexStoreInjectionKey: InjectionKey<IndexStore> = Symbol('indexStore')
