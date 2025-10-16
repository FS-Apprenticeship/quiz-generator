import { supabase } from '@/lib/database'

export async function setupUser(id, name, educationLevel) {
  const { data, error } = supabase
    .from('users')
    .insert({
      id: id,
      user_name: name,
      standard_level: educationLevel,
    })
    .select()

  if (error !== null) return { data: undefined, error: 'There was an error' }
  return { data: data, error: undefined }
}

export async function retrieveUser(id) {
  const { data, error } = await supabase.from('users').select('*').eq('id', id)

  if (error !== null) return undefined
  return data[0]
}

export async function updateUser(id, updatedInfo) {
  const { data, error } = await supabase
    .from('users')
    .update({ ...updatedInfo })
    .eq('id', id)
    .select()

  if (error !== null) return { data: undefined, error: 'There was an error!' }
  return { data, error: undefined }
}
