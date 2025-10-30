<script setup>
import { useQuizStore } from '@/stores/quiz-store'
import { computed } from 'vue'
const { question, response } = defineProps(['question', 'response'])

const quizStore = useQuizStore()

const answers = computed(() => {
  if (!question) return []
  const answers = [question.correct_answer, ...question.fake_answers]

  for (let i = 0; i < answers.length; i++) {
    let swapTarget = Math.floor(Math.random() * answers.length)
    let temp = answers[i]
    answers[i] = answers[swapTarget]
    answers[swapTarget] = temp
  }

  return answers
})

async function updateAnswer(answer) {
  const success = await quizStore.updateResponse(question.id, answer)
  if (!success) alert('There was an issue saving your answer')
}
</script>

<template>
  <h3 class="text-xl font-bold text-center text-white mb-6">{{ question.question }}</h3>

  <div class="flex flex-col items-center gap-4">
    <template v-for="answer in answers" :key="answer.answerText">
      <label
        class="relative flex items-center cursor-pointer px-4 py-2 w-3/4 border rounded-lg text-gray-200 hover:text-orange-500 peer-checked:text-orange-500 transition-colors"
      >
        <input
          type="radio"
          name="answer"
          :value="answer.answerText"
          :checked="answer.answerText === response.answer"
          @click="updateAnswer(answer.answerText)"
          class="peer absolute opacity-0 w-0 h-0"
        />
        <!-- Custom circle -->
        <span
          class="shrink-0 w-5 h-5 mr-4 border-2 border-gray-400 rounded-full bg-white peer-hover:border-orange-500 peer-checked:bg-orange-500 peer-checked:border-orange-500 transition-colors"
        ></span>
        <span class="flex-1">{{ answer.answerText }}</span>
      </label>
    </template>
  </div>
</template>
