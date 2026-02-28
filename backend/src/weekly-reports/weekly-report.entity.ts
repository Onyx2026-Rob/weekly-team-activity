import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Employee } from '../employees/employee.entity';
import { Activity } from '../activities/activity.entity';

@Entity('weekly_reports')
@Unique(['employeeId', 'weekStartDate'])
export class WeeklyReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'employee_id' })
  employeeId: number;

  @Column({ name: 'week_start_date', type: 'date' })
  weekStartDate: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Employee, (employee) => employee.weeklyReports)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @OneToMany(() => Activity, (activity) => activity.weeklyReport, {
    cascade: true,
  })
  activities: Activity[];
}
