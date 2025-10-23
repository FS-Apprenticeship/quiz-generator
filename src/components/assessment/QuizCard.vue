<script setup>
import { useRouter } from 'vue-router'
defineProps({
  quiz: {
    type: {
      topic: String,
      id: String,
    },
    required: true,
  },
})

const router = useRouter()
</script>

<template>
  <li class="quiz" @click="router.push(`/quiz/${quiz.id}/`)">
    <h3>{{ quiz.topic }}</h3>
  </li>
</template>

<style scoped>
h3 {
  margin-left: auto;
  margin-right: auto;
}
</style>
