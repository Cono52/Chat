import {
  joinNewUser,
  disconnectUser,
  addTypingUser,
  removeTypingUser
} from "./socketActions";

describe("socket actions", () => {
  test("should add a new socket id and username key value pair", () => {
    const socket = {
      id: "testSockId"
    };
    const users = {};
    const username = "test";
    expect(joinNewUser(socket, users, username)).toEqual({
      [socket.id]: username
    });
  });

  test("should remove a socket id and username key value pair", () => {
    const socket = {
      id: "testSockId"
    };
    const users = { [socket.id]: "test" };
    expect(disconnectUser(socket, users)).toEqual({});
  });

  test("should add a socket id and username key value pair", () => {
    const socket = {
      id: "testSockId"
    };
    const users = {
      [socket.id]: "test"
    };
    const typingUsers = {};
    expect(addTypingUser(socket, users, typingUsers)).toEqual(users);
  });

  test("should remove a socket id and username key value pair", () => {
    const socket = {
      id: "testSockId"
    };
    const typingUsers = { [socket.id]: "test" };
    expect(removeTypingUser(socket, typingUsers)).toEqual({});
  });
});
