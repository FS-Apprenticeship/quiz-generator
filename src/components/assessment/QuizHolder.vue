<script setup>
import { useUserStore } from '@/stores/user-store'
import { useQuizStore } from '@/stores/quiz-store'
import ResponseCard from './ResponseCard.vue'
import { useRoute, useRouter } from 'vue-router'

const user = useUserStore()
const route = useRoute()
const router = useRouter()

const quizStore = useQuizStore()
quizStore.getQuiz(route.params.id)
quizStore.getResponses()

async function signOut() {
  if (await user.signOut()) router.push('/')
}
</script>

<template>
  <header>
    <h1>Hello, {{ user.name }}</h1>
    <button @click="router.push('/home')">Quizzes</button>
    <button @click="signOut()">Sign Out</button>
  </header>
  <h2>Your Responses to your quiz on {{ quizStore.quiz?.topic }}</h2>
  <br />
  <ul>
    <ResponseCard
      v-for="(response, index) in quizStore.responses"
      :key="response.id"
      :response="response"
      :index="index"
    />
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
