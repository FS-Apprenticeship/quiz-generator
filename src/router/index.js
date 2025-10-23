import FinalAssessment from '@/components/assessment/FinalAssessment.vue'
import NewQuiz from '@/components/assessment/NewQuiz.vue'
import QuizHolder from '@/components/assessment/QuizHolder.vue'
import QuizInstance from '@/components/assessment/QuizInstance.vue'
import SignIn from '@/components/auth/SignIn.vue'
import SignUp from '@/components/auth/SignUp.vue'
import StartPage from '@/components/StartPage.vue'
import HomePage from '@/components/HomePage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: StartPage },
    { path: '/sign-up', component: SignUp },
    { path: '/sign-in', component: SignIn },
    { path: '/home', component: HomePage },
    {
      path: '/quiz/new',
      component: NewQuiz,
    },
    {
      path: '/quiz/:id',
      component: QuizHolder,
    },
    {
      path: '/quiz/:id/quiz/:responseID',
      component: QuizInstance,
    },
    { path: '/quiz/:id/response/:responseID', component: FinalAssessment },
  ],
})

export default router
