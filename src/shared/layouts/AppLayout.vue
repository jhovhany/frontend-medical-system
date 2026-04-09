<template>
  <div class="app-shell">
    <aside class="sidebar">
      <h1 class="brand">Sistema Medico</h1>
      <p class="role">Rol: {{ authStore.userRole ?? 'N/A' }}</p>
      <nav>
        <RouterLink v-for="item in menuItems" :key="item.to" :to="item.to" class="nav-link">
          {{ item.label }}
        </RouterLink>
      </nav>
      <button class="logout-btn" @click="onLogout">Cerrar sesión</button>
    </aside>

    <main class="content">
      <AppAlert />
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { hasPermission, type PermissionKey } from '@/shared/utils/permissions';
import AppAlert from '@/shared/components/AppAlert.vue';

const authStore = useAuthStore();
const router = useRouter();

interface MenuItem {
  label: string;
  to: string;
  permission: PermissionKey;
}

const allItems: MenuItem[] = [
  { label: 'Dashboard', to: '/dashboard', permission: 'dashboard:view' },
  { label: 'Usuarios', to: '/users', permission: 'users:manage' },
  { label: 'Pacientes', to: '/patients', permission: 'patients:manage' },
  { label: 'Historias clinicas', to: '/medical-records', permission: 'medical-records:manage' },
  { label: 'Consultas', to: '/consultations', permission: 'consultations:manage' },
  { label: 'Recetas', to: '/prescriptions', permission: 'prescriptions:manage' },
  { label: 'Citas', to: '/appointments', permission: 'appointments:manage' },
  { label: 'Archivos', to: '/files', permission: 'files:manage' },
];

const menuItems = computed(() =>
  allItems.filter((item) => hasPermission(authStore.userRole, item.permission)),
);

const onLogout = async () => {
  await authStore.logout();
  await router.push('/login');
};
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 280px 1fr;
  background: radial-gradient(circle at top left, #dff5ee 0%, #f6f8fc 35%, #eef2f8 100%);
}

.sidebar {
  padding: 28px 20px;
  background: linear-gradient(180deg, #10392f 0%, #0f2f27 100%);
  color: #f2f7f5;
  display: flex;
  flex-direction: column;
  gap: 18px;
  border-right: 1px solid rgba(255, 255, 255, 0.09);
}

.brand {
  margin: 0;
  font-size: 1.5rem;
  letter-spacing: 0.4px;
}

.role {
  margin: 0;
  opacity: 0.8;
  font-size: 0.88rem;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-link {
  padding: 10px 12px;
  border-radius: 10px;
  color: #d9ebe5;
  text-decoration: none;
  transition: background 0.2s ease;
}

.nav-link.router-link-active {
  background: rgba(255, 255, 255, 0.18);
  color: #ffffff;
}

.logout-btn {
  margin-top: auto;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 10px;
  background: transparent;
  color: #ffffff;
  padding: 10px 12px;
  cursor: pointer;
}

.content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

@media (max-width: 900px) {
  .app-shell {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: sticky;
    top: 0;
    z-index: 10;
  }
}
</style>
