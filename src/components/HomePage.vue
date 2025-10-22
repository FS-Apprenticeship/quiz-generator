<script setup>
import { useUserStore } from '@/stores/user-store'
import QuizCard from './assessment/QuizCard.vue'
import { useQuizStore } from '@/stores/quiz-store'

const user = useUserStore()

const quizStore = useQuizStore()
quizStore.getQuizzes()
</script>

<template>
  <h1>Hello, {{ user.email }}</h1>
  <button @click="user.signOut()">Sign Out</button>
  <h2>Your Quizzes</h2>
  <ul>
    <button @click="$router.push('quiz')">New Quiz</button>
    <QuizCard v-for="quiz in quizStore.quizzes" :key="quiz.id" :quiz="quiz" />
  </ul>
</template>

<style scoped>
ul {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0;
  margin: 0;
  list-style: none;
}
.list {
  height: 63px;
  width: 50%;
  border: 1px solid #000;
  border-radius: 20px;
  display: flex;
  align-items: center;
  padding: 0 8px;
}
.selected {
  background: #e5e7eb;
}
.edit {
  font-size: larger;
  width: 10%;
  border: none;
  border-left: 1px solid #000;
}
.delete {
  margin-left: auto;
  width: 15%;
  display: flex;
  justify-content: center;
}
#trash-button,
#delete-button,
#restore-button {
  border: none;
}
#trash-button {
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
}
</style>
