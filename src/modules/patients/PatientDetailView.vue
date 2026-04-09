<template>
  <CrudPanel title="Detalle de paciente">
    <div v-if="patient" class="detail-grid">
      <div>
        <strong>Nombre:</strong>
        <p>{{ patient.first_name }} {{ patient.last_name }}</p>
      </div>
      <div>
        <strong>Documento:</strong>
        <p>{{ patient.document_number }}</p>
      </div>
      <div>
        <strong>Teléfono:</strong>
        <p>{{ patient.phone || '-' }}</p>
      </div>
      <div>
        <strong>Nacimiento:</strong>
        <p>{{ patient.birth_date || '-' }}</p>
      </div>
    </div>

    <RouterLink to="/patients">Volver a pacientes</RouterLink>
  </CrudPanel>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import CrudPanel from '@/shared/ui/CrudPanel.vue';
import type { Patient } from '@/shared/types/domain';
import { patientsService } from '@/modules/patients/patients.service';

const route = useRoute();
const patient = ref<Patient | null>(null);

onMounted(async () => {
  patient.value = await patientsService.getById(Number(route.params.id));
});
</script>

<style scoped>
.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 10px;
}

p {
  margin: 4px 0 0;
}

@media (max-width: 900px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
