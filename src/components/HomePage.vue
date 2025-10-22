<script setup>
import { useUserStore } from '@/stores/user-store'
import QuizCard from './assessment/QuizCard.vue'
import { useQuizStore } from '@/stores/quiz-store'
import { useRouter } from 'vue-router'

const user = useUserStore()
const router = useRouter()

const quizStore = useQuizStore()
quizStore.getQuizzes()

async function signOut() {
  if (await user.signOut()) router.push('/')
}
</script>

<template>
  <header>
    <h1>Hello, {{ user.name }}</h1>
    <button @click="alert('Not yet added!')">Account</button>
    <button @click="signOut()">Sign Out</button>
  </header>
  <h2>Your Quizzes</h2>
  <br />
  <ul>
    <li><button @click="$router.push('quiz')">New Quiz</button></li>
    <QuizCard v-for="quiz in quizStore.quizzes" :key="quiz.id" :quiz="quiz" />
  </ul>
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

ul {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0;
  margin: 0;
  width: 100%;
  align-items: center;
  justify-content: center;
  list-style: none;
}

li {
  height: 63px;
  width: 50%;
  border: 1px solid #fff;
  border-radius: 20px;
  display: flex;
  align-items: center;
  padding: 0 8px;
}

li button {
  width: 100%;
  height: 100%;
  margin: 0;
  border: none;
  border-radius: inherit;
  padding: 0;
  font-size: x-large;
  font-family: serif;
}
</style>
