<script setup>
import { useUserStore } from '@/stores/user-store'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '../universals/BaseButton.vue'
import BackButtonHeader from '../universals/BackButtonHeader.vue'
import InputLabelPair from '../universals/InputLabelPair.vue'

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
    <BackButtonHeader>Sign Up!</BackButtonHeader>
    <form
      @submit.prevent="submit"
      class="flex flex-col gap-2 w-md border-2 border-white rounded-lg p-4"
    >
      <InputLabelPair
        v-model="emailAddress"
        type="email"
        id="email-address"
        class="invalid:border-red-500"
      >
        Email:
      </InputLabelPair>
      <p v-if="!validEmail && emailAddress" class="text-red-500">Make sure email is valid!</p>
      <br />
      <InputLabelPair v-model="password" id="password-main" :type="passwordInput">
        Password:
      </InputLabelPair>
      <br />
      <InputLabelPair v-model="confirmedPassword" id="password-confirm" :type="passwordInput">
        Confirm Password:
      </InputLabelPair>
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
