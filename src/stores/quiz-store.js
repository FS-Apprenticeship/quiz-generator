import {
  createResponse as storeResponse,
  fetchMostRecentResponse,
  fetchQuiz,
  fetchQuizzes,
  storeQuiz,
  updateResponse as updateResponseInDB,
} from '@/interfacers/quiz-storage'
import { useUserStore } from './user-store'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { buildQuiz, buildSourceInformation } from '@/interfacers/quiz-builder'

export const useQuizStore = defineStore('quiz', () => {
  const user = useUserStore()
  const quizzes = ref([])
  const quiz = ref(undefined)
  const response = ref(undefined)

  async function createQuiz(topic, time, level) {
    try {
      const information = await buildSourceInformation(topic, time, level)
      const quizQuestions = await buildQuiz(topic, time, level, information)

      quizQuestions.forEach((question, index) => {
        question.id = index
      })

      const quizData = {
        topic,
        level,
        topicInformation: information,
        questions: quizQuestions,
      }

      const { data, error } = await storeQuiz(quizData)

      if (error) throw new Error(error)

      quiz.value = data

      await createResponse()
    } catch (e) {
      alert(e)
      return false
    }
    return true
  }

  async function createResponse(previousResponse = null) {
    const responseData = {
      quizID: quiz.value.id,
      basedOn: previousResponse,
      answers: quiz.value.questions.map((question) => {
        return { id: question.id, answer: null, attempts: 0 }
      }),
    }

    const { data, error } = await storeResponse(responseData)

    if (error === undefined) {
      alert(error)
      return false
    }

    response.value = data

    return true
  }

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
  async function updateResponse(questionID, answer) {
    const answerToChange = response.value.answers.find((answer) => answer.id === questionID)
    answerToChange.answer = answer
    answerToChange.attempts++
    response.value.updatedAt = new Date()

    const { data, error } = updateResponseInDB(response.value)
    if (error) return false
    response.value = data
    return true
  }
  async function completeQuizAndGetFeedback() {
    //Need Feedback merge
  }
  async function retryMissedQuestions() {
    //Need Feedback merge
  }
  async function adaptiveRetry() {
    //Not yet
  }

  return {
    quizzes,
    quiz,
    response,
    createQuiz,
    createResponse,
    getQuizzes,
    getQuiz,
    getResponse,
    updateResponse,
    completeQuizAndGetFeedback,
    retryMissedQuestions,
    adaptiveRetry,
  }
})
