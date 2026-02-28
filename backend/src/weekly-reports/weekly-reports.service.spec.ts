import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { WeeklyReportsService } from './weekly-reports.service';
import { WeeklyReport } from './weekly-report.entity';
import { EmployeesService } from '../employees/employees.service';
import { CreateWeeklyReportDto } from './dto/create-weekly-report.dto';

const mockWeeklyReport: WeeklyReport = {
  id: 1,
  employeeId: 1,
  weekStartDate: '2024-01-01',
  createdAt: new Date('2024-01-01'),
  employee: null as any,
  activities: [],
};

const mockWeeklyReportRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

const mockEmployeesService = {
  findOne: jest.fn(),
};

describe('WeeklyReportsService', () => {
  let service: WeeklyReportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeeklyReportsService,
        {
          provide: getRepositoryToken(WeeklyReport),
          useValue: mockWeeklyReportRepository,
        },
        {
          provide: EmployeesService,
          useValue: mockEmployeesService,
        },
      ],
    }).compile();

    service = module.get<WeeklyReportsService>(WeeklyReportsService);
    jest.clearAllMocks();
  });

  describe('findAllForEmployee', () => {
    it('should return all weekly reports for an employee', async () => {
      mockEmployeesService.findOne.mockResolvedValue({ id: 1 });
      mockWeeklyReportRepository.find.mockResolvedValue([mockWeeklyReport]);

      const result = await service.findAllForEmployee(1);

      expect(result).toEqual([mockWeeklyReport]);
      expect(mockEmployeesService.findOne).toHaveBeenCalledWith(1);
      expect(mockWeeklyReportRepository.find).toHaveBeenCalledWith({
        where: { employeeId: 1 },
        order: { weekStartDate: 'DESC' },
        relations: ['activities'],
      });
    });

    it('should throw NotFoundException if employee does not exist', async () => {
      mockEmployeesService.findOne.mockRejectedValue(
        new NotFoundException('Employee with id 999 not found'),
      );

      await expect(service.findAllForEmployee(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return a weekly report with activities and employee', async () => {
      mockWeeklyReportRepository.findOne.mockResolvedValue(mockWeeklyReport);

      const result = await service.findOne(1);

      expect(result).toEqual(mockWeeklyReport);
      expect(mockWeeklyReportRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['activities', 'employee'],
      });
    });

    it('should throw NotFoundException when weekly report does not exist', async () => {
      mockWeeklyReportRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow('Weekly report with id 999 not found');
    });
  });

  describe('findOrCreate', () => {
    const dto: CreateWeeklyReportDto = { employeeId: 1, weekStartDate: '2024-01-01' };

    it('should return existing report when one already exists', async () => {
      mockEmployeesService.findOne.mockResolvedValue({ id: 1 });
      mockWeeklyReportRepository.findOne.mockResolvedValue(mockWeeklyReport);

      const result = await service.findOrCreate(dto);

      expect(result).toEqual(mockWeeklyReport);
      expect(mockWeeklyReportRepository.save).not.toHaveBeenCalled();
    });

    it('should create and return a new report when none exists', async () => {
      mockEmployeesService.findOne.mockResolvedValue({ id: 1 });
      mockWeeklyReportRepository.findOne.mockResolvedValue(null);
      mockWeeklyReportRepository.create.mockReturnValue({
        employeeId: 1,
        weekStartDate: '2024-01-01',
      });
      mockWeeklyReportRepository.save.mockResolvedValue(mockWeeklyReport);

      const result = await service.findOrCreate(dto);

      expect(mockWeeklyReportRepository.create).toHaveBeenCalledWith({
        employeeId: 1,
        weekStartDate: '2024-01-01',
      });
      expect(mockWeeklyReportRepository.save).toHaveBeenCalled();
      expect(result.activities).toEqual([]);
    });

    it('should throw NotFoundException if employee does not exist', async () => {
      mockEmployeesService.findOne.mockRejectedValue(
        new NotFoundException('Employee with id 999 not found'),
      );

      await expect(service.findOrCreate({ employeeId: 999, weekStartDate: '2024-01-01' })).rejects.toThrow(NotFoundException);
    });
  });
});
