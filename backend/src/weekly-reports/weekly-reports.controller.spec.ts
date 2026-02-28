import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { WeeklyReportsController } from './weekly-reports.controller';
import { WeeklyReportsService } from './weekly-reports.service';
import { WeeklyReport } from './weekly-report.entity';
import { CreateWeeklyReportDto } from './dto/create-weekly-report.dto';

const mockWeeklyReport: WeeklyReport = {
  id: 1,
  employeeId: 1,
  weekStartDate: '2024-01-01',
  createdAt: new Date('2024-01-01'),
  employee: null as any,
  activities: [],
};

const mockWeeklyReportsService = {
  findAllForEmployee: jest.fn(),
  findOne: jest.fn(),
  findOrCreate: jest.fn(),
};

describe('WeeklyReportsController', () => {
  let controller: WeeklyReportsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeeklyReportsController],
      providers: [
        {
          provide: WeeklyReportsService,
          useValue: mockWeeklyReportsService,
        },
      ],
    }).compile();

    controller = module.get<WeeklyReportsController>(WeeklyReportsController);
    jest.clearAllMocks();
  });

  describe('findAllForEmployee', () => {
    it('should return all weekly reports for an employee', async () => {
      mockWeeklyReportsService.findAllForEmployee.mockResolvedValue([mockWeeklyReport]);

      const result = await controller.findAllForEmployee(1);

      expect(result).toEqual([mockWeeklyReport]);
      expect(mockWeeklyReportsService.findAllForEmployee).toHaveBeenCalledWith(1);
    });

    it('should propagate NotFoundException when employee does not exist', async () => {
      mockWeeklyReportsService.findAllForEmployee.mockRejectedValue(
        new NotFoundException('Employee with id 999 not found'),
      );

      await expect(controller.findAllForEmployee(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return a weekly report by id', async () => {
      mockWeeklyReportsService.findOne.mockResolvedValue(mockWeeklyReport);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockWeeklyReport);
      expect(mockWeeklyReportsService.findOne).toHaveBeenCalledWith(1);
    });

    it('should propagate NotFoundException when report does not exist', async () => {
      mockWeeklyReportsService.findOne.mockRejectedValue(
        new NotFoundException('Weekly report with id 999 not found'),
      );

      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOrCreate', () => {
    it('should return an existing or newly created weekly report', async () => {
      const dto: CreateWeeklyReportDto = { employeeId: 1, weekStartDate: '2024-01-01' };
      mockWeeklyReportsService.findOrCreate.mockResolvedValue(mockWeeklyReport);

      const result = await controller.findOrCreate(dto);

      expect(result).toEqual(mockWeeklyReport);
      expect(mockWeeklyReportsService.findOrCreate).toHaveBeenCalledWith(dto);
    });

    it('should propagate NotFoundException when employee does not exist', async () => {
      const dto: CreateWeeklyReportDto = { employeeId: 999, weekStartDate: '2024-01-01' };
      mockWeeklyReportsService.findOrCreate.mockRejectedValue(
        new NotFoundException('Employee with id 999 not found'),
      );

      await expect(controller.findOrCreate(dto)).rejects.toThrow(NotFoundException);
    });
  });
});
