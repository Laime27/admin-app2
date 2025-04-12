// stores/authStore.ts
import { create } from 'zustand';

type User = {
  id: number;
  nombre: string;
  email: string;
  fecha_nacimiento: string;
  telefono: string;
  codigo_referido: string;
  numero_referido: string;
  rol: string;
  dias_recordatorios: string | null;
  imagen_url: string | null;
  imagen_ruta: string | null;
  direccion: string;
  created_at: string;
};

type AuthState = {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
};

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));

export default useAuthStore;
