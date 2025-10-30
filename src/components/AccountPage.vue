<script setup>
import { useUserStore } from '@/stores/user-store'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import HeaderWithSignOut from './universals/HeaderWithSignOut.vue'
import BaseButton from './universals/BaseButton.vue'
import InputLabelPair from './universals/InputLabelPair.vue'

const router = useRouter()
const user = useUserStore()

const userName = ref(user.name)
const education = ref(user.standardLevel)

async function submit() {
  const success = await user.updateBoth(education.value, userName.value)
  if (!success) alert('There was an error!')
  else router.push('/home')
}
</script>

<template>
  <div class="relative flex flex-col justify-around items-center w-dvw h-dvh">
    <HeaderWithSignOut>
      <template #title>Account</template>
      <template #button>
        <BaseButton @click="router.push('/home')">Quizzes</BaseButton>
      </template>
    </HeaderWithSignOut>
    <form
      @submit.prevent="submit"
      class="flex flex-col gap-2 w-md border-2 border-white rounded-lg p-4"
    >
      <InputLabelPair v-model="userName" id="name">Name:</InputLabelPair>
      <br />
      <InputLabelPair v-model="education" id="education">Level of Education:</InputLabelPair>
      <br />
      <BaseButton type="submit">Update</BaseButton>
    </form>
  </div>
</template>
