import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { WeeklyReportsService } from './weekly-reports.service';
import { CreateWeeklyReportDto } from './dto/create-weekly-report.dto';
import { WeeklyReport } from './weekly-report.entity';

@Controller()
export class WeeklyReportsController {
  constructor(private readonly weeklyReportsService: WeeklyReportsService) {}

  @Get('employees/:employeeId/weekly-reports')
  findAllForEmployee(
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ): Promise<WeeklyReport[]> {
    return this.weeklyReportsService.findAllForEmployee(employeeId);
  }

  @Get('weekly-reports/:id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<WeeklyReport> {
    return this.weeklyReportsService.findOne(id);
  }

  @Post('weekly-reports')
  findOrCreate(@Body() dto: CreateWeeklyReportDto): Promise<WeeklyReport> {
    return this.weeklyReportsService.findOrCreate(dto);
  }
}
