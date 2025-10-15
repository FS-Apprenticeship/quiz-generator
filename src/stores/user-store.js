import { signInWithEmail, signOutUser, signUpNewUser } from '@/interfacers/session-manager'
import { retrieveUser, setupUser } from '@/interfacers/user-storage'
import { supabase } from '@/lib/database'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref(undefined)
  const userData = ref(undefined)
  const session = ref(undefined)

  const id = computed(() => user.value?.id)
  const email = computed(() => user.value?.email)

  async function loadUser() {
    const { data, error } = await supabase.auth.refreshSession()

    if (error !== null) return

    user.value = data.user
    session.value = data.session
  }

  async function signUp(email, password) {
    const { data, error } = await signUpNewUser(email, password)
    if (error !== undefined) return false
    await setupUser(data.id)
    return true
  }

  async function signIn(email, password) {
    const { data, error } = signInWithEmail(email, password)
    if (error !== undefined) return false
    user.value = data.user
    session.value = data.value
    userData.value = await retrieveUser(user.value.id)

    if (userData.value === undefined) await setupUser(data.id)

    return true
  }

  async function signOut() {
    const success = signOutUser(session.value.access_token)
    if (!success) return false
    user.value = undefined
    userData.value = undefined
    session.value = undefined
  }

  return {
    user,
    userData,
    session,
    id,
    email,
    loadUser,
    signUp,
    signIn,
    signOut,
  }
})
