// src/pages/LoginPage.tsx
import React, { useState } from "react";
import FormField from "../components/auth/FormField";
import { useNavigate } from "react-router-dom";
// import { login } from "../api/auth";
import { useAuthStore } from "../store/useAuthStore";
import type { LoginData } from "../store/useAuthStore";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [form, setForm] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError(null);

    try {
      await login(form); // Call store login method
      navigate("/");     // Redirect after successful login
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
        <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
            <FormField
            type="email"
            name="email"
            label="Email"
            value={form.email}
            onChange={handleChange}
            />
            <FormField
            type="password"
            name="password"
            label="Password"
            value={form.password}
            onChange={handleChange}
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <a
            id="forgotPwLink"
            href="#"
            className="text-sm text-orange-600 hover:underline block text-right"
            >
            Forgot Password?
            </a>

            <button
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={isLoggingIn}
            >
            {isLoggingIn ? "Logging in..." : "Login"}
            </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-orange-600 hover:underline">
            Create one
            </a>
        </p>
        </div>
    </main>
    );

};

export default LoginPage;
