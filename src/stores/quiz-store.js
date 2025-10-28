import {
  createResponse as storeResponse,
  fetchQuiz,
  fetchQuizzes,
  storeQuiz,
  updateResponse as updateResponseInDB,
  fetchResponse,
  fetchResponses,
} from '@/interfacers/quiz-storage'
import { useUserStore } from './user-store'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { buildQuiz, buildRetryQuiz, buildSourceInformation } from '@/interfacers/quiz-builder'
import { createAdditionResources } from '@/interfacers/feedback-generator'

export const useQuizStore = defineStore('quiz', () => {
  const user = useUserStore()
  const quizzes = ref([])
  const quiz = ref(undefined)
  const responses = ref([])
  const response = ref(undefined)

  const state = ref('')

  async function createQuiz(topic, time, level) {
    try {
      state.value = 'Building Source Information'
      const information = await buildSourceInformation(topic, time, level)
      state.value = 'Building Quiz'
      const quizQuestions = await buildQuiz(topic, time, level, information)

      quizQuestions.forEach((question, index) => {
        question.id = index
      })

      const quizData = {
        topic,
        level,
        time,
        topicInformation: information,
        questions: quizQuestions,
        userID: user.id,
      }

      state.value = 'Storing Quiz'
      const { data, error } = await storeQuiz(quizData)
      quizzes.value.unshift({
        id: data.id,
        topic: data.topic,
        created_at: data.createdAt,
      })

      if (error) throw new Error(error)

      quiz.value = data

      state.value = 'Creating Response'
      await createResponse()
    } catch (e) {
      alert(e)
      return false
    }
    return true
  }

  async function createResponse() {
    const responseData = {
      quizID: quiz.value.id,
      basedOn: null,
      answers: quiz.value.questions.map((question) => {
        return { id: question.id, answer: null, updatesToAnswer: 0, correct: null }
      }),
    }

    const { data, error } = await storeResponse(responseData)

    if (error !== undefined) {
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
    data.sort((a, b) => a.created_at < b.created_at)
    quizzes.value = data
    return true
  }

  async function getResponses() {
    if (quiz.value?.id === undefined) return false
    const { data, error } = await fetchResponses(quiz.value.id)
    if (error !== undefined) return false
    data.sort((a, b) => a.createdAt < b.createdAt)
    responses.value = data
    return true
  }

  watch(user, getQuizzes)
  watch(quiz, getResponses)

  async function getQuiz(quizID) {
    if (quiz.value?.id === quizID) return true
    const { data, error } = await fetchQuiz(user.id, quizID)

    if (error !== undefined) return false
    quiz.value = data

    return true
  }

  async function getResponse(quizID, responseID) {
    const { data: quizData, error: quizError } = await fetchQuiz(user.id, quizID)
    const { data: responseData, error: responseError } = await fetchResponse(quizID, responseID)

    if (quizError !== undefined) return false
    if (responseError !== undefined) return false
    response.value = responseData
    quiz.value = quizData

    return true
  }

  async function updateResponse(questionID, answer) {
    if (response.value.completed) return false
    const answerToChange = response.value.answers.find((answer) => answer.id === questionID)
    answerToChange.answer = answer
    answerToChange.correct =
      quiz.value.questions[answerToChange.id].correct_answer.answerText === answer
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
        (answers.reduce(
          (accumulator, answer) => (answer.correct ? accumulator + 1 : accumulator),
          0,
        ) *
          100) /
        answers.length

      const interleavedAnswersForLLM = []
      const feedback = []
      for (const answer of answers) {
        const question = quiz.value.questions[answer.id]
        const answerChoices = [question.correct_answer, ...question.fake_answers]

        interleavedAnswersForLLM.push({
          question: question.question,
          aboutQuestion: question.explanation,
          correctAnswer: question.correct_answer.answerText,
          user_answer: answer,
          fakeAnswers: question.fake_answers.map((answer) => answer.answerText),
        })

        feedback.push({
          questionID: question.id,
          feedback:
            answerChoices.find((choice) => choice.answerText === answer.answer)?.feedback ??
            'Feedback Lost',
        })
      }

      //Both of this should have previous answers fed in at a later point
      // const feedback = await makeFeedback(interleavedAnswersForLLM)

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
    if (!response.value.completed) return false
    const incorrectAnswers = response.value.answers.filter((answer) => !answer.correct)

    if (incorrectAnswers.length === 0) return false

    const responseData = {
      quizID: quiz.value.id,
      basedOn: response.value.id,
      answers: incorrectAnswers.map((answer) => {
        return { id: answer.id, answer: null, updatesToAnswer: 0, correct: null }
      }),
    }

    const { data, error } = await storeResponse(responseData)

    if (error !== undefined) {
      // alert(error)
      return false
    }

    response.value = data

    return true
  }
  async function adaptiveRetry() {
    if (!response.value.completed) return false
    const incorrectAnswers = response.value.answers.filter((answer) => !answer.correct)

    if (incorrectAnswers.length === 0) return false

    const interleavedAnswersForLLM = []
    const feedback = []
    for (const answer of incorrectAnswers) {
      const question = quiz.value.questions[answer.id]
      const answerChoices = [question.correct_answer, ...question.fake_answers]

      interleavedAnswersForLLM.push({
        question: question.question,
        aboutQuestion: question.explanation,
        correctAnswer: question.correct_answer.answerText,
        user_answer: answer,
        fakeAnswers: question.fake_answers.map((answer) => answer.answerText),
      })

      feedback.push({
        questionID: question.id,
        feedback:
          answerChoices.find((choice) => choice.answerText === answer.answer)?.feedback ??
          'Feedback Lost',
      })
    }

    try {
      state.value = 'Building Quiz'
      const quizQuestions = await buildRetryQuiz(
        interleavedAnswersForLLM,
        quiz.value.topicInformation,
      )

      quizQuestions.forEach((question, index) => {
        question.id = index
      })

      const quizData = {
        topic: quiz.value.topic,
        level: quiz.value.level,
        time: quiz.value.time,
        basedOn: quiz.value.id,
        topicInformation: quiz.value.topicInformation,
        questions: quizQuestions,
        userID: user.id,
      }

      state.value = 'Storing Quiz'
      const { data, error } = await storeQuiz(quizData)

      quizzes.value.unshift({
        id: data.id,
        topic: data.topic,
        created_at: data.createdAt,
      })

      if (error) throw new Error(error)

      quiz.value = data

      const responseInfo = {
        quizID: quiz.value.id,
        basedOn: response.value.id,
        answers: quiz.value.questions.map((question) => {
          return { id: question.id, answer: null, updatesToAnswer: 0, correct: null }
        }),
      }

      state.value = 'Generating Response'
      const { data: responseData, error: responseError } = await storeResponse(responseInfo)

      if (responseError !== undefined) {
        throw new Error(responseError)
      }

      response.value = responseData

      return true
    } catch (e) {
      alert(e)
      return false
    }
  }

  return {
    quizzes,
    quiz,
    response,
    responses,
    state,
    createQuiz,
    createResponse,
    getQuizzes,
    getQuiz,
    getResponse,
    getResponses,
    updateResponse,
    completeQuizAndGetFeedback,
    retryMissedQuestions,
    adaptiveRetry,
  }
})
