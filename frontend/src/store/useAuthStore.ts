import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../lib/axios";

let refreshTimer: ReturnType<typeof setTimeout> | null = null;

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
  confirmPassword:string;
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
  refreshAccessToken: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      authUser: null,
      isSigningUp: false,
      isLoggingIn: false,

      signup: async (data) => {
        console.log("Signing up with data:", data)
        set({ isSigningUp: true });
        console.log("Signup in progress...");
        try {
          const res = await axiosInstance.post<AuthUser>("/auth/signup", {
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
          set({ authUser: res.data });
          console.log("Signup user:", res.data);
          return get().authUser;
        } finally {
          set({ isSigningUp: false });
        }
      },

      login: async (data) => {
        console.log("Logging in with data:", data);
        set({ isLoggingIn: true });
        console.log("Login in progress...");
        try {
          const res = await axiosInstance.post<{
            accessToken: string;
            user: AuthUser;
          }>("/auth/login", {
        email: data.email,
        password: data.password,
      });
          console.log("Login response:", res.data);
          const { accessToken } = res.data;
          localStorage.setItem("token", accessToken);
          axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

          // Schedule refresh in 4.5 min
          if (refreshTimer) clearTimeout(refreshTimer);
          refreshTimer = setTimeout(() => get().refreshAccessToken(), 4.5 * 60 * 1000);

          // set({ authUser: user });
          set({ authUser: res.data.user }); // after successful login
          return res.data;
        } finally {
          set({ isLoggingIn: false });
        }
      },

      refreshAccessToken: async () => {
        try {
          const res = await axiosInstance.post<{ accessToken: string }>("/auth/refresh");
          const { accessToken } = res.data;
          console.log("Access token refreshed:", accessToken);

          localStorage.setItem("token", accessToken);
          axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

          if (refreshTimer) clearTimeout(refreshTimer);
          refreshTimer = setTimeout(() => get().refreshAccessToken(), 1 * 60 * 1000);
        } catch (err) {
          console.error("Token refresh failed:", err);
          get().logout();
        }
      },

      updateProfile: async (data) => {
        const userId = get().authUser?._id;
        if (!userId) throw new Error("User ID not found");
        const res = await axiosInstance.put<AuthUser>(`/users/${userId}`, data);
        set({ authUser: res.data });
      },

      logout: async () => {
        try {
          console.log("Logging out user:", get().authUser?._id);
          await axiosInstance.post("/auth/logout");
        } finally {
          localStorage.removeItem("refreshToken");
          delete axiosInstance.defaults.headers.common.Authorization;
          set({ authUser: null });
          if (refreshTimer) clearTimeout(refreshTimer);
        }
      },
    }),
    {
      name: "auth-storage", // key in localStorage
      partialize: (state) => ({
        authUser: state.authUser, // persist only authUser
      }),
    }
  )
);
