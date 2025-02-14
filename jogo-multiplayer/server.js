import express from "express";
import http from "node:http";
import createGame from "./public/game.js";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const webSocket = new Server(server);

app.use(express.static("public"));

const game = createGame();
game.subscribe((commad) => {
  console.log(`> Emitting ${commad.type}`);
  // Send to client-side
  webSocket.emit(commad.type, commad);
});

webSocket.on("connection", (socket) => {
  game.start();
  const playerId = socket.id;
  console.log(`> Player connected on Server with id: ${playerId}`);

  game.addPlayer({ playerId: playerId });

  socket.emit("setup", game.state);

  socket.on("disconnect", () => {
    console.log(`> Player disconnected: ${playerId}`);
    game.removePlayer({ playerId: playerId });
  });

  socket.on("move-player", (commad) => {
    commad.playerId = playerId;
    commad.type = "move-player";

    game.movePlayer(commad);
  });
});

server.listen(3000, () => {
  console.log("> Server listennig http://localhost:3000");
});
