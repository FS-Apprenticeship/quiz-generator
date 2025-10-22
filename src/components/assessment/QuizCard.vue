<script setup>
import { useRoute, useRouter } from 'vue-router'
defineProps({
  quiz: {
    type: {
      topic: String,
      id: String,
    },
    required: true,
  },
})

const route = useRoute()
const router = useRouter()
</script>

<template>
  <li
    class="quiz"
    @click="router.push(`/quiz/${quiz.id}`)"
    :class="route.params.id === quiz.id ? 'selected' : ''"
  >
    <h3>{{ quiz.topic }}</h3>
  </li>
</template>

<style scoped>
h3 {
  margin-left: auto;
  margin-right: auto;
}
</style>
