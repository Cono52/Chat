const express = require("express");
const router = express.Router();
const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const {
  joinNewUser,
  disconnectUser,
  addTypingUser,
  removeTypingUser
} = require("./socketActions");

let users = {};
let typingUsers = {};

io.on("connection", socket => {
  socket.on("chat message", msg => {
    io.emit("chat message", `${users[socket.id]}:  ${msg}`);
  });

  socket.on("join chatroom", userName => {
    const newUsers = joinNewUser(socket, users, userName);
    if (!newUsers) {
      socket.emit("reject", "Already take name");
      return;
    }
    users = newUsers;
    socket.emit("approved", "success");
    socket.broadcast.emit("chat message", userName + " has joined");
    io.emit("updateUsers", Object.values(users));
  });

  socket.on("disconnect", () => {
    io.emit("chat message", `${users[socket.id]} left.`);
    users = disconnectUser(socket, users);
    io.emit("updateUsers", Object.values(users));
  });

  // Keep track of who is typing or idle
  socket.on("typing", () => {
    typingUsers = addTypingUser(socket, users, typingUsers);
    io.emit("typing", Object.values(typingUsers));
  });

  socket.on("idle", () => {
    typingUsers = removeTypingUser(socket, typingUsers);
    io.emit("idle", Object.values(typingUsers));
  });
});

app.get("/", (req, res) => {
  res.json(200, { response: "I am alive" });
});

router.get("/", (req, res) => {
  res.json(200, { response: "I am alive" });
});

http.listen(8000, function() {
  console.log("listening on *:8000");
});

// const dummyObj = {};
// console.time("adderOb");
// for (let index = 0; index < 1000000; index++) {
//   dummyObj[`thing${index}`] = index;
// }
// console.timeEnd("adderOb");
// console.time("deleterOb");
// for (let index = 0; index < 1000000; index++) {
//   delete dummyObj["thing" + index];
// }
// console.timeEnd("deleterOb");

// const dummyArr = [];
// console.time("adderArr");
// for (let index = 0; index < 100000; index++) {
//   dummyArr.push("thing" + index);
// }
// console.timeEnd("adderArr");
// console.time("deleterArr");
// for (let index = 0; index < 100000; index++) {
//   const i = dummyArr.indexOf("thing" + index);
//   dummyArr.splice(i, i);
// }
// console.timeEnd("deleterArr");
