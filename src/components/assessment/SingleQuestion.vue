<script setup>
import { useQuizStore } from '@/stores/quiz-store'
import { computed } from 'vue'
const { question, response } = defineProps(['question', 'response'])

const quizStore = useQuizStore()

const answers = computed(() =>
  question ? [question.correct_answer, ...question.fake_answers] : [],
)

for (let i = 0; i < answers.value.length; i++) {
  let swapTarget = Math.floor(Math.random() * answers.value.length)
  let temp = answers.value[i]
  answers.value[i] = answers.value[swapTarget]
  answers.value[swapTarget] = temp
}

async function updateAnswer(answer) {
  const success = await quizStore.updateResponse(question.id, answer)
  if (!success) alert('There was an issue saving your answer')
}
</script>

<template>
  <h3>{{ question.question }}</h3>

  <template v-for="answer in answers" :key="answer">
    <input
      type="radio"
      name="answer"
      :id="answer"
      :checked="answer === response.answer"
      @click="() => updateAnswer(answer)"
    />
    <label :for="answer">{{ answer }}</label>
    <br />
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
