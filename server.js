const express = require("express");
const router = express.Router();
const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);

const users = {};
const typingUsers = {};

io.on("connection", socket => {
  socket.on("chat message", function(msg) {
    io.emit("chat message", `${users[socket.id]}:  ${msg}`);
  });

  socket.on("join chatroom", function(userName) {
    if (Object.keys(users).find(id => users[id] === userName)) {
      socket.emit("reject", "Already take name");
      return;
    }
    socket.emit("approved", "success");
    socket.broadcast.emit("chat message", userName + " has joined");
    users[`${socket.id}`] = userName;
    io.emit("updateUsers", Object.values(users));
  });

  socket.on("disconnect", function() {
    io.emit("chat message", `${users[socket.id]} left.`);
    delete users[socket.id];
    io.emit("updateUsers", Object.values(users));
  });

  // Keep track of who is typing or idle
  socket.on("typing", function() {
    typingUsers[socket.id] = users[socket.id];
    io.emit("typing", Object.values(typingUsers));
  });

  socket.on("idle", function() {
    delete typingUsers[socket.id];
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
