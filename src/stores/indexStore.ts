import { InjectionKey, ref } from '@vue/composition-api'

interface Event {
}

export const buildIndexStore = (context: any) => {
  const getResources = async () => {
    const res = await context.root.$axios.get('/api/messages')
    console.log(res)
  }
  const message = ref<string>('')
  return { getResources, message }
}

export type IndexStore = ReturnType<typeof buildIndexStore>
export const indexStoreInjectionKey: InjectionKey<IndexStore> = Symbol('indexStore')
