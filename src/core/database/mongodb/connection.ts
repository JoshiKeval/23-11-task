import { MongooseModule } from '@nestjs/mongoose';

export const MongoConnectionModule = MongooseModule.forRoot(
  'mongodb://localhost:27017/task-management',
);
