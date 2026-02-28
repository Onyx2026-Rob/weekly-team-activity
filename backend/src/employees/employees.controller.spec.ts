import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { Employee } from './employee.entity';

const mockEmployee: Employee = {
  id: 1,
  fullName: 'Gino Motyka',
  email: 'gino@example.com',
  createdAt: new Date('2024-01-01'),
  weeklyReports: [],
};

const mockEmployeesService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
};

describe('EmployeesController', () => {
  let controller: EmployeesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeesController],
      providers: [
        {
          provide: EmployeesService,
          useValue: mockEmployeesService,
        },
      ],
    }).compile();

    controller = module.get<EmployeesController>(EmployeesController);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all employees', async () => {
      const employees = [mockEmployee];
      mockEmployeesService.findAll.mockResolvedValue(employees);

      const result = await controller.findAll();

      expect(result).toEqual(employees);
      expect(mockEmployeesService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when no employees exist', async () => {
      mockEmployeesService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a single employee by id', async () => {
      mockEmployeesService.findOne.mockResolvedValue(mockEmployee);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockEmployee);
      expect(mockEmployeesService.findOne).toHaveBeenCalledWith(1);
    });

    it('should propagate NotFoundException from service', async () => {
      mockEmployeesService.findOne.mockRejectedValue(
        new NotFoundException('Employee with id 999 not found'),
      );

      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });
});
