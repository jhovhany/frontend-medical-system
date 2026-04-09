<template>
  <CrudPanel title="Pacientes" :show-create="true" @create="resetForm">
    <form class="form-grid" @submit.prevent="savePatient">
      <input v-model="form.first_name" placeholder="Nombre" required />
      <input v-model="form.last_name" placeholder="Apellido" required />
      <input v-model="form.document_number" placeholder="Documento" required />
      <input v-model="form.phone" placeholder="Teléfono" />
      <input v-model="form.birth_date" type="date" />
      <button type="submit">{{ form.id ? 'Actualizar' : 'Crear' }}</button>
    </form>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Documento</th>
          <th>Teléfono</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="patient in patients" :key="patient.id">
          <td>{{ patient.id }}</td>
          <td>{{ patient.first_name }} {{ patient.last_name }}</td>
          <td>{{ patient.document_number }}</td>
          <td>{{ patient.phone }}</td>
          <td>
            <RouterLink :to="`/patients/${patient.id}`">Detalle</RouterLink>
            <button class="ghost" @click="edit(patient)">Editar</button>
            <button class="danger" @click="remove(patient.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </CrudPanel>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { RouterLink } from 'vue-router';
import CrudPanel from '@/shared/ui/CrudPanel.vue';
import { patientsService } from '@/modules/patients/patients.service';
import type { Patient } from '@/shared/types/domain';

const patients = ref<Patient[]>([]);
const form = reactive<Partial<Patient>>({
  id: undefined,
  first_name: '',
  last_name: '',
  document_number: '',
  phone: '',
  birth_date: '',
});

const loadPatients = async () => {
  patients.value = await patientsService.list();
};

const resetForm = () => {
  form.id = undefined;
  form.first_name = '';
  form.last_name = '';
  form.document_number = '';
  form.phone = '';
  form.birth_date = '';
};

const edit = (patient: Patient) => {
  form.id = patient.id;
  form.first_name = patient.first_name;
  form.last_name = patient.last_name;
  form.document_number = patient.document_number;
  form.phone = patient.phone;
  form.birth_date = patient.birth_date;
};

const savePatient = async () => {
  if (form.id) {
    await patientsService.update(form.id, form);
  } else {
    await patientsService.create(form);
  }
  resetForm();
  await loadPatients();
};

const remove = async (id: number) => {
  await patientsService.remove(id);
  await loadPatients();
};

onMounted(loadPatients);
</script>

<style scoped>
.form-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
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

td {
  display: flex;
  align-items: center;
  gap: 8px;
}

@media (max-width: 900px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
