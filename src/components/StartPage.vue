<script setup>
import { useRouter } from 'vue-router'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import BaseButton from './universals/BaseButton.vue'

const router = useRouter()

const randomizedTopicList = ref(
  (() => {
    const listOfTopics = ['Programming', 'Quiz Making', 'Math', 'Anything']
    const last = listOfTopics.pop()
    listOfTopics.sort(() => Math.random() - 0.5)
    return [...listOfTopics, last]
  })(),
)
const topicIndex = ref(0)
const topic = computed(() => randomizedTopicList.value[topicIndex.value])
const countOfLoops = ref(8)
let iter = undefined

function randomizeTopic() {
  if (topicIndex.value + 1 === randomizedTopicList.value.length) {
    countOfLoops.value--
    if (countOfLoops.value === 0) {
      clearInterval(iter)
      return
    }
    topicIndex.value = 0
  } else topicIndex.value++
}

function generateTopics() {
  const listOfTopics = ['Programming', 'Quiz Making', 'Math', 'Anything']
  const last = listOfTopics.pop()
  listOfTopics.sort(() => Math.random() - 0.5)
  randomizedTopicList.value = [...listOfTopics, last]
}

onMounted(() => {
  generateTopics()
  iter = setInterval(randomizeTopic, 1000)
})

onBeforeUnmount(() => {
  clearInterval(iter)
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header>
      <BaseButton @click="router.push('/sign-in')">Sign In</BaseButton>
    </header>
    <main class="flex-1 flex px-4 flex-col justify-center">
      <h1 class="text-3xl">Welcome to the Quiz Generator</h1>
      <h1 class="text-3xl">
        Take a quiz on
        <span class="text-orange-400">{{ topic }}</span>
      </h1>
      <BaseButton @click="router.push('/sign-up')">Sign Up</BaseButton>
    </main>
  </div>
</template>

<style scoped>
header {
  height: 10%;
  padding: 10px 10px 0 0;
  width: 100%;
  display: flex;
  justify-content: right;
}

main {
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

h1 {
  margin-bottom: 15px;
}
</style>
