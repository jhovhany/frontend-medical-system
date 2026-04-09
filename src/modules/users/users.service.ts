import { buildCrudService } from '@/services/crud.service';
import type { User } from '@/shared/types/domain';

export const usersService = buildCrudService<User, Partial<User>, Partial<User>>('v1/users');
