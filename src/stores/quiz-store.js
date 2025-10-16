import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useQuizStore = defineStore('quiz', () => {
  const quizzes = ref([])
  const quiz = ref(undefined)
  const response = ref(undefined)

  async function createQuiz() {}
  async function getQuizzes() {}
  async function getQuiz() {}
  async function getResponse() {}
  async function updateResponse() {}
  async function getFeedback() {}
  async function retryMissedQuestions() {}
  async function adaptiveRetry() {}

  return {
    quizzes,
    quiz,
    response,
    createQuiz,
    getQuizzes,
    getQuiz,
    getResponse,
    updateResponse,
    getFeedback,
    retryMissedQuestions,
    adaptiveRetry,
  }
})
