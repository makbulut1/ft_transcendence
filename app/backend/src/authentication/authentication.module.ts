import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { LocalStrategy } from './local/local.strategy';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports:[UsersModule, JwtModule.register({
    secret: 'secret',
    signOptions: { expiresIn: '1d' },
  })],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, LocalStrategy]
})
export class AuthenticationModule {}
