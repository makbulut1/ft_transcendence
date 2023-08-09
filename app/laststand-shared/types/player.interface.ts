import { User } from "../models";
import { Vector } from "./";

export interface Player extends User {
	position?: Vector;
	score?: number;
}
