<script setup>
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'

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

const iter = setInterval(randomizeTopic, 1000)
</script>

<template>
  <header>
    <button class="rounded" @click="router.push('/sign-in')">Sign In</button>
  </header>
  <main>
    <h1>Welcome to the Quiz Generator</h1>
    <h1>
      Take a quiz on
      <span style="color: orange">{{ topic }}</span>
    </h1>
    <button class="rounded" @click="router.push('/sign-up')">Sign Up</button>
  </main>
</template>

<style scoped>
header {
  height: 10%;
  padding: 10px 10px 0 0;
  width: 100%;
  display: flex;
  justify-content: right;
}

button.rounded {
  height: 40px;
  border-radius: 8px;
  border: none;
  padding: 0 12px;
  color: white;
  background-color: orange;
  cursor: pointer;
}

button.rounded:hover {
  background: darkorange;
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
