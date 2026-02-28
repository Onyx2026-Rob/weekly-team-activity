import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { Activity } from './activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';

const mockActivity: Activity = {
  id: 1,
  title: 'Write unit tests',
  description: 'Add coverage for controllers',
  roadblocks: 'none',
  percentComplete: 80,
  weeklyReportId: 1,
  createdAt: new Date('2024-01-01'),
  weeklyReport: null as any,
};

const mockActivitiesService = {
  create: jest.fn(),
  remove: jest.fn(),
};

describe('ActivitiesController', () => {
  let controller: ActivitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivitiesController],
      providers: [
        {
          provide: ActivitiesService,
          useValue: mockActivitiesService,
        },
      ],
    }).compile();

    controller = module.get<ActivitiesController>(ActivitiesController);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and return an activity', async () => {
      const dto: CreateActivityDto = {
        title: 'Write unit tests',
        description: 'Add coverage for controllers',
        roadblocks: 'none',
        percentComplete: 80,
      };
      mockActivitiesService.create.mockResolvedValue(mockActivity);

      const result = await controller.create(1, dto);

      expect(result).toEqual(mockActivity);
      expect(mockActivitiesService.create).toHaveBeenCalledWith(1, dto);
    });

    it('should propagate NotFoundException when weekly report does not exist', async () => {
      const dto: CreateActivityDto = { title: 'Test', percentComplete: 0 };
      mockActivitiesService.create.mockRejectedValue(
        new NotFoundException('Weekly report with id 999 not found'),
      );

      await expect(controller.create(999, dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete an activity and return void', async () => {
      mockActivitiesService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(1);

      expect(result).toBeUndefined();
      expect(mockActivitiesService.remove).toHaveBeenCalledWith(1);
    });

    it('should propagate NotFoundException when activity does not exist', async () => {
      mockActivitiesService.remove.mockRejectedValue(
        new NotFoundException('Activity with id 999 not found'),
      );

      await expect(controller.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
