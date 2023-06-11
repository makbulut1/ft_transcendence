import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Strategy } from "passport-local";
import { PassportStrategy } from '@nestjs/passport';
import { User } from "src/users/entities/user.entity";
import { AuthenticationService } from "../authentication.service";

@Injectable()
export class    LocalStrategy extends PassportStrategy(Strategy){
    constructor(private authenticationService: AuthenticationService){
        super({
            usernameField:'email',
            passwordField:'password',
        });
    }

    async validate(email: string, password: string): Promise<Partial<User>>{
        const   userWithoutPsw = await this.authenticationService.validateUsers(email, password);
        if (!userWithoutPsw){
            throw new UnauthorizedException();
        }
        return userWithoutPsw;
    }
}