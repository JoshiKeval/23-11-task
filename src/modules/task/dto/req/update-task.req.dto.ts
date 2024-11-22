import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from 'src/core/interfaces';

export class UpdateTaskReqDto {
  @ApiPropertyOptional({
    name: 'description',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly description?: string;

  @ApiProperty({ name: 'taskStatus', required: false, enum: TaskStatus })
  @IsOptional()
  @IsEnum(TaskStatus)
  readonly taskStatus?: TaskStatus;
}
