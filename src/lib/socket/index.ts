import {Server} from 'socket.io';
import config from '../config';

export default new Server().listen(Number(config.socketPort!));