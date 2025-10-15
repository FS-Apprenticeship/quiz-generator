import {
  FunctionsHttpError,
  FunctionsRelayError,
  FunctionsFetchError,
} from '../../node_modules/@supabase/supabase-js/dist/module/index'
import { supabase } from './database'

export async function getLLMResponse(promptData) {
  const { data, error } = await supabase.functions.invoke('openai-request', {
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
