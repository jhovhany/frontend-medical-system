<template>
  <CrudPanel title="Archivos" :show-create="false">
    <form class="upload" @submit.prevent="upload">
      <input type="file" required @change="onFileSelected" />
      <input v-model.number="uploadPayload.patient_id" type="number" min="1" placeholder="ID paciente (opcional)" />
      <input
        v-model.number="uploadPayload.consultation_id"
        type="number"
        min="1"
        placeholder="ID consulta (opcional)"
      />
      <button type="submit" :disabled="!uploadPayload.file">Subir archivo</button>
    </form>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Archivo</th>
          <th>Paciente</th>
          <th>Consulta</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in files" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.filename }}</td>
          <td>{{ item.patient_id || '-' }}</td>
          <td>{{ item.consultation_id || '-' }}</td>
          <td>
            <button class="ghost" @click="download(item.id, item.filename)">Descargar</button>
            <button class="danger" @click="remove(item.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </CrudPanel>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import CrudPanel from '@/shared/ui/CrudPanel.vue';
import { filesService } from '@/modules/files/files.service';
import type { MedicalFile } from '@/shared/types/domain';

const files = ref<MedicalFile[]>([]);

const uploadPayload = reactive<{
  file: File | null;
  patient_id?: number;
  consultation_id?: number;
}>({
  file: null,
  patient_id: undefined,
  consultation_id: undefined,
});

const loadFiles = async () => {
  files.value = await filesService.list();
};

const onFileSelected = (event: Event) => {
  const target = event.target as HTMLInputElement;
  uploadPayload.file = target.files?.[0] ?? null;
};

const upload = async () => {
  if (!uploadPayload.file) return;
  await filesService.upload({
    file: uploadPayload.file,
    patient_id: uploadPayload.patient_id,
    consultation_id: uploadPayload.consultation_id,
  });
  uploadPayload.file = null;
  await loadFiles();
};

const download = async (id: number, filename: string) => {
  const blob = await filesService.download(id);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

const remove = async (id: number) => {
  await filesService.remove(id);
  await loadFiles();
};

onMounted(loadFiles);
</script>

<style scoped>
.upload {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
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
  .upload {
    grid-template-columns: 1fr;
  }
}
</style>
