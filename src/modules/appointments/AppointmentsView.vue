<template>
  <CrudPanel title="Citas" :show-create="true" @create="resetForm">
    <form class="filters" @submit.prevent="applyFilters">
      <input v-model="filters.date_from" type="date" />
      <input v-model="filters.date_to" type="date" />
      <input v-model.number="filters.doctor_id" type="number" min="1" placeholder="ID doctor" />
      <input v-model.number="filters.patient_id" type="number" min="1" placeholder="ID paciente" />
      <select v-model="filters.status">
        <option value="">Todos los estados</option>
        <option value="pending">Pendiente</option>
        <option value="confirmed">Confirmada</option>
        <option value="completed">Completada</option>
        <option value="cancelled">Cancelada</option>
      </select>
      <button type="submit">Filtrar</button>
    </form>

    <form class="form-grid" @submit.prevent="saveAppointment">
      <input v-model.number="form.patient_id" type="number" min="1" placeholder="ID paciente" required />
      <input v-model.number="form.doctor_id" type="number" min="1" placeholder="ID doctor" required />
      <select v-model="form.status" required>
        <option value="pending">Pendiente</option>
        <option value="confirmed">Confirmada</option>
        <option value="completed">Completada</option>
        <option value="cancelled">Cancelada</option>
      </select>
      <input v-model="form.appointment_date" type="datetime-local" required />
      <input v-model="form.reason" placeholder="Motivo" />
      <button type="submit">{{ form.id ? 'Actualizar' : 'Crear' }}</button>
    </form>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Paciente</th>
          <th>Doctor</th>
          <th>Estado</th>
          <th>Fecha</th>
          <th>Motivo</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="appointment in appointments" :key="appointment.id">
          <td>{{ appointment.id }}</td>
          <td>{{ appointment.patient_id }}</td>
          <td>{{ appointment.doctor_id }}</td>
          <td>{{ appointment.status }}</td>
          <td>{{ appointment.appointment_date }}</td>
          <td>{{ appointment.reason || '-' }}</td>
          <td>
            <button class="ghost" @click="edit(appointment)">Editar</button>
            <button class="danger" @click="remove(appointment.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </CrudPanel>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import CrudPanel from '@/shared/ui/CrudPanel.vue';
import { appointmentsService } from '@/modules/appointments/appointments.service';
import type { Appointment } from '@/shared/types/domain';

const appointments = ref<Appointment[]>([]);

const filters = reactive({
  date_from: '',
  date_to: '',
  doctor_id: undefined as number | undefined,
  patient_id: undefined as number | undefined,
  status: '',
});

const form = reactive<Partial<Appointment>>({
  id: undefined,
  patient_id: undefined,
  doctor_id: undefined,
  status: 'pending',
  appointment_date: '',
  reason: '',
});

const loadAppointments = async () => {
  appointments.value = await appointmentsService.listWithFilters({
    date_from: filters.date_from || undefined,
    date_to: filters.date_to || undefined,
    doctor_id: filters.doctor_id,
    patient_id: filters.patient_id,
    status: filters.status || undefined,
  });
};

const applyFilters = async () => {
  await loadAppointments();
};

const resetForm = () => {
  form.id = undefined;
  form.patient_id = undefined;
  form.doctor_id = undefined;
  form.status = 'pending';
  form.appointment_date = '';
  form.reason = '';
};

const edit = (appointment: Appointment) => {
  form.id = appointment.id;
  form.patient_id = appointment.patient_id;
  form.doctor_id = appointment.doctor_id;
  form.status = appointment.status;
  form.appointment_date = appointment.appointment_date;
  form.reason = appointment.reason;
};

const saveAppointment = async () => {
  if (form.id) {
    await appointmentsService.update(form.id, form);
  } else {
    await appointmentsService.create(form);
  }
  resetForm();
  await loadAppointments();
};

const remove = async (id: number) => {
  await appointmentsService.remove(id);
  await loadAppointments();
};

onMounted(loadAppointments);
</script>

<style scoped>
.filters,
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

@media (max-width: 900px) {
  .filters,
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
