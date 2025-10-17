<script setup>
import { useQuizStore } from '@/stores/quiz-store'
import { useUserStore } from '@/stores/user-store'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = useUserStore()
const quizStore = useQuizStore()

const topic = ref('')
const time = ref('')
const level = ref(user.standardLevel ?? '')

const canSubmit = ref(true)

async function submit() {
  if (!topic.value || !time.value || !level.value) return //Just to be safe
  canSubmit.value = false
  let success = await quizStore.createQuiz(topic.value, time.value, level.value)
  canSubmit.value = true

  if (!success) return
  router.push(`quiz:${quizStore.quiz.value.id}`)
}
</script>

<template>
  <header>Create a Quiz!</header>
  <button @click="router.back()">&lt;</button>
  <form @submit.prevent="submit">
    <label for="topic">Topic:</label>
    <input id="topic" type="text" v-model="topic" />
    <br />
    <label for="time">Time:</label>
    <input id="time" type="text" v-model="time" />
    <br />
    <label for="level">Level:</label>
    <input id="level" type="text" v-model="level" />
    <br />
    <button type="submit" :disabled="!topic || !time || !level || !canSubmit">Create Quiz</button>
    <p v-if="!canSubmit">Submitting</p>
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
