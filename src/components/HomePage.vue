<script setup>
import { useUserStore } from '@/stores/user-store'
import QuizCard from './assessment/QuizCard.vue'
import { useQuizStore } from '@/stores/quiz-store'
import { useRouter } from 'vue-router'
import HeaderWithSignOut from './universals/HeaderWithSignOut.vue'
import BaseButton from './universals/BaseButton.vue'
import ItemCard from './universals/ItemCard.vue'
import { onMounted, ref } from 'vue'

const user = useUserStore()
const router = useRouter()

const quizStore = useQuizStore()

const loading = ref(true)

onMounted(async () => {
  try {
    await quizStore.getQuizzes()
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="relative flex flex-col justify-start items-center w-full min-h-dvh">
    <HeaderWithSignOut class="fixed">
      <template #title>Hello, {{ user.name }}</template>
      <template #button>
        <BaseButton @click="router.push('/account')">Account</BaseButton>
      </template>
    </HeaderWithSignOut>
    <main
      v-if="!loading"
      class="flex flex-col w-full items-center justify-start mt-16 overflow-y-scroll"
    >
      <h2 class="text-3xl pb-4">Your Quizzes:</h2>
      <ul class="flex flex-col gap-4 w-full items-center pb-4">
        <ItemCard @click="$router.push('quiz/new')">New Quiz</ItemCard>
        <QuizCard v-for="quiz in quizStore.quizzes" :key="quiz.id" :quiz="quiz" />
      </ul>
    </main>
    <div v-else class="flex flex-col w-full items-center justify-start mt-16 overflow-y-scroll">
      Loading...
    </div>
  </div>
</template>
