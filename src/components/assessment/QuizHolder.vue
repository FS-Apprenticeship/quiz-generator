<script setup>
import { useUserStore } from '@/stores/user-store'
import { useQuizStore } from '@/stores/quiz-store'
import ResponseCard from './ResponseCard.vue'
import { useRoute, useRouter } from 'vue-router'
import HeaderWithSignOut from '../universals/HeaderWithSignOut.vue'
import BaseButton from '../universals/BaseButton.vue'
import { onMounted, ref } from 'vue'

const user = useUserStore()
const route = useRoute()
const router = useRouter()

const quizStore = useQuizStore()

const loading = ref(true)

onMounted(async () => {
  try {
    await quizStore.getQuiz(route.params.id)
    await quizStore.getResponses()
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="relative flex flex-col justify-start items-center w-full h-dvh">
    <HeaderWithSignOut class="fixed">
      <template #title>Hello, {{ user.name }}</template>
      <template #button>
        <BaseButton @click="router.push('/home')">Quizzes</BaseButton>
      </template>
    </HeaderWithSignOut>
    <main
      v-if="!loading"
      class="flex flex-col w-full items-center justify-start mt-16 overflow-y-scroll"
    >
      <h2 class="text-3xl pb-4">Your Responses to your quiz on {{ quizStore.quiz?.topic }}</h2>
      <ul class="flex flex-col gap-4 w-full items-center pb-4">
        <ResponseCard
          v-for="(response, index) in quizStore.responses"
          :key="response.id"
          :response="response"
          :index="index"
        />
      </ul>
    </main>
    <div v-else class="flex flex-col w-full items-center justify-start mt-16 overflow-y-scroll">
      Loading...
    </div>
  </div>
</template>
