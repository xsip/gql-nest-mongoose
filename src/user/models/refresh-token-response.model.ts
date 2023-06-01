import {Field, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class RefreshTokenResponseModel {
  @Field()
  refreshToken: string;

  @Field()
  token: string;
}
