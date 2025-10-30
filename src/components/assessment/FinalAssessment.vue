<script setup>
import { useQuizStore } from '@/stores/quiz-store'
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const quizStore = useQuizStore()
const route = useRoute()
const router = useRouter()

const resolved = ref(false)
const quizExists = ref(true)
const generatingQuiz = ref(false)

quizStore.getResponse(route.params.id, route.params.responseID).then((success) => {
  resolved.value = true
  quizExists.value = success
})

const quiz = computed(() => quizStore.quiz)
const response = computed(() => quizStore.response)

const responsesToQuestions = computed(() =>
  response.value
    ? response.value.answers
        .map((answer) => {
          const question = quiz.value.questions.find((question) => question.id === answer.id)
          const feedback =
            response.value.feedback.find((feedbackItem) => feedbackItem.questionID === answer.id)
              ?.feedback ?? 'No Feedback'

          return {
            question,
            correct: answer.correct,
            userAnswer: answer.answer,
            feedback: feedback,
          }
        })
        .sort((a, b) => a.correct - b.correct)
    : [],
)

const perfectScore = computed(() => response.value.answers.every((answer) => answer.correct))

async function retry() {
  const success = await quizStore.retryMissedQuestions()

  if (!success) {
    alert('There was an error in retrying')
  }

  router.push(`/quiz/${quiz.value.id}`)
}

async function adaptiveRetry() {
  generatingQuiz.value = true
  const success = await quizStore.adaptiveRetry()
  generatingQuiz.value = false

  if (!success) {
    alert('There was an error in retrying')
  }

  router.push(`/quiz/${quiz.value.id}`)
}
</script>

<template>
  <template v-if="resolved && quizExists">
    <div class="max-w-5xl mx-auto px-4 py-6">
      <!-- Header -->
      <header class="text-center mb-6">
        <h1 class="text-3xl font-bold text-white">
          {{ quiz?.topic }} - {{ response?.finalScore }}%
        </h1>
      </header>

      <!-- Quiz Questions & Feedback -->
      <main class="space-y-8">
        <div
          v-for="resp in responsesToQuestions"
          :key="resp.question.id"
          class="bg-sky-950 p-4 rounded-lg shadow-md text-gray-50"
        >
          <h3 class="font-semibold text-lg mb-2">{{ resp.question.question }}</h3>
          <p>
            <span v-if="!resp.correct" class="text-red-400">
              Correct Answer: {{ resp.question.correct_answer.answerText }}
            </span>
          </p>
          <p class="mt-1">
            Your Answer: <span class="font-medium">{{ resp.userAnswer }}</span>
          </p>
          <h4 class="mt-2 font-semibold text-orange-400">Feedback:</h4>
          <p class="text-gray-300">{{ resp.feedback }}</p>
        </div>

        <!-- Recommended Resources -->
        <section class="bg-sky-950 p-4 rounded-lg shadow-md text-gray-100">
          <h2 class="text-2xl font-bold text-center mb-4">Recommended Resources</h2>
          <p class="text-center mb-4">{{ response?.resources.feedback ?? 'Loading...' }}</p>
          <div class="space-y-4">
            <template v-for="id in response?.resources.sectionsToReview ?? []" :key="id">
              <div
                v-if="id < quiz.topicInformation.sections.length"
                class="bg-gray-700 p-3 rounded-md"
              >
                <h3 class="font-semibold text-orange-400">
                  {{ quiz.topicInformation.sections[id]?.title }}
                  {{ id < quiz.topicInformation.sections.length }}
                </h3>
                <p class="text-gray-300 mt-1">
                  {{ quiz.topicInformation.sections[id]?.information }}
                </p>
              </div>
            </template>
          </div>
        </section>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <button
            @click="$router.push(`/quiz/${quiz.id}`)"
            class="px-6 py-2 bg-orange-400 text-white font-semibold rounded-lg hover:bg-orange-500 cursor-pointer transition"
          >
            Go Back!
          </button>

          <button
            :disabled="perfectScore"
            @click="retry"
            class="px-6 py-2 bg-orange-400 text-white font-semibold rounded-lg hover:bg-orange-500 cursor-pointer transition disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Retry Missed Questions
          </button>

          <button
            :disabled="perfectScore || generatingQuiz"
            @click="adaptiveRetry"
            class="px-6 py-2 bg-orange-400 text-white font-semibold rounded-lg hover:bg-orange-500 cursor-pointer transition disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            <template v-if="!generatingQuiz">Adaptive Retry</template>
            <template v-else>{{ quizStore.state }}</template>
          </button>
        </div>
      </main>
    </div>
  </template>

  <template v-else-if="resolved">
    <h1 class="text-center text-2xl font-bold text-red-500 mt-20">QUIZ DOESN'T EXIST</h1>
  </template>

  <template v-else>
    <h1 class="text-center text-2xl font-bold mt-20">LOADING...</h1>
  </template>
</template>
