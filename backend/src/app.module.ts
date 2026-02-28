import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesModule } from './employees/employees.module';
import { WeeklyReportsModule } from './weekly-reports/weekly-reports.module';
import { ActivitiesModule } from './activities/activities.module';
import { Employee } from './employees/employee.entity';
import { WeeklyReport } from './weekly-reports/weekly-report.entity';
import { Activity } from './activities/activity.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      username: process.env.DATABASE_USERNAME || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      database: process.env.DATABASE_NAME || 'weekly_activity',
      entities: [Employee, WeeklyReport, Activity],
      synchronize: false,
      migrationsRun: false,
    }),
    EmployeesModule,
    WeeklyReportsModule,
    ActivitiesModule,
  ],
})
export class AppModule {}
