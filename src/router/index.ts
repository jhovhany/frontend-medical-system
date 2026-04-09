import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { type PermissionKey } from '@/shared/utils/permissions';
import { registerRouterGuards } from '@/router/guards';
import AppLayout from '@/shared/layouts/AppLayout.vue';

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    permission?: PermissionKey;
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
  },
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/dashboard' },
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/modules/dashboard/DashboardView.vue'),
        meta: { requiresAuth: true, permission: 'dashboard:view' },
      },
      {
        path: '/forbidden',
        name: 'forbidden',
        component: () => import('@/views/ForbiddenView.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/users',
        name: 'users',
        component: () => import('@/modules/users/UsersView.vue'),
        meta: { requiresAuth: true, permission: 'users:manage' },
      },
      {
        path: '/patients',
        name: 'patients',
        component: () => import('@/modules/patients/PatientsView.vue'),
        meta: { requiresAuth: true, permission: 'patients:manage' },
      },
      {
        path: '/patients/:id',
        name: 'patient-detail',
        component: () => import('@/modules/patients/PatientDetailView.vue'),
        meta: { requiresAuth: true, permission: 'patients:manage' },
      },
      {
        path: '/medical-records',
        name: 'medical-records',
        component: () => import('@/modules/medical-records/MedicalRecordsView.vue'),
        meta: { requiresAuth: true, permission: 'medical-records:manage' },
      },
      {
        path: '/consultations',
        name: 'consultations',
        component: () => import('@/modules/consultations/ConsultationsView.vue'),
        meta: { requiresAuth: true, permission: 'consultations:manage' },
      },
      {
        path: '/prescriptions',
        name: 'prescriptions',
        component: () => import('@/modules/prescriptions/PrescriptionsView.vue'),
        meta: { requiresAuth: true, permission: 'prescriptions:manage' },
      },
      {
        path: '/appointments',
        name: 'appointments',
        component: () => import('@/modules/appointments/AppointmentsView.vue'),
        meta: { requiresAuth: true, permission: 'appointments:manage' },
      },
      {
        path: '/files',
        name: 'files',
        component: () => import('@/modules/files/FilesView.vue'),
        meta: { requiresAuth: true, permission: 'files:manage' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

registerRouterGuards(router);

export default router;
