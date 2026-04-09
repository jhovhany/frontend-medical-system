<template>
  <div class="login-page">
    <section class="login-card">
      <h1>Acceso al sistema medico</h1>
      <p>Ingresa tus credenciales para continuar</p>

      <form class="login-form" @submit.prevent="onSubmit">
        <label>
          Correo
          <input v-model="form.email" type="email" required placeholder="doctor@hospital.com" />
        </label>

        <label>
          Contraseña
          <input v-model="form.password" type="password" required minlength="6" />
        </label>

        <button :disabled="loading" type="submit">{{ loading ? 'Ingresando...' : 'Iniciar sesión' }}</button>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

const authStore = useAuthStore();
const router = useRouter();

const loading = ref(false);
const form = reactive({
  email: '',
  password: '',
});

const onSubmit = async () => {
  loading.value = true;
  try {
    await authStore.login(form.email, form.password);
    await router.push('/dashboard');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 16px;
  background:
    radial-gradient(600px circle at 80% 20%, rgba(15, 95, 76, 0.24), transparent),
    radial-gradient(500px circle at 10% 90%, rgba(20, 132, 106, 0.2), transparent),
    linear-gradient(150deg, #0d2e25, #123d31 45%, #1e5f4d);
}

.login-card {
  width: min(100%, 420px);
  padding: 28px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.28);
  animation: rise 0.5s ease;
}

h1 {
  margin: 0;
  font-size: 1.6rem;
}

p {
  margin: 6px 0 18px;
  color: #4e5f5a;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #1d2f2a;
  font-size: 0.95rem;
}

input {
  border: 1px solid #cad7d3;
  border-radius: 10px;
  padding: 10px;
}

button {
  margin-top: 8px;
  border: none;
  border-radius: 12px;
  padding: 11px;
  cursor: pointer;
  background: linear-gradient(130deg, #0f5f4c, #147c63);
  color: #fff;
  font-weight: 700;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@keyframes rise {
  from {
    transform: translateY(16px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
