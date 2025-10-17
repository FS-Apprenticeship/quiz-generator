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
  <header>
    <button class="back" @click="router.back()">&lt;</button>
    <h1>Sign Up!</h1>
  </header>
  <form @submit.prevent="submit">
    <label for="email-address">Email:</label
    ><input id="email-address" type="email" v-model="emailAddress" />
    <p v-if="!validEmail">Make sure email is valid!</p>
    <br />
    <label for="password-main">Password:</label
    ><input id="password-main" :type="passwordInput" v-model="password" />
    <br />
    <label for="password-confirm">Confirm Password:</label
    ><input id="password-confirm" :type="passwordInput" v-model="confirmedPassword" />
    <br />
    <label for="view-password">View Password</label>
    <input
      id="view-password"
      @click="passwordVisible = !passwordVisible"
      type="checkbox"
      :value="passwordVisible"
    />
    <p v-if="password !== confirmedPassword">Passwords don't match</p>
    <br />
    <button type="submit" :disabled="!validEmail || password !== confirmedPassword">Sign Up</button>
    <p v-if="error !== ''">{{ error }}</p>
  </form>
</template>

<style scoped>
header {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  background: lightseagreen;
  color: white;
}
header .back {
  height: 40px;
  width: 40px;
  border-radius: 8px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1.2rem;
}
header h1 {
  margin: 0;
  flex: 1;
  font-size: 1.25rem;
  text-align: center;
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
p {
  color: #d32f2f;
  margin: 0;
}
</style>
