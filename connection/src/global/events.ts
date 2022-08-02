import { Socket } from "socket.io";

function globalEvents(socket: Socket) {
  socket.on("@alerts/new", () => {
    socket.broadcast.emit("@alerts/new");
  });
};

export { globalEvents };

