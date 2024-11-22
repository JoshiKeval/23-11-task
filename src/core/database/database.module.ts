import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './mongodb/schema/user';
import { Task, TaskSchema } from './mongodb/schema/task';
import { MongoConnectionModule } from './mongodb/connection';
import { S3Service } from '@core/aws';

@Global()
@Module({
  imports: [
    MongoConnectionModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Task.name, schema: TaskSchema },
    ]),
  ],
  providers: [S3Service],
  exports: [MongooseModule, S3Service],
})
export class DatabaseModule {}
