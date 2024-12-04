import axios, { AxiosResponse } from "axios";
import { RegisterDataI, LoginDataI, UserI } from "../Types/User";



// Base URL for the backend API
const BACKEND_URL = "https://glowpath-a7681fe09c29.herokuapp.com/auth";
// Get the stored token from localStorage
export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

export interface AuthResponse {
  token?: string;
  message?: string;
  user?: UserI;
}


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


export const login = async (userData: LoginDataI, handleLogin: (token: string, userData: UserI) => void
): Promise<AxiosResponse<AuthResponse>> => {
  try {
    const response = await axios.post<AuthResponse>(`${BACKEND_URL}/login`, userData, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      }
    });

    if (response.data.token && response.data.user) {
    handleLogin(response.data.token, response.data.user);
    }
    return response

  }
    catch (error) {
      console.log('service error logging in: ', error)
    throw error
  }
};

export const editProfile = async (userEdit: { [x: string]: string; password: string; _id: string }, handleLogin: (token: string, userData: UserI)=>void): Promise<AxiosResponse<AuthResponse> | undefined> => {

  try {
    const token = getToken();

    console.log('sending to edit: ', userEdit)
    const response = await axios.post<AuthResponse>(`${BACKEND_URL}/edit`, userEdit, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      }
    });
    if (response.data.token && response.data.user) {
      handleLogin(response.data.token, response.data.user);
    }
    return response;}
      catch (error) {
        console.log('error loading profile', error);
      throw error;
  }
};



