import { http } from '@/services/http';

export interface ListParams {
  page?: number;
  page_size?: number;
  search?: string;
  date_from?: string;
  date_to?: string;
  doctor_id?: number;
  patient_id?: number;
  status?: string;
}

export interface CrudService<T, TCreate = Partial<T>, TUpdate = Partial<T>> {
  list(params?: ListParams): Promise<T[]>;
  getById(id: number): Promise<T>;
  create(payload: TCreate): Promise<T>;
  update(id: number, payload: TUpdate): Promise<T>;
  remove(id: number): Promise<void>;
}

export const buildCrudService = <T, TCreate = Partial<T>, TUpdate = Partial<T>>(
  endpoint: string,
): CrudService<T, TCreate, TUpdate> => ({
  async list(params) {
    const { data } = await http.get<T[]>(endpoint, { params });
    return data;
  },
  async getById(id) {
    const { data } = await http.get<T>(`${endpoint}/${id}`);
    return data;
  },
  async create(payload) {
    const { data } = await http.post<T>(endpoint, payload);
    return data;
  },
  async update(id, payload) {
    const { data } = await http.put<T>(`${endpoint}/${id}`, payload);
    return data;
  },
  async remove(id) {
    await http.delete(`${endpoint}/${id}`);
  },
});
