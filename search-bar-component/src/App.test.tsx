import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

test("renders search bar component", () => {
  render(<App />);
  const inputElement = screen.getByPlaceholderText(/search books/i);
  expect(inputElement).toBeInTheDocument();
});
