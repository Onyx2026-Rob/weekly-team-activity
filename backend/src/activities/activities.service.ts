import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { WeeklyReportsService } from '../weekly-reports/weekly-reports.service';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    private readonly weeklyReportsService: WeeklyReportsService,
  ) {}

  async create(
    weeklyReportId: number,
    dto: CreateActivityDto,
  ): Promise<Activity> {
    await this.weeklyReportsService.findOne(weeklyReportId);
    const activity = this.activityRepository.create({
      ...dto,
      weeklyReportId,
    });
    return this.activityRepository.save(activity);
  }

  async remove(id: number): Promise<void> {
    const activity = await this.activityRepository.findOne({ where: { id } });
    if (!activity) {
      throw new NotFoundException(`Activity with id ${id} not found`);
    }
    await this.activityRepository.remove(activity);
  }
}
