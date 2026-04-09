<template>
  <section class="panel">
    <header class="panel-header">
      <h2>{{ title }}</h2>
      <button v-if="showCreate" @click="$emit('create')">Nuevo</button>
    </header>
    <slot />
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  showCreate?: boolean;
}>();

defineEmits<{
  create: [];
}>();
</script>

<style scoped>
.panel {
  background: #ffffff;
  border: 1px solid #dfe6ef;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 8px 20px rgba(15, 47, 39, 0.08);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

h2 {
  margin: 0;
}

button {
  border: none;
  border-radius: 8px;
  background: #0f5f4c;
  color: #ffffff;
  padding: 8px 12px;
  cursor: pointer;
}
</style>
