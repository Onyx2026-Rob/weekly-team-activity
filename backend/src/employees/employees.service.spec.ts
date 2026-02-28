import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { Employee } from './employee.entity';

const mockEmployee: Employee = {
  id: 1,
  fullName: 'Gino Motyka',
  email: 'gino@example.com',
  createdAt: new Date('2024-01-01'),
  weeklyReports: [],
};

const mockEmployeeRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
};

describe('EmployeesService', () => {
  let service: EmployeesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeesService,
        {
          provide: getRepositoryToken(Employee),
          useValue: mockEmployeeRepository,
        },
      ],
    }).compile();

    service = module.get<EmployeesService>(EmployeesService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all employees ordered by fullName', async () => {
      const employees = [mockEmployee, { ...mockEmployee, id: 2, fullName: 'Todd Allen' }];
      mockEmployeeRepository.find.mockResolvedValue(employees);

      const result = await service.findAll();

      expect(result).toEqual(employees);
      expect(mockEmployeeRepository.find).toHaveBeenCalledWith({
        order: { fullName: 'ASC' },
      });
    });

    it('should return an empty array when no employees exist', async () => {
      mockEmployeeRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return an employee when found', async () => {
      mockEmployeeRepository.findOne.mockResolvedValue(mockEmployee);

      const result = await service.findOne(1);

      expect(result).toEqual(mockEmployee);
      expect(mockEmployeeRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException when employee does not exist', async () => {
      mockEmployeeRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow('Employee with id 999 not found');
    });
  });
});
