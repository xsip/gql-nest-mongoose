import {ExtractJwt, Strategy} from 'passport-jwt';
import {PassportStrategy} from '@nestjs/passport';
import {createParamDecorator, ExecutionContext, Inject, Injectable,} from '@nestjs/common';

import {Document} from 'mongoose';
import {UserService} from '../user/user.service';
import {User} from '../user/schemas/user.schema';
import {GqlExecutionContext} from '@nestjs/graphql';
import * as fs from 'fs';

export const AuthUser = createParamDecorator((data, req) => {
  return req.args[0].user;
});
export const GqlUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    if (context.getType() === "http") {
      return context.switchToHttp().getResponse(); // <- I think this is right
    }

    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.res.req.user;// ctx.getContext().req.args[0].user;
    // ^ Is this right? How do you get the response object?
    // My intellisence isn't showing it properly
  },
);

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('JwtSecret') jwtSecret: string,
    public userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: User & Document) {
    const foundUser = await this.userService.findById(
      payload._id,
    );
    return foundUser;
  }
}