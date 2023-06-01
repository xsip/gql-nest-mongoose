import {Args, Int, Mutation, Query, Resolver} from '@nestjs/graphql';
import {UserGqlModel} from './models/user-gql.model';
import {UserService} from './user.service';
import {JwtAuthGuard} from '../generic/jwt.guard';
import {UseGuards} from '@nestjs/common';
import {v4 as uuidV4} from 'uuid';
import {RefreshTokenResponseModel} from './models/refresh-token-response.model';
import {AuthUser, GqlUser} from '../generic/jwt.strategy';
import {User} from './schemas/user.schema';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [UserGqlModel])
  async allUsers(/*@Args('id', { type: () => Int }) id: number*/) {
    return this.userService.removePassword(await this.userService.findAll());
  }
  @Query(() => UserGqlModel)
  async userById(@Args('id') id: string) {
    return this.userService.removePassword(await this.userService.findById(id));
  }
  @UseGuards(JwtAuthGuard)
  @Query(() => String)
  async getRefreshToken(@GqlUser() user: User): Promise<string> {
    const _user = await this.userService.findOne({username: user.username});
    return _user.refreshToken;
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => RefreshTokenResponseModel)
  async handleRefreshToken(@Args('refreshToken', { type: () => String }) refreshToken: number): Promise<RefreshTokenResponseModel> {
    const user = await this.userService.findOne({refreshToken});
    if(!user) {
      throw new Error('Invalid RefreshToken');
    }
    await this.userService.addNewRefreshToken(user);
    const token = (await this.userService.login(user.toJSON())).access_token;
    return {token , refreshToken: user.refreshToken };
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
        refreshToken: uuidV4()
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
