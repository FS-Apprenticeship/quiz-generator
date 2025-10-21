import FinalAssessment from '@/components/assessment/FinalAssessment.vue'
import NewQuiz from '@/components/assessment/NewQuiz.vue'
import QuizHolder from '@/components/assessment/QuizHolder.vue'
import QuizInstance from '@/components/assessment/QuizInstance.vue'
import SignIn from '@/components/auth/SignIn.vue'
import SignUp from '@/components/auth/SignUp.vue'
import HomePage from '@/components/HomePage.vue'
import UserPage from '@/components/UserPage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: HomePage },
    { path: '/sign-up', component: SignUp },
    { path: '/sign-in', component: SignIn },
    { path: '/user', component: UserPage },
    {
      path: '/quiz',
      component: QuizHolder,
      children: [
        {
          path: '',
          component: NewQuiz,
        },
        {
          path: ':id',
          component: QuizInstance,
        },
        { path: ':id/response/:responseID', component: FinalAssessment },
      ],
    },
  ],
})

export default router
