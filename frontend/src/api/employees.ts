import apiClient from './client';
import { Employee } from './types';

export const getEmployees = async (): Promise<Employee[]> => {
  const response = await apiClient.get<Employee[]>('/employees');
  return response.data;
};
