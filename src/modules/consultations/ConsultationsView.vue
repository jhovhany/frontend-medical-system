<template>
  <CrudPanel title="Consultas" :show-create="true" @create="resetForm">
    <form class="form-grid" @submit.prevent="saveConsultation">
      <input v-model.number="form.patient_id" type="number" min="1" placeholder="ID paciente" required />
      <input v-model.number="form.doctor_id" type="number" min="1" placeholder="ID doctor" required />
      <input v-model.number="form.medical_record_id" type="number" min="1" placeholder="ID historia" required />
      <input v-model="form.consultation_date" type="datetime-local" required />
      <input v-model="form.diagnosis" placeholder="Diagnóstico" />
      <textarea v-model="form.notes" placeholder="Notas"></textarea>
      <button type="submit">{{ form.id ? 'Actualizar' : 'Crear' }}</button>
    </form>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Paciente</th>
          <th>Doctor</th>
          <th>Fecha</th>
          <th>Diagnóstico</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="consultation in consultations" :key="consultation.id">
          <td>{{ consultation.id }}</td>
          <td>{{ consultation.patient_id }}</td>
          <td>{{ consultation.doctor_id }}</td>
          <td>{{ consultation.consultation_date }}</td>
          <td>{{ consultation.diagnosis || '-' }}</td>
          <td>
            <button class="ghost" @click="edit(consultation)">Editar</button>
            <button class="danger" @click="remove(consultation.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </CrudPanel>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import CrudPanel from '@/shared/ui/CrudPanel.vue';
import { consultationsService } from '@/modules/consultations/consultations.service';
import type { Consultation } from '@/shared/types/domain';

const consultations = ref<Consultation[]>([]);
const form = reactive<Partial<Consultation>>({
  id: undefined,
  patient_id: undefined,
  doctor_id: undefined,
  medical_record_id: undefined,
  consultation_date: '',
  diagnosis: '',
  notes: '',
});

const loadConsultations = async () => {
  consultations.value = await consultationsService.list();
};

const resetForm = () => {
  form.id = undefined;
  form.patient_id = undefined;
  form.doctor_id = undefined;
  form.medical_record_id = undefined;
  form.consultation_date = '';
  form.diagnosis = '';
  form.notes = '';
};

const edit = (consultation: Consultation) => {
  form.id = consultation.id;
  form.patient_id = consultation.patient_id;
  form.doctor_id = consultation.doctor_id;
  form.medical_record_id = consultation.medical_record_id;
  form.consultation_date = consultation.consultation_date;
  form.diagnosis = consultation.diagnosis;
  form.notes = consultation.notes;
};

const saveConsultation = async () => {
  if (form.id) {
    await consultationsService.update(form.id, form);
  } else {
    await consultationsService.create(form);
  }
  resetForm();
  await loadConsultations();
};

const remove = async (id: number) => {
  await consultationsService.remove(id);
  await loadConsultations();
};

onMounted(loadConsultations);
</script>

<style scoped>
.form-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 12px;
}

textarea {
  min-height: 40px;
}

button {
  border: none;
  border-radius: 8px;
  padding: 8px 10px;
  cursor: pointer;
}

.ghost {
  background: #edf3f9;
}

.danger {
  background: #ffdede;
}

@media (max-width: 900px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
