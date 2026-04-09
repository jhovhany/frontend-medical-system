import { buildCrudService, type ListParams } from '@/services/crud.service';
import type { Appointment } from '@/shared/types/domain';

const baseService = buildCrudService<Appointment, Partial<Appointment>, Partial<Appointment>>(
  'v1/appointments',
);

export const appointmentsService = {
  ...baseService,
  listWithFilters(params: ListParams): Promise<Appointment[]> {
    return baseService.list(params);
  },
};
