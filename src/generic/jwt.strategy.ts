import {ExtractJwt, Strategy} from 'passport-jwt';
import {PassportStrategy} from '@nestjs/passport';
import {createParamDecorator, Inject, Injectable,} from '@nestjs/common';

import {Document} from 'mongoose';
import {UserService} from '../user/user.service';
import {User} from '../user/schemas/user.schema';

export const AuthUser = createParamDecorator((data, req) => {
  return req.args[0].user;
});

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