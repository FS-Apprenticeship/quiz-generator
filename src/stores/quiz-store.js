import {
  createResponse as storeResponse,
  fetchMostRecentResponse,
  fetchQuiz,
  fetchQuizzes,
  storeQuiz,
  updateResponse as updateResponseInDB,
  fetchResponse,
} from '@/interfacers/quiz-storage'
import { useUserStore } from './user-store'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { buildQuiz, buildSourceInformation } from '@/interfacers/quiz-builder'
import { createAdditionResources, makeFeedback } from '@/interfacers/feedback-generator'

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
        userID: user.id,
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
        return { id: question.id, answer: null, updatesToAnswer: 0, correct: null }
      }),
    }

    const { data, error } = await storeResponse(responseData)

    if (error === undefined) {
      // alert(error)
      return false
    }

    response.value = data

    return true
  }

  async function getQuizzes() {
    if (user.id === undefined) return false
    const { data, error } = await fetchQuizzes(user.id)
    if (error !== undefined) return false
    quizzes.value = data
    return true
  }

  watch(user, getQuizzes)

  async function getQuiz(quizID) {
    if (quiz.value?.id === quizID) return true
    const { data, error } = await fetchQuiz(user.id, quizID)

    if (error !== undefined) return false
    quiz.value = data

    let hasResponse = await getResponse()
    while (!hasResponse) {
      hasResponse = await createResponse()
    }

    return true
  }

  async function getSpecificResponse(quizID, responseID) {
    const { data: quizData, error: quizError } = await fetchQuiz(user.id, quizID)
    const { data: responseData, error: responseError } = await fetchResponse(quizID, responseID)

    if (quizError !== undefined) return false
    if (responseError !== undefined) return false
    response.value = responseData
    quiz.value = quizData

    return true
  }

  async function getResponse() {
    const { data, error } = await fetchMostRecentResponse(quiz.value.id)
    if (error !== undefined) return false
    if (data === undefined) return false

    response.value = data
    return true
  }
  async function updateResponse(questionID, answer) {
    if (response.value.completed) return false
    const answerToChange = response.value.answers.find((answer) => answer.id === questionID)
    answerToChange.answer = answer
    answerToChange.correct = quiz.value.questions[answerToChange.id].correct_answer === answer
    answerToChange.updatesToAnswer++
    response.value.updatedAt = new Date()

    const { data, error } = await updateResponseInDB(response.value)
    if (error) return false
    response.value = data
    return true
  }
  async function completeQuizAndGetFeedback() {
    try {
      const responseValue = response.value
      const answers = responseValue.answers

      const confirmAnswered = answers.every((answer) => answer.answer !== null)
      if (!confirmAnswered) throw new Error("Hasn't answered all questions")

      const score =
        answers.reduce(
          (accumulator, answer) => (answer.correct ? accumulator + 1 : accumulator),
          0,
        ) / answers.length

      const interleavedAnswersForLLM = []
      for (const answer of answers) {
        const question = quiz.value.questions[answer.id]
        interleavedAnswersForLLM.push({
          question: question.question,
          aboutQuestion: question.explanation,
          correctAnswer: question.correct_answer,
          user_answer: answer,
          fakeAnswers: question.fake_answers,
        })
      }

      //Both of this should have previous answers fed in at a later point
      const feedback = await makeFeedback(interleavedAnswersForLLM)
      const additionalResources = await createAdditionResources(
        quiz.value.topicInformation,
        interleavedAnswersForLLM,
        feedback,
      )

      responseValue.updatedAt = new Date()
      responseValue.completed = true
      responseValue.finalScore = score
      responseValue.feedback = feedback
      responseValue.resources = additionalResources

      const { data, error } = await updateResponseInDB(responseValue)
      if (error) throw new Error('DB Error')
      response.value = data
      return true
    } catch (e) {
      alert(e)
      return false
    }
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
    getSpecificResponse,
    getResponse,
    updateResponse,
    completeQuizAndGetFeedback,
    retryMissedQuestions,
    adaptiveRetry,
  }
})
