<script setup>
import { useQuizStore } from '@/stores/quiz-store'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import SingleQuestion from './SingleQuestion.vue'

const quizStore = useQuizStore()
const route = useRoute()

const resolved = ref(false)
const quizExists = ref(true)

quizStore.getQuiz(route.params.id).then((success) => {
  resolved.value = true
  quizExists.value = success
})

const questionIndex = ref(0)
const quiz = computed(() => quizStore.quiz)
const response = computed(() => quizStore.response)

const questionResponse = computed(() =>
  response.value ? response.value.answers[questionIndex.value] : false,
)
const question = computed(() =>
  quiz.value && questionResponse.value
    ? quiz.value.questions.find((question) => question.id === questionResponse.value.id)
    : false,
)

function moveQuestion(direction) {
  const length = response.value.answers.length

  let nextIndex = questionIndex.value + direction
  nextIndex = Math.min(length - 1, nextIndex)
  nextIndex = Math.max(0, nextIndex)

  questionIndex.value = nextIndex
}
</script>

<template>
  <template v-if="resolved && quizExists">
    <header>
      <h1>{{ quiz?.topic }}</h1>
    </header>
    <main>
      <button @click="moveQuestion(-1)">Previous Question</button>
      <button @click="moveQuestion(1)">Next Question</button>
      <SingleQuestion :question="question" :response="questionResponse" />
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
