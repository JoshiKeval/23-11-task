import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Task } from './task';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  hashedPassword: string;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop()
  emailVerificationToken: string;

  @Prop()
  status: string;

  @Prop()
  emailVerifiedAt: Date;

  @Prop()
  avatar: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: Task.name }] })
  tasks: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
