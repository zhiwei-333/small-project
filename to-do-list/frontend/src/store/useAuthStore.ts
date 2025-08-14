import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

// 
export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  gender?: string;
  profilePic?: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  gender?: string;
  profilePic?: string;
}

interface AuthStore {
  authUser: AuthUser | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;

  signup: (data: SignupData) => Promise<AuthUser | null>;
  login: (data: LoginData) => Promise<any>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  logout: () => Promise<void>;
}

// 
export const useAuthStore = create<AuthStore>((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,

  signup: async (data) => {
    set({ isSigningUp: true });
    console.log("Signup data:", data);

    try {
      const res = await axiosInstance.post<AuthUser>("/auth/signup", {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      // Ideally update state with returned user
      set({ authUser: res.data });
      return get().authUser;
    } catch (error: any) {
      console.error("Signup error:", error);
      console.log("Error response data:", error.response?.data);
      throw error;
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post<{ token: string; user: AuthUser }>("/auth/login", {
        email: data.email,
        password: data.password,
      });

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      set({ authUser: user });
      return res.data;
    } catch (error: any) {
      console.error("Login error:", error.response?.data);

      const status = error.response?.status;
      const serverMessage = error.response?.data?.message;

      let userMessage = "Login failed. Please try again.";
      if (status === 400) {
        userMessage = serverMessage || "Invalid email or password.";
      } else if (status === 500) {
        userMessage = "Server error. Please try again later.";
      }

      throw new Error(userMessage);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  updateProfile: async (data) => {
    try {
      const userId = get().authUser?._id;
      if (!userId) throw new Error("User ID not found");

      const res = await axiosInstance.put<AuthUser>(`/users/${userId}`, data);
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in update profile:", error);
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");

      localStorage.removeItem("token");
      delete axiosInstance.defaults.headers.common["Authorization"];

      set({ authUser: null });
    } catch (error) {
      console.error("Logout error:", error);
    }
  },
}));
