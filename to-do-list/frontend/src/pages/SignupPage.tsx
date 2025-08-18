// src/pages/SignupPage.tsx
import React, { useState } from "react";
import FormField from "../components/auth/FormField";
import { useNavigate } from "react-router-dom";
// import { signup } from "../api/auth";
import { useAuthStore } from "../store/useAuthStore";
import type { SignupData } from "../store/useAuthStore";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const signup = useAuthStore((state) => state.signup);

  const [form, setForm] = useState<SignupData>({
    name: "",
    email: "",
    password: "",
    confirmPassword:"",
  });
  // const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSigningUp, setIsSigningUp] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSigningUp(true);
    setError(null);

    try {
      await signup({
        name: form.name,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      navigate("/login");
    } catch (err) {
      setError("Signup failed. Please try again.");
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create Account
        </h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <FormField
            type="text"
            name="name"
            label="Full Name"
            value={form.name}
            onChange={handleChange}
          />

          <FormField
            type="email"
            name="email"
            label="Email"
            value={form.email}
            onChange={handleChange}/>

          <FormField
            type="password"
            name="password"
            label="Password"
            value={form.password}
            onChange={handleChange}
          />

          <FormField
            type="password"
            name="confirmPassword"
            label="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={isSigningUp}
          >
            {isSigningUp ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-orange-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </main>
  );
};

export default SignupPage;
