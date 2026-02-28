import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { validate } from 'class-validator';
import { ActivitiesService } from './activities.service';
import { Activity } from './activity.entity';
import { WeeklyReportsService } from '../weekly-reports/weekly-reports.service';
import { CreateActivityDto } from './dto/create-activity.dto';

const mockActivityRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
};

const mockWeeklyReportsService = {
  findOne: jest.fn(),
};

describe('ActivitiesService', () => {
  let service: ActivitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivitiesService,
        {
          provide: getRepositoryToken(Activity),
          useValue: mockActivityRepository,
        },
        {
          provide: WeeklyReportsService,
          useValue: mockWeeklyReportsService,
        },
      ],
    }).compile();

    service = module.get<ActivitiesService>(ActivitiesService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an activity', async () => {
      const dto: CreateActivityDto = {
        title: 'Task 1',
        description: 'desc',
        roadblocks: 'none',
        percentComplete: 50,
      };
      mockWeeklyReportsService.findOne.mockResolvedValue({ id: 1 });
      mockActivityRepository.create.mockReturnValue({ ...dto, weeklyReportId: 1 });
      mockActivityRepository.save.mockResolvedValue({ id: 1, ...dto, weeklyReportId: 1 });

      const result = await service.create(1, dto);
      expect(result.title).toBe('Task 1');
      expect(result.percentComplete).toBe(50);
    });

    it('should throw NotFoundException if weekly report not found', async () => {
      mockWeeklyReportsService.findOne.mockRejectedValue(
        new NotFoundException('Weekly report not found'),
      );
      await expect(
        service.create(999, { title: 'Test', percentComplete: 0 }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove an activity', async () => {
      mockActivityRepository.findOne.mockResolvedValue({ id: 1, title: 'test' });
      mockActivityRepository.remove.mockResolvedValue(undefined);

      await service.remove(1);
      expect(mockActivityRepository.remove).toHaveBeenCalledWith({ id: 1, title: 'test' });
    });

    it('should throw NotFoundException if activity not found', async () => {
      mockActivityRepository.findOne.mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});

describe('CreateActivityDto validation', () => {
  it('should reject percentComplete below 0', async () => {
    const dto = new CreateActivityDto();
    dto.title = 'Test';
    dto.percentComplete = -1;
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'percentComplete')).toBe(true);
  });

  it('should reject percentComplete above 100', async () => {
    const dto = new CreateActivityDto();
    dto.title = 'Test';
    dto.percentComplete = 101;
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'percentComplete')).toBe(true);
  });

  it('should accept percentComplete of 0', async () => {
    const dto = new CreateActivityDto();
    dto.title = 'Test';
    dto.percentComplete = 0;
    const errors = await validate(dto);
    expect(errors.filter((e) => e.property === 'percentComplete')).toHaveLength(0);
  });

  it('should accept percentComplete of 100', async () => {
    const dto = new CreateActivityDto();
    dto.title = 'Test';
    dto.percentComplete = 100;
    const errors = await validate(dto);
    expect(errors.filter((e) => e.property === 'percentComplete')).toHaveLength(0);
  });

  it('should reject non-integer percentComplete', async () => {
    const dto = new CreateActivityDto();
    dto.title = 'Test';
    (dto as any).percentComplete = 50.5;
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'percentComplete')).toBe(true);
  });

  it('should reject missing title', async () => {
    const dto = new CreateActivityDto();
    dto.percentComplete = 50;
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'title')).toBe(true);
  });
});
