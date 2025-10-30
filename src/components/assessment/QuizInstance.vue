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

quizStore.getResponse(route.params.id, route.params.responseID).then((success) => {
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
  <div class="flex flex-col min-h-screen">
    <template v-if="!resolved">
      <div class="flex justify-center items-center h-screen">
        <h1 class="text-2xl font-semibold">Loading...</h1>
      </div>
    </template>

    <template v-else-if="resolved && !quizExists">
      <div class="flex justify-center items-center h-screen">
        <h1 class="text-2xl font-semibold text-red-600">Quiz Not Found</h1>
      </div>
    </template>

    <template v-else>
      <header class="flex justify-center py-4 bg-sky-800 text-white">
        <h1 class="text-3xl font-bold">{{ quiz?.topic }}</h1>
      </header>

      <main class="flex flex-col flex-1 p-4">
        <div class="flex items-center justify-between mb-4">
          <button
            class="px-4 py-2 rounded bg-sky-400 text-white hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allow"
            @click="moveQuestion(-1)"
            :disabled="questionIndex === 0"
          >
            &lt;
          </button>

          <span class="text-lg font-medium px-3">
            {{ questionIndex + 1 }} / {{ response.answers.length }}
          </span>

          <button
            class="px-4 py-2 rounded bg-orange-400 text-white hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="moveQuestion(1)"
            :disabled="questionIndex === response.answers.length - 1"
          >
            &gt;
          </button>

          <button
            class="ml-auto px-4 py-2 rounded bg-sky-500 text-white hover:bg-green-600"
            @click="submit"
          >
            Submit Quiz
          </button>
        </div>

        <SingleQuestion :question="question" :response="questionResponse" />
      </main>
    </template>
  </div>
</template>
