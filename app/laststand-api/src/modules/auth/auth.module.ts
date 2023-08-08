import { AuthController } from "@/modules/auth/auth.controller";
import { AuthService } from "@/modules/auth/auth.service";
import { DatabaseModule } from "@/modules/database/database.module";
import { UserModule } from "@/modules/user/user.module";
import { Module } from "@nestjs/common";

@Module({
	imports: [UserModule, DatabaseModule],
	controllers: [AuthController],
	providers: [AuthService],
	exports: [AuthService],
})
export class AuthModule {}
