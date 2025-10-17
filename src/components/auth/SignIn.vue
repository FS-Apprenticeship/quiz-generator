<script setup>
import { useUserStore } from '@/stores/user-store'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

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
  else router.push('user')
}

if (user.user !== undefined) {
  router.push('user')
}
</script>

<template>
  <header>Sign In!</header>
  <button @click="router.back()">&lt;</button>
  <form @submit.prevent="submit">
    <label for="email-address">Email:</label
    ><input id="email-address" type="email" v-model="emailAddress" />
    <p v-if="!validEmail">Make sure email is valid!</p>
    <br />
    <label for="password-main">Password:</label
    ><input id="password-main" :type="passwordInput" v-model="password" />
    <br />
    <label for="view-password">View Password</label>
    <input
      id="view-password"
      @click="passwordVisible = !passwordVisible"
      type="checkbox"
      :value="passwordVisible"
    />
    <br />
    <button type="submit" :disabled="!validEmail">Sign In</button>
  </form>
</template>

<style scoped>
header {
  background: lightseagreen;
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  color: white;
}
header h1 {
  margin: 0;
}
form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 420px;
  margin: 20px auto;
  padding: 16px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
label {
  font-weight: bold;
}
input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
}
button[type='submit'] {
  align-self: flex-start;
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  background: #2e7d32;
  color: white;
  cursor: pointer;
}
button[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}
p {
  color: #d32f2f;
  margin: 0;
}
</style>
