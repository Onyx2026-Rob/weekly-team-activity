import {
  Controller,
  Post,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { Activity } from './activity.entity';

@Controller()
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post('weekly-reports/:weeklyReportId/activities')
  create(
    @Param('weeklyReportId', ParseIntPipe) weeklyReportId: number,
    @Body() dto: CreateActivityDto,
  ): Promise<Activity> {
    return this.activitiesService.create(weeklyReportId, dto);
  }

  @Delete('activities/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.activitiesService.remove(id);
  }
}
