import io from "socket.io-client";
import { serverApi } from "../../../libs/config";
import { createContext } from "react";

export const socket = io(serverApi);
export const socketContext = createContext();
