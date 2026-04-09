<template>
  <CrudPanel title="Gestión de usuarios" :show-create="true" @create="resetForm">
    <form class="form-grid" @submit.prevent="saveUser">
      <input v-model="form.full_name" placeholder="Nombre completo" required />
      <input v-model="form.email" type="email" placeholder="Correo" required />
      <select v-model="form.role" required>
        <option disabled value="">Selecciona rol</option>
        <option value="admin">Admin</option>
        <option value="doctor">Doctor</option>
        <option value="receptionist">Recepción</option>
      </select>
      <button type="submit">{{ form.id ? 'Actualizar' : 'Crear' }}</button>
    </form>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Correo</th>
          <th>Rol</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.full_name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td>
            <button class="ghost" @click="edit(user)">Editar</button>
            <button class="danger" @click="remove(user.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </CrudPanel>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import CrudPanel from '@/shared/ui/CrudPanel.vue';
import { usersService } from '@/modules/users/users.service';
import type { User } from '@/shared/types/domain';

const users = ref<User[]>([]);
const form = reactive<Partial<User>>({
  id: undefined,
  full_name: '',
  email: '',
  role: 'doctor',
});

const loadUsers = async () => {
  users.value = await usersService.list();
};

const resetForm = () => {
  form.id = undefined;
  form.full_name = '';
  form.email = '';
  form.role = 'doctor';
};

const edit = (user: User) => {
  form.id = user.id;
  form.full_name = user.full_name;
  form.email = user.email;
  form.role = user.role;
};

const saveUser = async () => {
  if (form.id) {
    await usersService.update(form.id, form);
  } else {
    await usersService.create(form);
  }
  resetForm();
  await loadUsers();
};

const remove = async (id: number) => {
  await usersService.remove(id);
  await loadUsers();
};

onMounted(loadUsers);
</script>

<style scoped>
.form-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
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
