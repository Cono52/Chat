import React from "react";
import App from "./App";
import mockio, { serverSocket, cleanUp } from "../mocks/socket.io-client";

import { render, cleanup, fireEvent, debug } from "react-testing-library";
import "jest-dom/extend-expect";

// automatically unmount and cleanup DOM after the test is finished.
afterEach(cleanup);

test("Renders the app on the username input screen", () => {
  const { getByText } = render(<App />);
  expect(getByText("What will your username be?")).toBeInTheDOM();
  const inputBox = document.querySelector('[name="userName"]');
  expect(inputBox).toBeInTheDocument();
});

test("Sending user name will attempt to join a chatroom", () => {
  const utils = render(<App />);
  const inputBox = document.querySelector('[name="userName"]');
  const submitButton = document.querySelector("button");
  inputBox.value = "testName";
  fireEvent.change(inputBox);
  fireEvent.click(submitButton);
  // TODO: check if socket event was fired
});
