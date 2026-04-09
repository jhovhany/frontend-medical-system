export type Role = 'admin' | 'doctor' | 'receptionist';

export interface User {
  id: number;
  full_name: string;
  email: string;
  role: Role;
  is_active?: boolean;
}

export interface AuthTokens {
  access_token: string;
  refresh_token?: string;
  token_type?: string;
}

export interface ApiListResponse<T> {
  data: T[];
  total?: number;
}

export interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  document_number: string;
  phone?: string;
  birth_date?: string;
}

export interface MedicalRecord {
  id: number;
  patient_id: number;
  allergies?: string;
  chronic_conditions?: string;
  notes?: string;
}

export interface Consultation {
  id: number;
  patient_id: number;
  doctor_id: number;
  medical_record_id: number;
  consultation_date: string;
  diagnosis?: string;
  notes?: string;
}

export interface Prescription {
  id: number;
  consultation_id: number;
  medications: string;
  instructions: string;
  issued_at: string;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  status: AppointmentStatus;
  appointment_date: string;
  reason?: string;
}

export interface MedicalFile {
  id: number;
  filename: string;
  file_url?: string;
  patient_id?: number;
  consultation_id?: number;
  created_at?: string;
}
