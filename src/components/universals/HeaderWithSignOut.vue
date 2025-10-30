<script setup>
import { useUserStore } from '@/stores/user-store'
import { useRouter } from 'vue-router'
import BaseButton from './BaseButton.vue'

const router = useRouter()
const user = useUserStore()

async function signOut() {
  if (await user.signOut()) router.push('/')
}
</script>

<template>
  <header
    class="bg-sky-800 absolute top-0 left-0 right-0 flex items-center justify-between py-2.5 px-2 w-dvw"
  >
    <h1 class="text-3xl"><slot name="title" /></h1>
    <nav class="flex items-center gap-3">
      <slot name="button" />
      <BaseButton @click="signOut()">Sign Out</BaseButton>
    </nav>
  </header>
</template>
