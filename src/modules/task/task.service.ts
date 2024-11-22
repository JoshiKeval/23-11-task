import { Task } from '@core/database/mongodb/schema';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AddTaskReqDto, GetTaskQueryDto, UpdateTaskReqDto } from './dto/req';
import { ErrorMessages, SuccessMessages } from '@core/utils';
import { TaskResDto } from './dto/res';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async addTask(payload: AddTaskReqDto, userId: string): Promise<string> {
    const { description, taskName, taskStatus } = payload;
    console.log('taskStatus:', description, taskName, taskStatus);
    const task = new this.taskModel({
      name: taskName,
      desc: description,
      status: taskStatus,
      owner: userId,
    });
    await task.save();
    return SuccessMessages.TASK_ADDED;
  }

  async updateTask(
    payload: UpdateTaskReqDto,
    userId: string,
    taskId: string,
  ): Promise<string> {
    const { taskStatus, description } = payload;
    const task = await this.taskModel.findOne({ _id: taskId, owner: userId });
    if (!task) {
      throw new NotFoundException(ErrorMessages.TASK_NOT_EXIST);
    }
    if (taskStatus !== undefined) {
      task.status = taskStatus;
    }
    if (description !== undefined) {
      task.desc = description;
    }
    await task.save();
    return SuccessMessages.TASK_UPDATED;
  }

  async getTask(query: GetTaskQueryDto, userId: string): Promise<TaskResDto> {
    const { description, taskStatus } = query;

    const where = {
      owner: userId,
      ...(description
        ? { description: { $regex: description, $options: 'i' } }
        : {}),
      ...(taskStatus ? { status: taskStatus } : {}),
    };
    const tasks = await this.taskModel.find({ ...where, deletedAt: null });
    return new TaskResDto(tasks);
  }

  async deleteTask(userId: string, taskId: string): Promise<string> {
    console.log(userId, taskId);
    const task = await this.taskModel.findOne({ _id: taskId, owner: userId });
    if (!task) {
      throw new NotFoundException(ErrorMessages.TASK_NOT_EXIST);
    }
    await this.taskModel.deleteOne({ owner: userId, _id: taskId });
    return SuccessMessages.TASK_DELETED;
  }
}
