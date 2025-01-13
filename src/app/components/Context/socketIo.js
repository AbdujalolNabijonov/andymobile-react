import { createContext } from "react";
import io from "socket.io-client";
import { serverApi } from "../../libs/config";

export const socket = io(serverApi);
export const socketContext = createContext();
