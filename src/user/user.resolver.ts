import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserGqlModel } from './models/user-gql.model';
import { UserService } from './user.service';
import {JwtAuthGuard} from '../generic/jwt.guard';
import {UseGuards} from '@nestjs/common';
import {AuthService} from '../generic/auth.service';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  // @UseGuards(JwtAuthGuard)
  @Query(() => [UserGqlModel])
  async allUsers(/*@Args('id', { type: () => Int }) id: number*/) {
    return this.userService.removePassword(await this.userService.findAll());
  }
  @Query(() => UserGqlModel)
  async userById(@Args('id') id: string) {
    return this.userService.removePassword(await this.userService.findById(id));
  }

  @Mutation(() => UserGqlModel)
  async register(
    @Args('username') username: string,
    @Args('password') password: string,
    @Args('email') email: string,
  ) {
    return this.userService.removePassword(
      await this.userService.createUser({
        username,
        password,
        email,
      }),
    );
  }
  @Query(() => String)
  async login(
    @Args('username') username: string,
    @Args('password') password: string,
  ) {
    return (await this.userService.login(await this.userService.validateUser(username,password))).access_token;
  }
}
