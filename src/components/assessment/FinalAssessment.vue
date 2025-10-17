<!-- Place holder so that the system will launch -->

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <header>
    <h1>Welcome to the Quiz Generator</h1>
    <button class="rounded" @click="router.push('/sign-up')">Sign Up</button>
    <button class="rounded" @click="router.push('/sign-in')">Sign In</button>
  </header>
  <main>
    <p>You can generate a quiz on a topic and then take it!</p>
  </main>
</template>

<style scoped>
header {
  height: 20vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background-color: lightseagreen;
  color: white;
}
header h1 {
  margin: 0;
  font-size: 1.75rem;
}
button.rounded {
  height: 40px;
  border-radius: 8px;
  border: none;
  padding: 0 12px;
  background: rgba(255, 255, 255, 0.25);
  color: white;
  cursor: pointer;
}
button.rounded:hover {
  background: rgba(255, 255, 255, 0.4);
}
main {
  padding: 20px;
}
@media (max-width: 600px) {
  header {
    flex-direction: column;
    height: auto;
    padding: 12px 0;
  }
  header h1 {
    font-size: 1.25rem;
  }
  .rounded {
    width: auto;
    height: 36px;
  }
}
</style>
