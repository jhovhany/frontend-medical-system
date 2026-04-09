import { buildCrudService } from '@/services/crud.service';
import type { Consultation } from '@/shared/types/domain';

export const consultationsService = buildCrudService<Consultation, Partial<Consultation>, Partial<Consultation>>(
  'v1/consultations',
);
