<script setup>
import { useRouter } from 'vue-router'
import ItemCard from '../universals/ItemCard.vue'
defineProps({
  quiz: {
    type: {
      topic: String,
      id: String,
    },
    required: true,
  },
})

const router = useRouter()
</script>

<template>
  <ItemCard @click="router.push(`/quiz/${quiz.id}`)">{{ quiz.topic }}</ItemCard>
</template>
