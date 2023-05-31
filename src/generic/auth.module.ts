import {Module} from '@nestjs/common';

import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';
import {JwtStrategy} from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'secret123',
      signOptions: { expiresIn: '10h' },
    }),
  ],
  providers: [
    { provide: 'JwtSecret', useValue: 'secret123' },
    JwtStrategy],
})
export class AuthModule {}
