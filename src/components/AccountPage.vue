<script setup>
import { useUserStore } from '@/stores/user-store'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = useUserStore()

const userName = ref(user.name)
const education = ref(user.standardLevel)

async function submit() {
  const success = await user.updateBoth(education.value, userName.value)
  if (!success) alert('There was an error!')
  else router.push('/home')
}

async function signOut() {
  if (await user.signOut()) router.push('/')
}
</script>

<template>
  <header>
    <h1>Account</h1>
    <button @click="router.push('/home')">Quizzes</button>
    <button @click="signOut()">Sign Out</button>
  </header>
  <form @submit.prevent="submit">
    <label for="name">Name:</label>
    <input id="name" type="text" v-model="userName" />
    <br />
    <label for="education">Level of Education:</label>
    <input id="education" type="text" v-model="education" />
    <br />
    <button type="submit">Update</button>
  </form>
</template>

<style scoped>
header {
  margin-top: 10px;
  margin-left: 10px;
  display: flex;
  flex-wrap: nowrap;
}

h1 {
  width: 80%;
}

h2 {
  margin: 0 auto;
  width: fit-content;
}

header button {
  height: 40px;
  border-radius: 8px;
  border: none;
  width: 9%;
  margin-right: 1%;
  border: none;
  background-color: orange;
}

header button:hover {
  background-color: darkorange;
}

.title {
  margin-left: auto;
  margin-right: auto;
}

form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 420px;
  margin: calc(25% - 100px) auto 0 auto;
  padding: 16px;
  border-radius: 8px;
  border: white 1px solid;
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
  background-color: orange;
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

.return {
  width: 60px;
  height: 60px;
  border: none;
  background-color: orange;
}
</style>
