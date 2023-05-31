import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum BaseUserRole {
  ADMIN = 'Admin',
  USER = 'User',
}

@Schema({ timestamps: true })
export class User {
  @Prop()
  username: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  verificationCode: string;

  @Prop()
  verificationEmailSent: boolean;

  @Prop()
  isVerified: boolean;

  @Prop()
  role?: BaseUserRole;

  @Prop({ required: false })
  createdAt: Date;

  @Prop({ required: false })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
export const USER_SCHEMA_TOKEN = 'User';
