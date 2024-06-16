import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import SearchBar from "./SearchBar";

jest.mock("axios");

describe("SearchBar", () => {
  it("renders input field with placeholder", () => {
    render(<SearchBar />);
    expect(screen.getByRole("textbox")).toHaveAttribute("placeholder", " ");
  });

  it("updates input value on change", () => {
    render(<SearchBar />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "test" } });
    expect(input).toHaveValue("test");
  });

  it("fetches and displays suggestions as user types", async () => {
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue({
      data: {
        items: [
          { volumeInfo: { title: "Suggestion 1" } },
          { volumeInfo: { title: "Suggestion 2" } },
        ],
      },
    });

    render(<SearchBar />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "suggest" } });

    await waitFor(() => {
      expect(screen.getByText("Suggestion 1")).toBeInTheDocument();
      expect(screen.getByText("Suggestion 2")).toBeInTheDocument();
    });
  });

  it("handles arrow key navigation", async () => {
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue({
      data: {
        items: [
          { volumeInfo: { title: "Suggestion 1" } },
          { volumeInfo: { title: "Suggestion 2" } },
        ],
      },
    });

    render(<SearchBar />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "suggest" } });

    await waitFor(() => {
      expect(screen.getByText("Suggestion 1")).toBeInTheDocument();
      expect(screen.getByText("Suggestion 2")).toBeInTheDocument();
    });

    fireEvent.keyDown(input, { key: "ArrowDown" });
    await waitFor(() => {
      expect(screen.getByText("Suggestion 1")).toHaveClass("highlighted");
    });

    fireEvent.keyDown(input, { key: "ArrowDown" });
    await waitFor(() => {
      expect(screen.getByText("Suggestion 2")).toHaveClass("highlighted");
    });

    fireEvent.keyDown(input, { key: "ArrowUp" });
    await waitFor(() => {
      expect(screen.getByText("Suggestion 1")).toHaveClass("highlighted");
    });
  });

  it("selects highlighted suggestion on enter key", async () => {
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue({
      data: {
        items: [
          { volumeInfo: { title: "Suggestion 1" } },
          { volumeInfo: { title: "Suggestion 2" } },
        ],
      },
    });

    render(<SearchBar />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "suggest" } });

    await waitFor(() => {
      expect(screen.getByText("Suggestion 1")).toBeInTheDocument();
      expect(screen.getByText("Suggestion 2")).toBeInTheDocument();
    });

    fireEvent.keyDown(input, { key: "ArrowDown" });
    await waitFor(() => {
      expect(screen.getByText("Suggestion 1")).toHaveClass("highlighted");
    });

    fireEvent.keyDown(input, { key: "Enter" });
    await waitFor(() => {
      expect(input).toHaveValue("Suggestion 1");
    });
  });

  it("clears input and suggestions on clear button click", async () => {
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue({
      data: {
        items: [
          { volumeInfo: { title: "Suggestion 1" } },
          { volumeInfo: { title: "Suggestion 2" } },
        ],
      },
    });

    render(<SearchBar />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "suggest" } });

    await waitFor(() => {
      expect(screen.getByText("Suggestion 1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("×"));
    await waitFor(() => {
      expect(input).toHaveValue("");
      expect(screen.queryByText("Suggestion 1")).not.toBeInTheDocument();
    });
  });

  it("closes suggestions on escape key", async () => {
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue({
      data: {
        items: [
          { volumeInfo: { title: "Suggestion 1" } },
          { volumeInfo: { title: "Suggestion 2" } },
        ],
      },
    });

    render(<SearchBar />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "suggest" } });

    await waitFor(() => {
      expect(screen.getByText("Suggestion 1")).toBeInTheDocument();
    });

    fireEvent.keyDown(input, { key: "Escape" });
    await waitFor(
      () => {
        expect(screen.queryByText("Suggestion 1")).not.toBeInTheDocument();
      },
      { timeout: 3000 } // Increase the timeout
    );
  });
});
