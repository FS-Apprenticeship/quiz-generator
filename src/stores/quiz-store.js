import { fetchMostRecentResponse, fetchQuiz, fetchQuizzes } from '@/interfacers/quiz-storage'
import { useUserStore } from './user-store'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useQuizStore = defineStore('quiz', () => {
  const user = useUserStore()
  const quizzes = ref([])
  const quiz = ref(undefined)
  const response = ref(undefined)

  async function createQuiz() {}
  async function getQuizzes() {
    const { data, error } = fetchQuizzes(user.id.value)
    if (error !== undefined) return false
    quizzes.value = data
    return true
  }
  async function getQuiz(quizID) {
    const { data, error } = fetchQuiz(user.id.value, quizID)

    if (error !== undefined) return false
    quiz.value = data
    return true
  }
  async function getResponse() {
    const { data, error } = fetchMostRecentResponse(quiz.value.id)
    if (error !== undefined) return false

    response.value = data
    return true
  }
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
