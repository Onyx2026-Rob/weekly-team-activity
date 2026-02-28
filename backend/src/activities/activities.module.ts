import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './activity.entity';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { WeeklyReportsModule } from '../weekly-reports/weekly-reports.module';

@Module({
  imports: [TypeOrmModule.forFeature([Activity]), WeeklyReportsModule],
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
})
export class ActivitiesModule {}
