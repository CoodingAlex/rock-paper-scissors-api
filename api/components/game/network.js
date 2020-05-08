const SocketIo = require("socket.io");

let connectedUsers = [];
module.exports = (server) => {
  if (server) {
  }
  const io = SocketIo.listen(server);
  io.on("connection", (socket) => {
    let roomname;
    console.log("New connection");

    socket.on("login", (data) => {
      socket.username = data;
      connectedUsers.push({
        username: data,
        id: socket.id,
      });
      console.log(connectedUsers);

      io.sockets.emit("newUserConected", connectedUsers);
    });
    socket.on("invitation", (userToPlay) => {
      console.log(userToPlay);
      roomname = `${socket.id}:${userToPlay}`;
      socket.join(roomname);
      socket.json.myRoom = roomname;
      console.log(roomname, "invitation");
      socket
        .to(userToPlay)
        .emit("invitation", { username: socket.username, id: socket.id });
    });

    socket.on("accept:invitation", (userFromId) => {
      roomname = `${userFromId}:${socket.id}`;
      socket.json.myRoom = roomname;

      let usersToSend = roomname.split(":");
      usersToSend.forEach((user) => {
        io.sockets.to(user).emit("room", roomname);
      });
    });

    socket.on("playing:option", (option) => {
      let userToSend = socket.json.myRoom
        .replace(`${socket.id}`, "")
        .replace(":", "");

      io.sockets.to(userToSend).emit("rival:option", option);
    });

    socket.on("disconnect", () => {
      connectedUsers = connectedUsers.filter(
        (user) => user.username !== socket.username
      );
      console.log("dissconnected");

      socket.broadcast.emit("userDisconnected", connectedUsers);
    });
  });
};
