const joinNewUser = (socket, users, userName) => {
  if (Object.keys(users).find(id => users[id] === userName)) {
    return false;
  }
  users[`${socket.id}`] = userName;
  return users;
};

const disconnectUser = (socket, users) => {
  delete users[socket.id];
  return users;
};

const addTypingUser = (socket, users, typingUsers) => {
  typingUsers[socket.id] = users[socket.id];
  return typingUsers;
};

const removeTypingUser = (socket, typingUsers) => {
  delete typingUsers[socket.id];
  return typingUsers;
};

module.exports = {
  joinNewUser,
  disconnectUser,
  addTypingUser,
  removeTypingUser
};
