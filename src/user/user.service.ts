import { Injectable } from '@nestjs/common';
import { DbServiceBase } from '../generic/db-service.base';
import { BaseUserRole, User, USER_SCHEMA_TOKEN } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { v4 as uuidV4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import {JwtService} from '@nestjs/jwt';
@Injectable()
export class UserService extends DbServiceBase<User> {
  constructor(@InjectModel(USER_SCHEMA_TOKEN) private userModel: Model<User>,
              private jwtService: JwtService) {
    super(userModel);
  }
  async createUser(user: Partial<User>): Promise<HydratedDocument<User>> {
    const userCopy: User = user as User;
    userCopy.verificationCode = uuidV4();
    userCopy.verificationEmailSent = false;
    userCopy.role = BaseUserRole.USER;
    return this.create({
      ...(userCopy as any),
      password: this.hashPassword(user.password),
    });
  }

  async addNewRefreshToken(user: HydratedDocument<User>): Promise<HydratedDocument<User>> {
    user.refreshToken =uuidV4();
    await user.save();
    return user;
  }
  private hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  public comparePassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }
  removePassword(user: User | User[]) {
    if (Array.isArray(user)) {
      return user.map((u) => {
        delete u.password;
        return u;
      });
    }
    delete user.password;
    return user;
  }

  async validateUser(
    username: string,
    pass: string,
  ): Promise<null | User> {
    const user = await this.userModel.findOne({username: username});
    if (!user) {
      return null;
    }
    if (
      this.comparePassword(pass, user.password) /*&&
      user.isVerified*/
    ) {
      /*if(!user.isVerified) {
        throw new Error('User not verified');
      }*/
      // const { password, ...result } = user;
      delete user.password;
      return user.toJSON();
    }
    return null;
  }

  async login(user: User | null) {
    if(!user) {
      throw new Error('User Not Found');
    }
    return {
      access_token: this.jwtService.sign({...this.removePassword(user)}),
    };
  }
}
