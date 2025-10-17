import { signInWithEmail, signOutUser, signUpNewUser } from '@/interfacers/session-manager'
import { retrieveUser, setupUser, updateUser } from '@/interfacers/user-storage'
import { supabase } from '@/lib/database'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref(undefined)
  const session = ref(undefined)
  const userData = ref(undefined)

  const id = computed(() => user.value?.id)
  const email = computed(() => user.value?.email)
  const standardLevel = computed(() => userData.value?.standard_level)

  async function loadUser() {
    const { data, error } = await supabase.auth.refreshSession()

    if (error !== null) return false

    user.value = data.user
    session.value = data.session
    userData.value = await retrieveUser(user.value.id)
    return true
  }

  async function signUp(email, password) {
    const { data, error } = await signUpNewUser(email, password)
    if (error !== undefined) return false
    await setupUser(data.id, data.email, 'average')
    return true
  }

  async function signIn(email, password) {
    const { data, error } = await signInWithEmail(email, password)
    if (error !== undefined) return false
    user.value = data.user
    session.value = data.value
    userData.value = await retrieveUser(user.value.id)

    if (userData.value === undefined)
      userData.value = await setupUser(data.id, data.email, 'average')

    if (userData.value === undefined) {
      return false
    }

    return true
  }

  async function updateLevelOfEducation(newLevel) {
    const { data, error } = updateUser(id, { standard_level: newLevel })

    if (error !== undefined) return false

    userData.value = data
    return true
  }

  async function updateName(newName) {
    const { data, error } = updateUser(id, { user_name: newName })

    if (error !== undefined) return false

    userData.value = data
    return true
  }

  async function signOut() {
    const success = await signOutUser(session.value.access_token)
    if (!success) return false
    user.value = undefined
    userData.value = undefined
    session.value = undefined

    return true
  }

  return {
    user,
    userData,
    session,
    id,
    email,
    standardLevel,
    loadUser,
    signUp,
    signIn,
    updateLevelOfEducation,
    updateName,
    signOut,
  }
})
