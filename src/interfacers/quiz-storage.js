import { supabase } from '@/lib/database'

const localStorage = window.localStorage

function convertQuizDataToObject(dataQuizData) {
  return {
    id: dataQuizData.id,
    userID: dataQuizData.user_id,
    createdAt: dataQuizData.created_at,
    topic: dataQuizData.topic,
    level: dataQuizData.level,
    topicInformation: dataQuizData.topic_information,
    questions: dataQuizData.questions,
  }
}

function convertQuizDataForDatabase(preData) {
  return {
    created_at: preData.createdAt,
    topic: preData.topic,
    level: preData.level,
    topic_information: preData.topicInformation,
    questions: preData.questions,
  }
}

export async function fetchQuiz(userID, quizID) {
  const local = JSON.parse(localStorage.getItem('quiz') ?? '')

  if (local.userID === userID && local.id === quizID) return { data: local, error: undefined }
  else {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('user_id', userID)
      .eq('id', quizID)

    if (error !== null) return { data: undefined, error: 'There was an error' }

    return { data: convertQuizDataToObject(data[0]), error: undefined }
  }
}

export async function fetchQuizzes(userID) {
  const { data, error } = await supabase
    .from('quizzes')
    .select('id, topic, created_at')
    .eq('user_id', userID)

  if (error !== null) return { data: undefined, error: 'There was an error' }

  return { data: data, error: undefined }
}

export async function storeQuiz(preQuizData) {
  const { data, error } = supabase
    .from('quizzes')
    .insert(convertQuizDataForDatabase(preQuizData))
    .select()

  if (error !== null) return { data: false, error: 'There was an error' }
  localStorage.setItem('quiz', JSON.stringify(data))
  return { data: true, error: undefined }
}

function convertResponseDataToObject(responseFromDB) {
  return {
    id: responseFromDB.id,
    quizID: responseFromDB.quiz_id,
    basedOn: responseFromDB.based_on,
    createdAt: responseFromDB.created_at,
    updatedAt: responseFromDB.updated_at,
    completed: responseFromDB.completed,
    finalScore: responseFromDB.final_score,
    answers: responseFromDB.answers,
    feedback: responseFromDB.feedback,
    resources: responseFromDB.resources,
  }
}

function prepareInitialResponseData(initialResponse) {
  return {
    quiz_id: initialResponse.quizID,
    based_on: initialResponse.basedOn,
    completed: false,
    final_score: null,
    answers: null,
    feedback: null,
    resources: null,
  }
}

function convertResponseForDatabase(responseData) {
  return {
    id: responseData.id,
    quiz_id: responseData.quizID,
    based_on: responseData.basedOn,
    created_at: responseData.createdAt,
    updated_at: responseData.updatedAt,
    completed: responseData.completed,
    final_score: responseData.finalScore,
    answers: responseData.answers,
    feedback: responseData.feedback,
    resources: responseData.resources,
  }
}

export async function fetchResponse(quizID, responseID) {
  const local = JSON.parse(localStorage.getItem('response') ?? '')

  if (local.quizID === quizID && local.id === responseID) return { data: local, error: undefined }
  else {
    const { data, error } = await supabase
      .from('responses')
      .select('*')
      .eq('quiz_id', quizID)
      .eq('id', responseID)

    if (error !== null) return { data: undefined, error: 'There was an error' }

    if (data[0].updated_at > local.updatedAt) {
      return convertResponseDataToObject(data[0])
    } else {
      return local
    }
  }
}

export async function fetchResponseAndPredecessors() {
  //This one is going to be the toughest one
  //Will skip for now
}

export async function createResponse(responseData) {
  const { data, error } = supabase
    .from('responses')
    .insert(prepareInitialResponseData(responseData))
    .select()

  if (error !== null) return { data: false, error: 'There was an error' }
  localStorage.setItem('response', JSON.stringify(data))
  return { data: true, error: undefined }
}

export async function updateResponse(responseData) {
  const { data, error } = supabase
    .from('responses')
    .update(convertResponseForDatabase(responseData))
    .eq('id', responseData.id)
    .select()

  if (error !== null) return { data: false, error: 'There was an error' }
  localStorage.setItem('response', JSON.stringify(data))
  return { data: true, error: undefined }
}
