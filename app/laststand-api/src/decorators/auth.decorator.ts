import {
	ExecutionContext,
	HttpException,
	HttpStatus,
	Logger,
	createParamDecorator,
} from "@nestjs/common";
import { JwtUser } from "@shared/models";
import jwt from "jsonwebtoken";

export const Authorization = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
	const req = ctx.switchToHttp().getRequest();
	const authHeader = req?.headers?.["authorization"] as string;
	let token = authHeader;

	if (authHeader.includes("Bearer")) {
		token = authHeader.split(" ")[1];
	}

	try {
		if (!token) {
			throw 42; // Just pass to catch field.
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		return decoded as JwtUser;
	} catch (err) {
		throw new HttpException("Authorization error", HttpStatus.UNAUTHORIZED);
	}
});
