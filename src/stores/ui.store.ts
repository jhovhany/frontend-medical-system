import { defineStore } from 'pinia';

interface HttpErrorState {
  status?: number;
  message: string;
}

interface UiState {
  loading: boolean;
  error: HttpErrorState | null;
  validationErrors: Record<string, string[]>;
}

export const useUiStore = defineStore('ui', {
  state: (): UiState => ({
    loading: false,
    error: null,
    validationErrors: {},
  }),
  actions: {
    setLoading(value: boolean) {
      this.loading = value;
    },
    setError(message: string, status?: number) {
      this.error = { message, status };
    },
    setValidationErrors(errors: Record<string, string[]>) {
      this.validationErrors = errors;
    },
    clearValidationErrors() {
      this.validationErrors = {};
    },
    clearError() {
      this.error = null;
      this.clearValidationErrors();
    },
  },
});
