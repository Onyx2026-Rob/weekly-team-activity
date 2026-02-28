import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { WeeklyReport } from '../weekly-reports/weekly-report.entity';

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'weekly_report_id' })
  weeklyReportId: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  roadblocks: string;

  @Column({ name: 'percent_complete', type: 'int', default: 0 })
  percentComplete: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => WeeklyReport, (report) => report.activities, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'weekly_report_id' })
  weeklyReport: WeeklyReport;
}
