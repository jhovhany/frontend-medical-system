import { buildCrudService } from '@/services/crud.service';
import type { Patient } from '@/shared/types/domain';

export const patientsService = buildCrudService<Patient, Partial<Patient>, Partial<Patient>>(
  'v1/patients',
);
