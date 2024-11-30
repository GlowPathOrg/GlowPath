import axios, { AxiosResponse } from "axios";
import { RegisterDataI, LoginDataI, UserI } from "../Types/User";



// Base URL for the backend API
const BACKEND_URL = "http://localhost:3002/auth";
// Get the stored token from localStorage
export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

export interface AuthResponse {
  token?: string;
  message?: string;
  user?: UserI;
}

// Register a new user
export const register = async (userData: RegisterDataI, handleLogin: (token: string, userData: UserI) => void
): Promise<AxiosResponse<AuthResponse> | undefined> => {
  try {
    const response = await axios.post<AuthResponse>(`${BACKEND_URL}/register`, userData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (response && response.data.token) {
      localStorage.setItem("token", response.data.token);
      if (response.data.user) {
        const user: UserI = response.data.user
        handleLogin(response.data.token, user);

      }

      return response
    };


  }
  catch (error) {
    console.log('auth service error on register: ', error)
    throw error;
  }
}


// Log in a user and store the token in localStorage
export const login = async (userData: LoginDataI, handleLogin: (token: string, userData: UserI) => void
): Promise<AxiosResponse<AuthResponse>> => {
  try {
    const response = await axios.post<AuthResponse>(`${BACKEND_URL}/login`, userData, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',

      }
    });

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    if (response.data.user) {
        const user: UserI = response.data.user
    handleLogin(response.data.token, user);


      }
    }
    return response

  }
    catch (error) {
      console.log('service error logging in: ', error)
    throw error
  }
};

export const profile = async () => {

  try {
    const token = getToken();
    const response = await axios.get<AuthResponse>(`${BACKEND_URL}/me`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      }
    });
      return response;
  }
      catch (error) {
        console.log('error loading profile', error);
      throw error;
  }
};

// Log out the user by removing the token from localStorage
export const logout = (): void => {
        localStorage.removeItem("token");
};


