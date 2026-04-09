import { http } from '@/services/http';

export interface DashboardKpi {
  label: string;
  value: number;
}

export interface HealthResponse {
  status: string;
  timestamp?: string;
}

export const dashboardService = {
  async health(): Promise<HealthResponse> {
    const { data } = await http.get<HealthResponse>('health');
    return data;
  },
  async kpis(): Promise<DashboardKpi[]> {
    const { data } = await http.get<DashboardKpi[]>('v1/dashboard/kpis');
    return data;
  },
};
