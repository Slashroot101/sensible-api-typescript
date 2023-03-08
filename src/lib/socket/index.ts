import {Server} from 'socket.io';
import config from '../config';
import {ClientToServerEvents, ServerToClientEvents, InterServerEvents,} from '../../types/socket';
import logger from '../logger';

const socket = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, any>().listen(Number(config.socketPort!), {cors: {origin: '*'}});

socket.on('connection', (socket) => {
  logger.debug(`Received connection from [socketId=${socket.id}][guildId=${socket.handshake.query.guildId}}]`);
  if(!socket.handshake.query.guildId){
    logger.debug(`Disconnecting socket [socketId=${socket.id}] due to lack of guildId`);
    return socket.disconnect();
  }
  socket.join(socket.handshake.query.guildId.toString());
});

export default socket;