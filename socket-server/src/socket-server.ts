import * as SocketIO from 'socket.io';
import { Socket } from 'socket.io';
import * as querystring from 'querystring';
import { SocketEventEnum } from './SocketEvent.enum';

const server = SocketIO(3000);

console.debug("socket-server listening on port 3000...");

server.on("connection", (socket: Socket) => {
  console.log(socket.client.id, "Connection");


  // Events
  socket.on("disconnect", () => {
    console.log(socket.client.id, "Disconnection");
  });

  socket.on("message", (message) => {
    socket.broadcast.emit(SocketEventEnum.STATE_UPDATE, message);
    console.log(message, "message");
  });

  const pathAndQuery = socket.request.url.split("?");
  const urlQuery = pathAndQuery.length > 1 ? pathAndQuery[1] : "";
  const parsedUrlQuery = querystring.parse(urlQuery);

  if (Object.getOwnPropertyDescriptor(parsedUrlQuery, "room") && parsedUrlQuery.room) {
    socket.join(parsedUrlQuery.room);
  } else {
    socket.disconnect(true);
  }
});

