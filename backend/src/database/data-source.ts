import { DataSource } from 'typeorm';
import { Employee } from '../employees/employee.entity';
import { WeeklyReport } from '../weekly-reports/weekly-report.entity';
import { Activity } from '../activities/activity.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'weekly_activity',
  entities: [Employee, WeeklyReport, Activity],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
});
