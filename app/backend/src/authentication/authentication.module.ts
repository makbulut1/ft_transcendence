import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { LocalStrategy } from './local/local.strategy';
import { UsersModule } from 'src/users/users.module';
import {JwtAuthGuard} from './jwt/jwt-auth.guard';
import {Jwt2faAuthGuard} from './jwt-2fa/jwt-2fa-auth.guard';

@Module({
  imports:[UsersModule, JwtModule.register({
    secret: 'secret',
    signOptions: { expiresIn: '1d' },
  })],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, LocalStrategy, JwtAuthGuard, Jwt2faAuthGuard]
})
export class AuthenticationModule {}
