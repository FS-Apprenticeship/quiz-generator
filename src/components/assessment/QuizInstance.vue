<script setup>
import { useQuizStore } from '@/stores/quiz-store'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const quizStore = useQuizStore()
const route = useRoute()

const resolved = ref(false)
const quizExists = ref(true)

quizStore.getQuiz(route.params.id).then((success) => {
  resolved.value = true
  quizExists.value = success
})
</script>
<template>
  <template v-if="resolved && quizExists">
    <header>
      <h1>{{ quizStore.quiz.value.topic }}</h1>
    </header>
    <main>
      {{ quizStore.quiz.value }}
    </main>
  </template>
  <template v-else-if="resolved">
    <h1>QUIZ DOESN'T EXIST</h1>
  </template>
  <template v-else>
    <h1>LOADING...</h1>
  </template>
</template>

<style scoped>
header {
  height: 20vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background-color: lightseagreen;
  color: white;
}
header h1 {
  margin: 0;
  font-size: 1.75rem;
}
button.rounded {
  height: 40px;
  border-radius: 8px;
  border: none;
  padding: 0 12px;
  background: rgba(255, 255, 255, 0.25);
  color: white;
  cursor: pointer;
}
button.rounded:hover {
  background: rgba(255, 255, 255, 0.4);
}
main {
  padding: 20px;
}
@media (max-width: 600px) {
  header {
    flex-direction: column;
    height: auto;
    padding: 12px 0;
  }
  header h1 {
    font-size: 1.25rem;
  }
  .rounded {
    width: auto;
    height: 36px;
  }
}
</style>
