import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import SearchBar from "./SearchBar";

jest.mock("axios");

describe("SearchBar", () => {
  it("renders input field", () => {
    render(<SearchBar />);
    expect(screen.getByPlaceholderText(/search books/i)).toBeInTheDocument();
  });

  it("fetches and displays suggestions as user types", async () => {
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue({
      data: {
        items: [
          { volumeInfo: { title: "Book 1" } },
          { volumeInfo: { title: "Book 2" } },
        ],
      },
    });

    render(<SearchBar />);

    fireEvent.change(screen.getByPlaceholderText(/search books/i), {
      target: { value: "book" },
    });

    await waitFor(() => {
      expect(screen.getByText("Book 1")).toBeInTheDocument();
      expect(screen.getByText("Book 2")).toBeInTheDocument();
    });
  });

  it("highlights suggestion on hover", async () => {
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue({
      data: {
        items: [
          { volumeInfo: { title: "Book 1" } },
          { volumeInfo: { title: "Book 2" } },
        ],
      },
    });

    render(<SearchBar />);

    fireEvent.change(screen.getByPlaceholderText(/search books/i), {
      target: { value: "book" },
    });

    await waitFor(() => {
      fireEvent.mouseEnter(screen.getByText("Book 1"));
      expect(screen.getByText("Book 1")).toHaveClass("highlighted");
    });
  });
});
