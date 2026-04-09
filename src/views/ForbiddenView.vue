<template>
  <section class="forbidden-page">
    <div class="card">
      <h1>Acceso denegado</h1>
      <p>No tienes permisos para entrar a este modulo.</p>
      <RouterLink to="/dashboard" class="btn">Volver al dashboard</RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<style scoped>
.forbidden-page {
  min-height: 60vh;
  display: grid;
  place-items: center;
}

.card {
  width: min(100%, 520px);
  background: #ffffff;
  border: 1px solid #dbe5f0;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 10px 24px rgba(20, 34, 58, 0.08);
}

h1 {
  margin: 0 0 8px;
}

p {
  margin: 0 0 16px;
  color: #4e5f5a;
}

.btn {
  display: inline-block;
  text-decoration: none;
  border-radius: 10px;
  padding: 10px 14px;
  background: #0f5f4c;
  color: #fff;
}
</style>
