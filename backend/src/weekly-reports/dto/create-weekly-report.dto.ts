import { IsDateString, IsInt, IsPositive } from 'class-validator';

export class CreateWeeklyReportDto {
  @IsInt()
  @IsPositive()
  employeeId: number;

  @IsDateString()
  weekStartDate: string;
}
