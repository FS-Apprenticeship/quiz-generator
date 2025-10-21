import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useUserStore } from './stores/user-store'

const app = createApp(App)

app.use(createPinia())
app.use(router)

const userStore = useUserStore()
const result = await userStore.loadUser()
if (!result) router.push('/')

app.mount('#app')
