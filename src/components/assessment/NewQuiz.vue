<script setup>
import { useQuizStore } from '@/stores/quiz-store'
import { useUserStore } from '@/stores/user-store'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '../universals/BaseButton.vue'
import BackButtonHeader from '../universals/BackButtonHeader.vue'
import InputLabelPair from '../universals/InputLabelPair.vue'

const router = useRouter()
const user = useUserStore()
const quizStore = useQuizStore()

const topic = ref('')
const time = ref('')
const level = ref(user.standardLevel ?? '')

const canSubmit = ref(true)

async function submit() {
  if (!topic.value || !time.value || !level.value) return //Just to be safe
  canSubmit.value = false
  let success = await quizStore.createQuiz(topic.value, time.value, level.value)
  canSubmit.value = true

  if (!success) return
  router.push(`quiz:${quizStore.quiz.id}`)
}
</script>

<template>
  <div class="relative flex flex-col justify-around items-center w-dvw h-dvh">
    <BackButtonHeader>Create a Quiz!</BackButtonHeader>
    <form
      @submit.prevent="submit"
      class="flex flex-col gap-2 w-md border-2 border-white rounded-lg p-4"
    >
      <InputLabelPair v-model="topic" id="topic">Topic:</InputLabelPair>
      <br />
      <InputLabelPair v-model="time" id="time">Time:</InputLabelPair>
      <br />
      <InputLabelPair v-model="level" id="level">Level:</InputLabelPair>
      <br />
      <BaseButton type="submit">
        <template v-if="canSubmit">Create Quiz</template>
        <template v-else>{{ quizStore.state }}</template>
      </BaseButton>
    </form>
  </div>
</template>
