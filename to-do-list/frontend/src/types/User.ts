export interface User {
  id: string;
  email: string;
  name: string;
  gender?: string;
  profilePic?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export interface RegisterData {
  email: string;
  name: string;
  password: string;
  gender?: string;
}
