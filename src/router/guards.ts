import type { Router } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { hasPermission } from '@/shared/utils/permissions';

export const registerRouterGuards = (router: Router): void => {
  router.beforeEach(async (to) => {
    const authStore = useAuthStore();

    if (!authStore.sessionRestored) {
      await authStore.restoreSession();
    }

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      return { name: 'login' };
    }

    if (to.name === 'login' && authStore.isAuthenticated) {
      return { name: 'dashboard' };
    }

    const permission = to.meta.permission;
    if (permission && !hasPermission(authStore.userRole, permission)) {
      if (to.name !== 'forbidden') {
        return { name: 'forbidden' };
      }
    }

    return true;
  });
};
