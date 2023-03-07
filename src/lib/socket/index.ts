import {Server} from 'socket.io';
import config from '../config';
import {ClientToServerEvents, ServerToClientEvents, InterServerEvents,} from '../../types/socket';

export default new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, any>().listen(Number(config.socketPort!));