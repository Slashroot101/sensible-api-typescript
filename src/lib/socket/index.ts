import {Server} from 'socket.io';
import config from '../config';

export default new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, any>().listen(Number(config.socketPort!));