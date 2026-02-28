export interface Employee {
  id: number;
  fullName: string;
  email: string;
  createdAt: string;
}

export interface Activity {
  id: number;
  weeklyReportId: number;
  title: string;
  description: string | null;
  roadblocks: string | null;
  percentComplete: number;
  createdAt: string;
}

export interface WeeklyReport {
  id: number;
  employeeId: number;
  weekStartDate: string;
  createdAt: string;
  activities: Activity[];
}

export interface CreateActivityPayload {
  title: string;
  description?: string;
  roadblocks?: string;
  percentComplete: number;
}
