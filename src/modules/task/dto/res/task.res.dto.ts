import { ApiProperty } from '@nestjs/swagger';

export class Task {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  status: string;

  constructor(id: string, name: string, description: string, status: string) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.status = status;
  }
}

export class TaskResDto {
  @ApiProperty({ type: Task, isArray: true })
  readonly tasks: Task[];
  constructor(tasks: any[]) {
    this.tasks = tasks.map((i) => new Task(i?.id, i?.name, i?.desc, i?.status));
  }
}
