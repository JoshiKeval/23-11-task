import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { AddTaskReqDto, GetTaskQueryDto, UpdateTaskReqDto } from './dto/req';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TaskResDto } from './dto/res';
import { TransformInterceptor } from '@core/interceptor';
import { UserAuthGuard } from '@core/guard';
import { GetSession } from '@core/decorators';
import { User } from '@core/interfaces';

@ApiTags('Task Apis')
@ApiBearerAuth()
@UseInterceptors(TransformInterceptor)
@UseGuards(UserAuthGuard)
@Controller('task')
export class TaskController {
  constructor(private readonly service: TaskService) {}

  @Post('/')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Api for Add task',
    description: 'Api for Add task',
  })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  async addTask(@Body() payload: AddTaskReqDto, @GetSession() user: User) {
    return { message: await this.service.addTask(payload, user?.id) };
  }

  @Patch('/:taskId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Api for Update task',
    description: 'Api for Update task',
  })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  async updateTask(
    @Body() payload: UpdateTaskReqDto,
    @GetSession() user: User,
    @Param('taskId') taskId: string,
  ) {
    return {
      message: await this.service.updateTask(payload, user?.id, taskId),
    };
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Api for get task',
    description: 'Api for get task',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: TaskResDto,
  })
  async getTask(@Query() query: GetTaskQueryDto, @GetSession() user: User) {
    return {
      data: await this.service.getTask(query, user?.id),
    };
  }

  @Delete('/:taskId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Api for delete task',
    description: 'Api for delete task',
  })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  async deleteTask(@Param('taskId') taskId: string, @GetSession() user: User) {
    return {
      data: await this.service.deleteTask(user?.id, taskId),
    };
  }
}
