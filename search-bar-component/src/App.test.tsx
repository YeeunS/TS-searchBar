import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import App from "./App";

test("renders search bar component", () => {
  render(<App />);
  const inputElement = screen.getByPlaceholderText(/search books/i);
  expect(inputElement).toBeInTheDocument();
});
