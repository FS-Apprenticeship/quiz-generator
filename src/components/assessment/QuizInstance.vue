<script setup>
import { useQuizStore } from '@/stores/quiz-store'
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SingleQuestion from './SingleQuestion.vue'

const quizStore = useQuizStore()
const route = useRoute()
const router = useRouter()

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

async function submit() {
  const success = await quizStore.completeQuizAndGetFeedback()

  if (success) {
    router.push(`/quiz/${quiz.value.id}/response/${response.value.id}`)
  }
}
</script>

<template>
  <template v-if="resolved && quizExists">
    <header>
      <h1>{{ quiz?.topic }}</h1>
    </header>
    <main>
      <div class="control">
        <button class="navigation rounded" @click="moveQuestion(-1)">&lt;</button>
        {{ questionIndex + 1 }} / {{ response.answers.length }}
        <button class="navigation rounded" @click="moveQuestion(1)">&gt;</button>
        <button class="submit rounded" @click="submit">Submit Quiz</button>
      </div>
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
  height: 10%;
  padding: 10px 10px 0 0;
  width: 100%;
  display: flex;
  justify-content: center;
}

button.rounded {
  height: 40px;
  border-radius: 8px;
  border: none;
  padding: 0 12px;
  color: white;
  background-color: orange;
  cursor: pointer;
}

button.rounded:hover {
  background: darkorange;
}

main {
  height: 90%;
  width: 100%;
}

h1 {
  margin-bottom: 15px;
}

.control {
  height: 5%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navigation {
  border: none;
  background-color: orange;
  height: 100%;
  width: 50px;
  margin: 0 10px;
}

.submit {
  border: none;
  background-color: orange;
  height: 100%;
  width: auto;
  padding: 0 12px;
  margin-left: auto;
  margin-right: 10px;
}
</style>
