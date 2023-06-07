import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { UsersService } from "src/users/users.service";
import { ExtractJwt, Strategy} from "passport-jwt"
import { TokenPayload } from "../entities/token-payload.entity";

@Injectable()
export class    JwtStrategy extends PassportStrategy(Strategy){
    constructor(private readonly userService: UsersService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'secret',
        });
    }

    async   validate(payload: TokenPayload){
        const   user = await this.userService.findOne(payload.email);

        if (user){
            return user;
        }
    }
}