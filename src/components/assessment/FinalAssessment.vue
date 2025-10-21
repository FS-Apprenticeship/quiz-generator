<script setup>
import { useQuizStore } from '@/stores/quiz-store'
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const quizStore = useQuizStore()
const route = useRoute()
const router = useRouter()

const resolved = ref(false)
const quizExists = ref(true)

quizStore.getSpecificResponse(route.params.id, route.params.responseID).then((success) => {
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
</script>

<template>
  <template v-if="resolved && quizExists">
    <header>
      <h1>{{ quiz?.topic }}</h1>
    </header>
    <main>
      <div v-for="response in responsesToQuestions" :key="response.question.id">
        <h3>{{ response.question.question }}</h3>
        Correct Answer: {{ response.question.correct_answer }} Your Answer:
        {{ response.userAnswer }}

        <h4>Feedback:</h4>
        {{ response.feedback }}
      </div>
      <div>
        <h2>Recommended Resources:</h2>
        {{ response?.resources ?? 'Loading' }}
      </div>
      <button :disabled="perfectScore" @click="retry">Retry Missed Questions</button>
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
