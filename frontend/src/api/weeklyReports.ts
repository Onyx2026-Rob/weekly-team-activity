import apiClient from './client';
import { WeeklyReport } from './types';

export const getWeeklyReports = async (
  employeeId: number,
): Promise<WeeklyReport[]> => {
  const response = await apiClient.get<WeeklyReport[]>(
    `/employees/${employeeId}/weekly-reports`,
  );
  return response.data;
};

export const getWeeklyReport = async (id: number): Promise<WeeklyReport> => {
  const response = await apiClient.get<WeeklyReport>(`/weekly-reports/${id}`);
  return response.data;
};

export const findOrCreateWeeklyReport = async (
  employeeId: number,
  weekStartDate: string,
): Promise<WeeklyReport> => {
  const response = await apiClient.post<WeeklyReport>('/weekly-reports', {
    employeeId,
    weekStartDate,
  });
  return response.data;
};
