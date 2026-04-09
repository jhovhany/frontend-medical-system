import { buildCrudService } from '@/services/crud.service';
import { http } from '@/services/http';
import type { Prescription } from '@/shared/types/domain';

export const prescriptionsService = {
  ...buildCrudService<Prescription, Partial<Prescription>, Partial<Prescription>>('v1/prescriptions'),
  async downloadPdf(id: number): Promise<Blob> {
    const { data } = await http.get(`v1/prescriptions/${id}/pdf`, {
      responseType: 'blob',
    });
    return data as Blob;
  },
};
