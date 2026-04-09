<template>
  <section class="dashboard-grid">
    <article class="card health">
      <h2>Estado del servidor</h2>
      <p>
        Backend: <strong>{{ health?.status ?? 'Sin datos' }}</strong>
      </p>
      <small v-if="health?.timestamp">Ultima actualizacion: {{ health.timestamp }}</small>
    </article>

    <article class="card role-card">
      <h2>Vista contextual</h2>
      <p>Bienvenido, rol actual: <strong>{{ authStore.userRole ?? 'N/A' }}</strong></p>
      <p v-if="authStore.userRole === 'admin'">Puedes administrar usuarios y toda la operacion.</p>
      <p v-else-if="authStore.userRole === 'doctor'">Acceso centrado en consultas, historias y recetas.</p>
      <p v-else>Acceso centrado en pacientes, citas y archivos.</p>
    </article>

    <article v-for="item in kpis" :key="item.label" class="card kpi">
      <h3>{{ item.label }}</h3>
      <strong>{{ item.value }}</strong>
    </article>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import { dashboardService, type DashboardKpi, type HealthResponse } from '@/modules/dashboard/dashboard.service';

const authStore = useAuthStore();
const health = ref<HealthResponse | null>(null);
const kpis = ref<DashboardKpi[]>([]);

onMounted(async () => {
  health.value = await dashboardService.health();
  try {
    kpis.value = await dashboardService.kpis();
  } catch {
    kpis.value = [];
  }
});
</script>

<style scoped>
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 14px;
}

.card {
  border-radius: 16px;
  padding: 16px;
  background: #ffffff;
  border: 1px solid #dbe5f0;
  box-shadow: 0 12px 24px rgba(20, 34, 58, 0.06);
}

.health {
  grid-column: span 6;
}

.role-card {
  grid-column: span 6;
}

.kpi {
  grid-column: span 3;
}

h2,
h3 {
  margin-top: 0;
}

strong {
  font-size: 1.2rem;
}

@media (max-width: 900px) {
  .health,
  .role-card,
  .kpi {
    grid-column: span 12;
  }
}
</style>
