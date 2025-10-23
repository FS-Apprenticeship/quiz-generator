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
        <p>Correct Answer: {{ response.question.correct_answer }}</p>
        <p>Your Answer: {{ response.userAnswer }}</p>
        <h4>Feedback:</h4>
        <p>{{ response.feedback }}</p>
      </div>
      <div>
        <h2>Recommended Resources:</h2>
        {{ response?.resources.feedback ?? 'Loading' }}
      </div>
      <div class="buttons">
        <button @click="$router.push(`/quiz/${quiz.id}`)">Go Back!</button>
        <button :disabled="perfectScore" @click="retry">Retry Missed Questions</button>
      </div>
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
/* Header */
header {
  margin-top: 20px;
  margin-left: 10px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
}

h1 {
  width: 100%;
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #eee;
}

h2 {
  margin: 20px auto 20px 0;
  font-size: 1.25rem;
  width: fit-content;
  color: #ddd;
}

/* Buttons */
header button {
  height: 40px;
  width: 48%;
  border-radius: 8px;
  border: none;
  background-color: orange;
  color: white;
  font-weight: 600;
}

header button:hover {
  background-color: darkorange;
  cursor: pointer;
}

/* Quiz Questions and Feedback Section */
main {
  margin: 20px 10px;
  display: flex;
  flex-direction: column;
}

h3 {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 8px;
  color: #ccc;
}

h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #ccc;
}

div {
  margin-bottom: 20px;
}

p {
  text-indent: 0.5in;
  font-size: 1rem;
  color: #fff;
  margin-top: 5px;
}

/* Resources Section */
h2 {
  text-align: center;
  font-size: 1.2rem;
  margin-top: 30px;
}

.resources {
  font-size: 1rem;
  color: #444;
  text-align: center;
  margin-top: 10px;
}

/* Retry Button */
.buttons {
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}

button {
  background-color: orange;
  color: white;
  border: none;
  padding: 15px 30px;
  margin-left: 0%;
  margin-right: 20%;
}

button:disabled {
  background-color: darkorange;
  color: #444;
  cursor: not-allowed;
}

/* Quiz Results List */
ul {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 0;
  margin: 20px 0;
  width: 100%;
  justify-content: center;
  list-style: none;
}

li {
  height: 100px;
  width: 45%;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #f9f9f9;
  transition: background-color 0.3s ease;
}

li:hover {
  background-color: #f1f1f1;
}

li button {
  width: 100%;
  height: 40px;
  border-radius: 8px;
  border: none;
  background-color: orange;
  color: white;
  font-size: 1rem;
  font-weight: 600;
}

li button:hover {
  background-color: darkorange;
}
</style>
