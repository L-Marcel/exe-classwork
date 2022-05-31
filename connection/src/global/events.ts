import { Socket } from "socket.io";

function globalEvents(socket: Socket) {
  console.log("HUM...");
  socket.on("@alerts/new", () => {
    console.log("EITA");
    socket.broadcast.emit("@alerts/new");
  });
};

export { globalEvents };

