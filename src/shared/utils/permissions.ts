import type { Role } from '@/shared/types/domain';

export type PermissionKey =
  | 'dashboard:view'
  | 'users:manage'
  | 'patients:manage'
  | 'medical-records:manage'
  | 'consultations:manage'
  | 'prescriptions:manage'
  | 'appointments:manage'
  | 'files:manage';

const rolePermissions: Record<Role, PermissionKey[]> = {
  admin: [
    'dashboard:view',
    'users:manage',
    'patients:manage',
    'medical-records:manage',
    'consultations:manage',
    'prescriptions:manage',
    'appointments:manage',
    'files:manage',
  ],
  doctor: [
    'dashboard:view',
    'patients:manage',
    'medical-records:manage',
    'consultations:manage',
    'prescriptions:manage',
    'appointments:manage',
    'files:manage',
  ],
  receptionist: ['dashboard:view', 'patients:manage', 'appointments:manage', 'files:manage'],
};

export const hasPermission = (role: Role | undefined, permission: PermissionKey): boolean => {
  if (!role) return false;
  return rolePermissions[role].includes(permission);
};
