<script setup lang="ts">
import BaseButton from './BaseButton.vue'
</script>

<template>
  <header class="absolute top-0 left-0 right-0 flex items-center justify-around pt-2.5 w-dvw">
    <BaseButton class="absolute left-0 ml-2 px-4" @click="$router.back()">
      <h1>&lt;</h1>
    </BaseButton>
    <h1 class="text-3xl"><slot /></h1>
  </header>
</template>
