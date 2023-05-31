import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {USER_SCHEMA_TOKEN, UserSchema} from './schemas/user.schema';
import {UserService} from './user.service';
import {UserResolver} from './user.resolver';
import {AuthService} from '../generic/auth.service';
import {AuthModule} from '../generic/auth.module';
import {JwtModule} from '@nestjs/jwt';
import {JwtStrategy} from '../generic/jwt.strategy';
import {PassportModule} from '@nestjs/passport';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: USER_SCHEMA_TOKEN, schema: UserSchema},
    ]),
    PassportModule,
    JwtModule.register({
      secret: 'secret123',
      signOptions: { expiresIn: '10h' },
    }),
  ],
  providers: [UserService, UserResolver,
    {provide: 'JwtSecret', useValue: 'secret123'},
    JwtStrategy],
  exports: [UserService]
})
export class UserModule {
  constructor(private userService: UserService) {
    this.userService
      .findAll()
      .then((e) => console.log('Created', e))
      .catch((e) => console.log(e));
  }
}
