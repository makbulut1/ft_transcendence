import { NestFactory } from "@nestjs/core";
import { AppModule } from "@/modules/app.module";
import { ValidationPipe } from "@nestjs/common";

Object.defineProperty(BigInt.prototype, "toJSON", {
	get() {
		"use strict";
		return () => String(this);
	},
});

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		cors: true,
	});

	app.setGlobalPrefix("api");
	app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

	await app.listen(+process.env.API_PORT);
}
bootstrap();
