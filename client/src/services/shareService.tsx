import { AxiosResponse } from 'axios';
import api from './apiService';
import { RouteI } from '../Types/Route';
import { getToken } from './authService';




export const createShare = (route: RouteI): Promise<AxiosResponse> => {
  const token = getToken();
  if (!token) {
    return Promise.reject(new Error("User is not authenticated. No token found."));
  }
  return api.post(
    "/share",
    { route },
    {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    }
  );
}


export const accessShare = (_id: string, password: string): Promise<AxiosResponse> => {
  return api.post("/share/" + _id, {
    password
  });
}