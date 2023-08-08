import { NOT_LOGGED } from "@/error/errors";
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { Socket } from "socket.io";

@Injectable()
export class SocketAuthGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const client = context.switchToWs().getClient() as Socket;

		if (!client.data["username"]) {
			throw NOT_LOGGED();
		}

		return true;
	}
}
