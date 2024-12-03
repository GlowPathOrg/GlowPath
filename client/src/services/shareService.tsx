import { AxiosResponse } from 'axios';
import api from './apiService';

// TODO: Replace with actual types
export interface RouteI {
  [key: string]: any;
}

export interface UserI {
  // This will probably come from the auth service?
}

export interface ShareI {
  id: string;
  owner?: UserI;
  route?: RouteI;
  password?: string;
}

// Returns info about the created share or error
export const createShare = (route: RouteI): Promise<AxiosResponse> => {
  return api.post("/share", {
    route
  });
}

// Returns info about the accessed share or error
export const accessShare = (id: string, password: string): Promise<AxiosResponse> => {
  return api.post("/share/" + id, {
    password
  });
}