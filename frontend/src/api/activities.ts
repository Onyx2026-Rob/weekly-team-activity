import apiClient from './client';
import { Activity, CreateActivityPayload } from './types';

export const createActivity = async (
  weeklyReportId: number,
  payload: CreateActivityPayload,
): Promise<Activity> => {
  const response = await apiClient.post<Activity>(
    `/weekly-reports/${weeklyReportId}/activities`,
    payload,
  );
  return response.data;
};

export const deleteActivity = async (id: number): Promise<void> => {
  await apiClient.delete(`/activities/${id}`);
};
