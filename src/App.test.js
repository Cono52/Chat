import React from "react";
import App from "./App";

import { render, cleanup } from "react-testing-library";
import "jest-dom/extend-expect";

// automatically unmount and cleanup DOM after the test is finished.
afterEach(cleanup);

test("Renders the app on the username input screen", () => {
  const { getByText } = render(<App />);
  expect(getByText("What will your username be?")).toBeInTheDOM();
  const inputBox = document.querySelector('[name="userName"]');
  expect(inputBox).toBeInTheDocument();
});
