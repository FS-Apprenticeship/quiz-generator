<script setup>
import { useRouter } from 'vue-router'
const { response } = defineProps({
  response: {
    type: {
      id: String,
      quizID: String,
      completed: Boolean,
    },
    required: true,
  },
  index: { type: Number, required: true },
})

const router = useRouter()

function goToQuiz() {
  if (response.completed) {
    router.push(`/quiz/${response.quizID}/response/${response.id}`)
  } else {
    router.push(`/quiz/${response.quizID}/quiz/${response.id}`)
  }
}
</script>

<template>
  <li class="response" @click="goToQuiz()">
    <h3>Response {{ index + 1 }}</h3>
    {{ response.completed ? 'Completed' : 'Incomplete' }}
  </li>
</template>

<style scoped>
h3 {
  margin-left: auto;
  margin-right: auto;
}
</style>
