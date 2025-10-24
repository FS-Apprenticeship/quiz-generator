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

console.log(response)

async function updateAnswer(answer) {
  console.log('This isn`t getting called for unknown reasons')
  const success = await quizStore.updateResponse(question.id, answer)
  if (!success) alert('There was an issue saving your answer')
}
</script>

<template>
  <h3>{{ question.question }}</h3>

  <template v-for="answer in answers" :key="answer.answerText">
    <input
      type="radio"
      name="answer"
      :id="answer.answerText"
      :checked="answer.answerText === response.answer"
      @click="updateAnswer(answer.answerText)"
    />
    <label :for="answer.answerText">{{ answer.answerText }}</label>
    <br />
  </template>
</template>

<style scoped>
/* General styling */
h3 {
  font-size: 1.2rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 20px;
  text-align: center; /* Center the question text */
}

/* Styling for the radio input and label */
input[type='radio'] {
  display: none; /* Hide default radio button */
}

/* Custom radio button design */
input[type='radio'] + label {
  position: relative;
  display: inline-block;
  padding-left: 30px; /* Space for the custom radio */
  margin: 10px 25%;
  font-size: 1rem;
  color: #ddd;
  cursor: pointer;
  transition: color 0.2s ease;
}

input[type='radio'] + label:before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  border: 2px solid #888;
  border-radius: 50%;
  background-color: white;
  transition:
    background-color 0.3s ease,
    border 0.3s ease;
}

/* Checked radio button style */
input[type='radio']:checked + label:before {
  background-color: orange; /* Custom selected background */
  border-color: orange; /* Matching border color */
}

input[type='radio']:checked + label {
  color: orange; /* Change label color when selected */
}

/* Hover effects */
input[type='radio'] + label:hover {
  color: orange;
}

input[type='radio']:not(:checked):hover + label:before {
  border-color: orange;
}

/* Focus state for better accessibility */
input[type='radio']:focus + label:before {
  outline: 3px solid orange; /* Visible outline on focus */
}

/* Space between the radio button options */
br {
  margin-bottom: 10px;
}
</style>
