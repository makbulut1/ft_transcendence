import { Vector } from ".";

export interface Ball {
	direction: Vector;
	speed: number;
	radius: number;
	velocity: number;
	position: Vector;
}
