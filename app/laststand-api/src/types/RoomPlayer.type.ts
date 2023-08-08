import { Player, Vector } from "@shared/types";
import { Socket } from "socket.io";

export type RoomPlayer = Player & { socket?: Socket };
