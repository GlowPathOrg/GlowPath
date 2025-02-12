import axios, { AxiosResponse } from "axios";
import { RegisterDataI, LoginDataI, UserI } from "../Types/User";


// CHANGE BACK TO HEROKU FOR DEPLOYMENT
const AUTH_URL = "https://glowpath-a7681fe09c29.herokuapp.com" + '/auth';
// Get the stored token from localStorage
export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

export interface AuthResponse {
  token?: string;
  message?: string;
  updated?: UserI;
  user?: UserI;
}


export const registerService = async (userData: RegisterDataI): Promise<AxiosResponse<AuthResponse> | undefined> => {
  try {
    const response = await axios.post<AuthResponse>(`${AUTH_URL}/register`, userData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (response && response.data.token) {
      return response
    };


  }
  catch (error) {
    console.log('auth service error on register: ', error)
    throw error;
  }
}


export const loginService = async (userData: LoginDataI): Promise<AxiosResponse<AuthResponse>> => {
  try {

    const response = await axios.post<AuthResponse>(`${AUTH_URL}/login`, userData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    return response

  }
  catch (error) {
    console.log('service error logging in: ', error)
    throw error
  }
};

export const editProfileService = async (
  userEdit: {
    [key: string]: string;
  } & { _id: string },
  setUser: (user: UserI) => void
): Promise<AxiosResponse<AuthResponse> | undefined> => {

  try {
    const token = getToken();

    console.log('sending to edit: ', userEdit);

    const response = await axios.post<AuthResponse>(`${AUTH_URL}/edit`, userEdit, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });
    if (response?.data.updated) {
      console.log("Updated user: ", response.data.updated);

      // ✅ Update context and localStorage
      setUser(response.data.updated);
      localStorage.setItem("userData", JSON.stringify(response.data.updated));
    }

    return response;

  } catch (error) {
    console.log('error editing profile', error);
    throw error;
  }
};



