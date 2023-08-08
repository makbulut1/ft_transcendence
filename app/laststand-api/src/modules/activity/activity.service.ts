import { Injectable, Logger } from "@nestjs/common";
import { Status } from "@shared/models";

export type ActivityChangeListener = (username: string, status: Status) => void;

@Injectable()
export class ActivityService {
	private users = new Map<string, string>();
	private listeners: ActivityChangeListener[] = [];

	constructor() {}

	addListener(listener: ActivityChangeListener) {
		this.listeners.push(listener);
	}

	setActivity(username: string, status: Status) {
		this.users[username] = status;
		this.listeners.forEach((x) => x(username, status));
	}

	getActivity(username: string): Status {
		return this.users[username];
	}
}
