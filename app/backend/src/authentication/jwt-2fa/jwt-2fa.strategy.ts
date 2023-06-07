import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { ExtractJwt } from "passport-jwt";
import { UsersService } from "src/users/users.service";

@Injectable()
export class Jwt2faStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UsersService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'secret',
          });
        }
      
        async validate(payload: any) {
          const user = await this.userService.findOne(payload.email);
      
          if (!user.isTwoFactorAuthenticationEnabled) {
            return user;
          }
          if (payload.isTwoFactorAuthenticated) {
            return user;
          }
        }
}