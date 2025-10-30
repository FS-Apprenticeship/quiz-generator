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
const passwordVisible = ref(false)

const passwordInput = computed(() => (passwordVisible.value ? 'text' : 'password'))

const error = ref('')

async function submit() {
  if (!validEmail.value) return //Just to be safe
  let success = await user.signIn(emailAddress.value, password.value)

  if (!success) error.value = 'Password or email was incorrect!'
  else router.push('home')
}

if (user.user !== undefined) {
  router.push('home')
}
</script>

<template>
  <div class="relative flex flex-col justify-around items-center w-dvw h-dvh">
    <BackButtonHeader>Sign In!</BackButtonHeader>
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

      <div>
        <label for="view-password" class="font-semibold">View Password: </label>
        <input
          id="view-password"
          @click="passwordVisible = !passwordVisible"
          type="checkbox"
          :value="passwordVisible"
        />
      </div>
      <br />

      <BaseButton type="submit" :disabled="!validEmail">Sign In</BaseButton>
    </form>
  </div>
</template>

<style scoped></style>
