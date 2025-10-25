<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()

const listOfThings = ['Programming', 'Quiz Making', 'Math', 'Anything']

const randomTopic = ref(listOfThings[Math.floor(Math.random() * listOfThings.length)])
const countOfChanges = ref(8)

function randomizeTopic() {
  if (countOfChanges.value === 0) {
    randomTopic.value = listOfThings[listOfThings.length - 1]
    clearInterval(iter)
    return
  }

  const current = randomTopic.value
  const listToPickFrom = listOfThings.filter((item) => item !== current)
  randomTopic.value = listToPickFrom[Math.floor(Math.random() * listToPickFrom.length)]
  countOfChanges.value--
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
      <span style="color: orange">{{ randomTopic }}</span>
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
