<script setup>
import { useRoute, useRouter } from 'vue-router'
defineProps({
  quiz: {
    type: {
      topic: String,
      id: String,
    },
    required: true,
  },
})

const route = useRoute()
const router = useRouter()
</script>

<template>
  <li
    class="quiz"
    @click="router.push(`/quiz/${quiz.id}`)"
    :class="route.params.id === quiz.id ? 'selected' : ''"
  >
    <h3>{{ quiz.topic }}</h3>
    <!-- <div class="delete">
      <button
        v-if="!list.trashed"
        id="trash-button"
        class="red"
        @click="lists.deleteThisList(list.id)"
      >
        🗑︎
      </button>
       <div v-else>
                <button id="delete-button" class="red" @click="lists.deleteThisList(list.id)">Delete!</button>
                <button id="restore-button" class="green" @click="lists.restoreList(list.id)">↩︎ Restore</button>
            </div>
    </div> -->
  </li>
</template>

<style scoped>
li.quiz {
  height: 63px;
  width: 50%;
  border: 1px solid #000;
  border-radius: 20px;
  display: flex;
  align-items: center;
  padding: 0 8px;
}
h3 {
  width: 70%;
  padding-left: 5%;
}
.selected {
  background: #dbeafe;
}
.edit {
  font-size: larger;
  width: 10%;
  border: none;
  border-left: 1px solid #000;
}
.delete {
  margin-left: auto;
  width: 15%;
  display: flex;
  justify-content: center;
}
#trash-button {
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  border: 0;
}
#delete-button {
  border-top-right-radius: 20px;
  border: 0;
}
#restore-button {
  border-bottom-right-radius: 20px;
  border: 0;
}
.green {
  background-color: green;
  color: white;
}
.green:hover {
  background-color: #159515;
}
.red {
  background-color: #d00000;
  color: white;
}
.red:hover {
  background-color: #f50000;
}
</style>
