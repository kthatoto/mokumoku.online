import { InjectionKey, ref } from '@vue/composition-api'

interface User {
  uid: string
}

export const buildUserStore = () => {
  const user = ref<User | null>(null)
  const signin = (signingUser: User) => {
    console.log(signingUser)
    user.value = signingUser
  }
  const signout = () => { user.value = null }

  return { user, signin, signout }
}

export type UserStore = ReturnType<typeof buildUserStore>
export const userStoreInjectionKey: InjectionKey<UserStore> = Symbol('userStore')
