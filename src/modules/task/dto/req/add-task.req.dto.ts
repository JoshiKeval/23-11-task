import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TaskStatus } from 'src/core/interfaces';

export class AddTaskReqDto {
  @ApiProperty({
    name: 'taskName',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly taskName: string;

  @ApiProperty({
    name: 'description',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @ApiProperty({ name: 'taskStatus', required: true, enum: TaskStatus })
  @IsEnum(TaskStatus)
  readonly taskStatus: TaskStatus;
}
