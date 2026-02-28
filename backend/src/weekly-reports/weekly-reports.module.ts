import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeeklyReport } from './weekly-report.entity';
import { WeeklyReportsController } from './weekly-reports.controller';
import { WeeklyReportsService } from './weekly-reports.service';
import { EmployeesModule } from '../employees/employees.module';

@Module({
  imports: [TypeOrmModule.forFeature([WeeklyReport]), EmployeesModule],
  controllers: [WeeklyReportsController],
  providers: [WeeklyReportsService],
  exports: [WeeklyReportsService],
})
export class WeeklyReportsModule {}
