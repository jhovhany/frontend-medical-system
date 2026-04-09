<template>
  <CrudPanel title="Recetas" :show-create="true" @create="resetForm">
    <form class="form-grid" @submit.prevent="savePrescription">
      <input v-model.number="form.consultation_id" type="number" min="1" placeholder="ID consulta" required />
      <input v-model="form.medications" placeholder="Medicamentos" required />
      <input v-model="form.instructions" placeholder="Instrucciones" required />
      <input v-model="form.issued_at" type="date" required />
      <button type="submit">{{ form.id ? 'Actualizar' : 'Crear' }}</button>
    </form>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Consulta</th>
          <th>Medicamentos</th>
          <th>Instrucciones</th>
          <th>Fecha</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="prescription in prescriptions" :key="prescription.id">
          <td>{{ prescription.id }}</td>
          <td>{{ prescription.consultation_id }}</td>
          <td>{{ prescription.medications }}</td>
          <td>{{ prescription.instructions }}</td>
          <td>{{ prescription.issued_at }}</td>
          <td>
            <button class="ghost" @click="edit(prescription)">Editar</button>
            <button class="ghost" @click="download(prescription.id)">PDF</button>
            <button class="danger" @click="remove(prescription.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </CrudPanel>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import CrudPanel from '@/shared/ui/CrudPanel.vue';
import { prescriptionsService } from '@/modules/prescriptions/prescriptions.service';
import type { Prescription } from '@/shared/types/domain';

const prescriptions = ref<Prescription[]>([]);
const form = reactive<Partial<Prescription>>({
  id: undefined,
  consultation_id: undefined,
  medications: '',
  instructions: '',
  issued_at: '',
});

const loadPrescriptions = async () => {
  prescriptions.value = await prescriptionsService.list();
};

const resetForm = () => {
  form.id = undefined;
  form.consultation_id = undefined;
  form.medications = '';
  form.instructions = '';
  form.issued_at = '';
};

const edit = (prescription: Prescription) => {
  form.id = prescription.id;
  form.consultation_id = prescription.consultation_id;
  form.medications = prescription.medications;
  form.instructions = prescription.instructions;
  form.issued_at = prescription.issued_at;
};

const savePrescription = async () => {
  if (form.id) {
    await prescriptionsService.update(form.id, form);
  } else {
    await prescriptionsService.create(form);
  }
  resetForm();
  await loadPrescriptions();
};

const remove = async (id: number) => {
  await prescriptionsService.remove(id);
  await loadPrescriptions();
};

const download = async (id: number) => {
  const blob = await prescriptionsService.downloadPdf(id);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `receta-${id}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
};

onMounted(loadPrescriptions);
</script>

<style scoped>
.form-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 12px;
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
