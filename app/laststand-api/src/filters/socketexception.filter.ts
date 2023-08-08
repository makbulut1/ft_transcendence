import { ArgumentsHost, Catch, Logger } from "@nestjs/common";
import { BaseWsExceptionFilter } from "@nestjs/websockets";
import { WENT_WRONG } from "@shared/socketEvents";
import { LSError } from "@shared/types";
import { Socket } from "socket.io";

@Catch()
export class SocketExceptionFilter extends BaseWsExceptionFilter {
	catch(exception: LSError, host: ArgumentsHost) {
		const client = host.switchToWs().getClient() as Socket;
		Logger.error(exception.message, "Socket");
		client.emit(WENT_WRONG, {
			error: exception,
		});
	}
}
