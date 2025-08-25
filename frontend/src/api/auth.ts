const API_BASE_URL = "/api/auth";

export interface AuthResponse {
  token: string;
  user: {
    _id: string;
    email: string;
    name?: string;
    gender?: string;
    profilePic?: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData extends LoginCredentials {
  name: string;
  gender?: string;
  profilePic?: string;
}

// Common headers for JSON requests
const getJsonHeaders = () => ({
  "Content-Type": "application/json",
});

// LOGIN
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: getJsonHeaders(),
    body: JSON.stringify(credentials),
  });

  console.log("Login response:", response);
  if (!response.ok) {
    throw new Error("Failed to login");
  }
  return response.json();
};

// SIGNUP
export const signup = async (data: SignupData): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/signup`, {
    method: "POST",
    headers: getJsonHeaders(),
    body: JSON.stringify(data),
  });

  console.log("Signup response:", response);
  if (!response.ok) {
    throw new Error("Failed to sign up");
  }
  return response.json();
};

// GET CURRENT USER
export const getCurrentUser = async (token: string): Promise<AuthResponse["user"]> => {
  const response = await fetch(`${API_BASE_URL}/me`, {
    headers: {
      ...getJsonHeaders(),
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch current user");
  }
  return response.json();
};

// UPDATE PROFILE
export const updateProfile = async (
  updates: Partial<SignupData>,
  token: string
): Promise<AuthResponse["user"]> => {
  const response = await fetch(`${API_BASE_URL}/me`, {
    method: "PUT",
    headers: {
      ...getJsonHeaders(),
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error("Failed to update profile");
  }
  return response.json();
};
