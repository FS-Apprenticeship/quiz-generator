import { supabase } from '@/lib/database'

export async function signUpNewUser(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error !== null) return { data: undefined, error: 'Error signing up' }
  return { data: data.user, error: undefined }
}

export async function signInWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error !== null) return { data: undefined, error: 'Error signing in' }

  return { data, error: undefined }
}

export async function signOutUser(access_token) {
  const { error } = await supabase.auth.signOut(access_token)

  if (error !== null) return false
  return true
}
