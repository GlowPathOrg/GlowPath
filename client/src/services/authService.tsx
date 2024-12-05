import axios, { AxiosResponse } from "axios";
import { UserI, RegisterDataI, LoginDataI } from "../Types/User";

const AUTH_URL = "https://glowpath-a7681fe09c29.herokuapp.com/auth";

export interface AuthResponse {
  token?: string;
  message?: string;
  user?: UserI;
}

// Function to retrieve token from localStorage
export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

// Function to register a new user
export const register = async (
  userData: RegisterDataI,
  handleLogin: (token: string, userData: UserI) => void
): Promise<AxiosResponse<AuthResponse> | undefined> => {
  try {
    const response = await axios.post<AuthResponse>(`${AUTH_URL}/register`, userData, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response && response.data.token) {
      localStorage.setItem("token", response.data.token);
      if (response.data.user) {
        handleLogin(response.data.token, response.data.user);
      }
      return response;
    }
  } catch (error) {
    console.error("AuthService error on register:", error);
    throw error;
  }
};

// Function to log in a user
export const login = async (
  userData: LoginDataI,
  handleLogin: (token: string, userData: UserI) => void
): Promise<AxiosResponse<AuthResponse>> => {
  try {
    const response = await axios.post<AuthResponse>(`${AUTH_URL}/login`, userData, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data.token && response.data.user) {
      localStorage.setItem("token", response.data.token);
      handleLogin(response.data.token, response.data.user);
    }
    return response;
  } catch (error) {
    console.error("Service error logging in:", error);
    throw error;
  }
};

// Function to edit user profile
export const editProfile = async (
  userEdit: {
    [key: string]: string | undefined; // Accepts any key with string values
    _id: string; // _id is required
  },
  handleLogin: (token: string, userData: UserI) => void
): Promise<AxiosResponse<AuthResponse>> => {
  try {
    const token = getToken(); // Retrieve the token from localStorage
    if (!token) {
      throw new Error("No token found. Please log in again.");
    }

    console.log("Sending to edit: ", userEdit);

    const response = await axios.post<AuthResponse>(`${AUTH_URL}/edit`, userEdit, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Attach the token
      },
    });

    // If the server responds with new token and user data, update the state
    if (response.data.token && response.data.user) {
      handleLogin(response.data.token, response.data.user);
    }

    return response;
  } catch (error) {
    // Handle errors more gracefully
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Your session may have expired. Please log in again.");
      }
    } else {
      console.error("Unexpected error:", error);
    }
    throw error; // Rethrow error for higher-level handling
  }
};