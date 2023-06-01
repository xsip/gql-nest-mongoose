import { Field, ObjectType } from '@nestjs/graphql';
import { BaseUserRole } from '../schemas/user.schema';

@ObjectType()
export class UserGqlModel {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  password: string;

  @Field({ nullable: true })
  verificationCode: string;

  @Field({ nullable: true })
  verificationEmailSent: boolean;

  @Field({ nullable: true })
  refreshToken?: string;

  @Field()
  role?: BaseUserRole;
}
