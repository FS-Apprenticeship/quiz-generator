<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  id: {
    type: String,
    required: true,
  },
  modelValue: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <label :for="id" class="block font-semibold"><slot /></label>
  <input
    :id="id"
    :value="modelValue"
    :type
    @input="$emit('update:modelValue', $event.target.value)"
    class="p-4 border border-b-gray-300 rounded-md h-10"
    v-bind="$attrs"
  />
</template>
