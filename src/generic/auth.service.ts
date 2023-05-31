import {Inject, Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {UserService} from '../user/user.service';
import {User} from '../user/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    public userService: UserService,
    private jwtService: JwtService,
  ) {
  }

}