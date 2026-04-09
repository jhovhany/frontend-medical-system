<template>
  <CrudPanel title="Historias clinicas" :show-create="true" @create="resetForm">
    <form class="form-grid" @submit.prevent="saveRecord">
      <input v-model.number="form.patient_id" type="number" min="1" placeholder="ID paciente" required />
      <input v-model="form.allergies" placeholder="Alergias" />
      <input v-model="form.chronic_conditions" placeholder="Condiciones crónicas" />
      <textarea v-model="form.notes" placeholder="Notas"></textarea>
      <button type="submit">{{ form.id ? 'Actualizar' : 'Crear' }}</button>
    </form>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Paciente</th>
          <th>Alergias</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="record in records" :key="record.id">
          <td>{{ record.id }}</td>
          <td>{{ record.patient_id }}</td>
          <td>{{ record.allergies || '-' }}</td>
          <td>
            <button class="ghost" @click="edit(record)">Editar</button>
            <button class="ghost" @click="loadHistory(record.id)">Historial</button>
            <button class="danger" @click="remove(record.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="history.length" class="history">
      <h3>Historial de consultas</h3>
      <ul>
        <li v-for="item in history" :key="item.id">
          {{ item.consultation_date }} - Diagnóstico: {{ item.diagnosis || 'N/A' }}
        </li>
      </ul>
    </div>
  </CrudPanel>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import CrudPanel from '@/shared/ui/CrudPanel.vue';
import { medicalRecordsService } from '@/modules/medical-records/medical-records.service';
import type { Consultation, MedicalRecord } from '@/shared/types/domain';

const records = ref<MedicalRecord[]>([]);
const history = ref<Consultation[]>([]);

const form = reactive<Partial<MedicalRecord>>({
  id: undefined,
  patient_id: undefined,
  allergies: '',
  chronic_conditions: '',
  notes: '',
});

const loadRecords = async () => {
  records.value = await medicalRecordsService.list();
};

const loadHistory = async (recordId: number) => {
  history.value = await medicalRecordsService.consultationsHistory(recordId);
};

const resetForm = () => {
  form.id = undefined;
  form.patient_id = undefined;
  form.allergies = '';
  form.chronic_conditions = '';
  form.notes = '';
};

const edit = (record: MedicalRecord) => {
  form.id = record.id;
  form.patient_id = record.patient_id;
  form.allergies = record.allergies;
  form.chronic_conditions = record.chronic_conditions;
  form.notes = record.notes;
};

const saveRecord = async () => {
  if (form.id) {
    await medicalRecordsService.update(form.id, form);
  } else {
    await medicalRecordsService.create(form);
  }
  resetForm();
  await loadRecords();
};

const remove = async (id: number) => {
  await medicalRecordsService.remove(id);
  await loadRecords();
};

onMounted(loadRecords);
</script>

<style scoped>
.form-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
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

.history {
  margin-top: 16px;
  border-top: 1px solid #dfe6ef;
  padding-top: 12px;
}

@media (max-width: 900px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
