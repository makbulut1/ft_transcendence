import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { authenticator } from 'otplib';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { toDataURL } from 'qrcode';

@Injectable()
export class AuthenticationService {
    constructor(private usersService: UsersService, private jwtService: JwtService){}

    async   validateUsers(email: string, pass: string): Promise<Partial<User>> {
        const user = await this.usersService.findOne(email);
        try{
            const   isMatch = pass === user.password;
            if (user && isMatch){
                const{ password: _, ...userWithoutPassword } = user;
                return userWithoutPassword
            }
        }catch (e){
            return null;
        }
    }

    async login(userWithoutPsw: Partial<User>) {
        const   payload = {
            email: userWithoutPsw.email
        };

        return {
            email: payload.email,
            access_token: this.jwtService.sign(payload)
        };
    }

    async   generateTwoFactorAuthenticationSecret(user: User){
        const   secret = authenticator.generateSecret();

        const   otpAuthUrl = authenticator.keyuri(user.email, 'AUTH_APP_NAME', secret);

        await this.usersService.setTwoFactorAuthenticationSecret(secret, user.userId);

        return{
            secret,
            otpAuthUrl,
        };
    }

    async   generateQrCodeDataUrl(othpAuthUrl: string) {
        return toDataURL(othpAuthUrl);
    }

    isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: User) {
        return authenticator.verify({
            token: twoFactorAuthenticationCode,
            secret: user.twoFactorAuthenticationSecret,
        });
    }

    async   loginWith2fa(userWithoutPsw: Partial<User>) {
        const   payload = {
            email: userWithoutPsw.email,
            isTwoFactorAuthenticationEnabled: !!userWithoutPsw.isTwoFactorAuthenticationEnabled,
            isTwoFactorAuthenticated: true
        };

        return {
            email: payload.email,
            access_token: this.jwtService.sign(payload),
        }
    }
}
