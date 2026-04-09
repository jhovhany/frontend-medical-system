<template>
  <div v-if="error" class="app-alert" role="alert">
    <strong>Error:</strong> {{ error.message }}
    <button class="close" @click="uiStore.clearError">Cerrar</button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUiStore } from '@/stores/ui.store';

const uiStore = useUiStore();
const error = computed(() => uiStore.error);
</script>

<style scoped>
.app-alert {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #f2c6c6;
  background: #fff3f2;
  color: #8f1f1f;
  font-size: 0.95rem;
}

.close {
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-weight: 700;
}
</style>
