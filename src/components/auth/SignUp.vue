<script setup>
import { useUserStore } from '@/stores/user-store'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '../universals/BaseButton.vue'

const router = useRouter()
const user = useUserStore()

const emailAddress = ref('')
const validEmail = computed(() => {
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g
  return emailRegex.test(emailAddress.value)
})

const password = ref('')
const confirmedPassword = ref('')
const passwordVisible = ref(false)

const passwordInput = computed(() => (passwordVisible.value ? 'text' : 'password'))

const error = ref('')

async function submit() {
  if (password.value !== confirmedPassword.value || !validEmail.value) return //Just to be safe
  let success = await user.signUp(emailAddress.value, password.value)

  if (!success) error.value = 'Something went wrong! Please try again'
  else {
    alert('Check your email for your confirmation link')
    router.push('/')
  }
}
</script>

<template>
  <div class="relative flex flex-col justify-around items-center w-dvw h-dvh">
    <header class="absolute top-0 left-0 right-0 flex items-center justify-around pt-2.5 w-dvw">
      <BaseButton class="absolute left-0 ml-2 px-4" @click="router.back()"
        ><h1>&lt;</h1></BaseButton
      >
      <h1 class="text-3xl">Sign Up!</h1>
    </header>
    <form
      @submit.prevent="submit"
      class="flex flex-col gap-2 w-md border-2 border-white rounded-lg p-4"
    >
      <label for="email-address" class="block font-semibold">Email:</label>
      <input
        id="email-address"
        type="email"
        v-model="emailAddress"
        class="p-4 border border-b-gray-300 rounded-md h-10"
      />
      <p v-if="!validEmail && emailAddress" class="text-red-500">Make sure email is valid!</p>
      <br />
      <label for="password-main" class="block font-semibold">Password:</label>
      <input
        id="password-main"
        :type="passwordInput"
        v-model="password"
        class="p-4 border border-b-gray-300 rounded-md h-10"
      />
      <br />
      <label for="password-confirm" class="block font-semibold">Confirm Password:</label>
      <input
        id="password-confirm"
        :type="passwordInput"
        v-model="confirmedPassword"
        class="p-4 border border-b-gray-300 rounded-md h-10"
      />
      <br />
      <div>
        <label for="view-password" class="font-semibold">View Password: </label>
        <input
          id="view-password"
          @click="passwordVisible = !passwordVisible"
          type="checkbox"
          :value="passwordVisible"
        />
      </div>
      <p v-if="password !== confirmedPassword">Passwords don't match</p>
      <br />
      <BaseButton type="submit" :disabled="!validEmail || password !== confirmedPassword">
        Sign Up
      </BaseButton>
      <p v-if="error !== ''">{{ error }}</p>
    </form>
  </div>
</template>
