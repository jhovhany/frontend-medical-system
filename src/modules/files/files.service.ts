import { buildCrudService } from '@/services/crud.service';
import { http } from '@/services/http';
import type { MedicalFile } from '@/shared/types/domain';

const baseService = buildCrudService<MedicalFile, Partial<MedicalFile>, Partial<MedicalFile>>('v1/files');

export const filesService = {
  ...baseService,
  async upload(payload: { file: File; patient_id?: number; consultation_id?: number }): Promise<MedicalFile> {
    const formData = new FormData();
    formData.append('file', payload.file);
    if (payload.patient_id) formData.append('patient_id', String(payload.patient_id));
    if (payload.consultation_id) formData.append('consultation_id', String(payload.consultation_id));

    const { data } = await http.post<MedicalFile>('v1/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
  async download(id: number): Promise<Blob> {
    const { data } = await http.get(`v1/files/${id}/download`, { responseType: 'blob' });
    return data as Blob;
  },
};
