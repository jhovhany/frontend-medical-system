import { buildCrudService } from '@/services/crud.service';
import { http } from '@/services/http';
import type { MedicalRecord, Consultation } from '@/shared/types/domain';

export const medicalRecordsService = {
  ...buildCrudService<MedicalRecord, Partial<MedicalRecord>, Partial<MedicalRecord>>('v1/medical-records'),
  async consultationsHistory(recordId: number): Promise<Consultation[]> {
    const { data } = await http.get<Consultation[]>(`v1/medical-records/${recordId}/consultations`);
    return data;
  },
};
