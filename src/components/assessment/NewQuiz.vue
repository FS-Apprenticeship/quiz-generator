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
  router.push(`quiz:${quizStore.quiz.id}`)
}
</script>

<template>
  <header>
    <button class="return" @click="router.back()"><h1>&lt;</h1></button>
    <h1 class="title">Create a Quiz</h1>
  </header>
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
  height: 60px;
  display: flex;
  align-items: center;
}

header h1 {
  margin: 0;
  background-color: inherit;
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
