import { FunctionsHttpError, FunctionsRelayError, FunctionsFetchError } from '@supabase/supabase-js'
import { supabase } from './database'
import { useUserStore } from '@/stores/user-store'

export async function getLLMResponse(promptData) {
  const user = useUserStore()

  if (user.id === undefined) {
    console.log('No logged in user')
    return false
  }

  const { data, error } = await supabase.functions.invoke('openai-request', {
    headers: {
      Authorization: `Bearer ${user.session.access_token}`,
    },
    body: { promptData },
  })

  if (error instanceof FunctionsHttpError) {
    const errorMessage = await error.context.json()
    console.log('Function returned an error', errorMessage)
    return false
  } else if (error instanceof FunctionsRelayError) {
    console.log('Relay error:', error.message)
    return false
  } else if (error instanceof FunctionsFetchError) {
    console.log('Fetch error:', error.message)
    return false
  }

  return data
}
