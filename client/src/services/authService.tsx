import axios, { AxiosResponse } from "axios";


// Base URL for the backend API
const BACKEND_URL = "http://localhost:3002/auth";


// Define the structure of the user data for registration and login
export interface UserData {
  email: string;
  password: string;
  role?: string;
}

// Define the structure of the API responses
export interface AuthResponse {
  token?: string; // Token may not always be present (e.g., on error)
  message?: string; // Optional message field for responses
}

// Register a new user
export const register = async (
  userData: UserData
): Promise<AxiosResponse<AuthResponse>> => {
  return axios.post<AuthResponse>(`${BACKEND_URL}/register`, userData);
};

// Log in a user and store the token in localStorage
export const login = async (userData: UserData): Promise<AuthResponse> => {
try {
  const response = await axios.post<AuthResponse>(`${BACKEND_URL}/login`, userData, {
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' }
  });

  if (response.data.token) {
    localStorage.setItem("token", response.data.token); // Store token in localStorage
    console.log('token stored')
  }

  return response.data;
}
catch (error){
console.log('service error logging in: ', error)
}
};

// Log out the user by removing the token from localStorage
export const logout = (): void => {
  localStorage.removeItem("token");
};

// Get the stored token from localStorage
export const getToken = (): string | null => {
  return localStorage.getItem("token");
};
