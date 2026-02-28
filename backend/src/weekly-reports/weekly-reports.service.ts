import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WeeklyReport } from './weekly-report.entity';
import { CreateWeeklyReportDto } from './dto/create-weekly-report.dto';
import { EmployeesService } from '../employees/employees.service';

@Injectable()
export class WeeklyReportsService {
  constructor(
    @InjectRepository(WeeklyReport)
    private readonly weeklyReportRepository: Repository<WeeklyReport>,
    private readonly employeesService: EmployeesService,
  ) {}

  async findAllForEmployee(employeeId: number): Promise<WeeklyReport[]> {
    await this.employeesService.findOne(employeeId);
    return this.weeklyReportRepository.find({
      where: { employeeId },
      order: { weekStartDate: 'DESC' },
      relations: ['activities'],
    });
  }

  async findOne(id: number): Promise<WeeklyReport> {
    const report = await this.weeklyReportRepository.findOne({
      where: { id },
      relations: ['activities', 'employee'],
    });
    if (!report) {
      throw new NotFoundException(`Weekly report with id ${id} not found`);
    }
    return report;
  }

  async findOrCreate(dto: CreateWeeklyReportDto): Promise<WeeklyReport> {
    await this.employeesService.findOne(dto.employeeId);
    let report = await this.weeklyReportRepository.findOne({
      where: {
        employeeId: dto.employeeId,
        weekStartDate: dto.weekStartDate,
      },
      relations: ['activities'],
    });
    if (!report) {
      report = this.weeklyReportRepository.create({
        employeeId: dto.employeeId,
        weekStartDate: dto.weekStartDate,
      });
      await this.weeklyReportRepository.save(report);
      report.activities = [];
    }
    return report;
  }
}
