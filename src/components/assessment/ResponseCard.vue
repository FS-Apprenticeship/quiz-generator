<script setup>
import { useRouter } from 'vue-router'
import ItemCard from '../universals/ItemCard.vue'
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
  <ItemCard @click="goToQuiz()">
    Response {{ index + 1 }}: {{ response.completed ? 'Completed' : 'Incomplete' }}
  </ItemCard>
</template>
