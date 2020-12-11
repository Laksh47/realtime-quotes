import { render, waitFor, fireEvent } from "@testing-library/react";
import Watchlist from "../../pages/Watchlist";

import axios from "axios";
import yahooQuoteEmptyResponse from "../fixtures/yahooQuoteEmptyResponse.json";
import yahooQuoteResponse from "../fixtures/yahooQuoteResponse.json";
import yahooSearchResponse from "../fixtures/yahooSearchResponse.json";

// mock window.localStorage fns
const getItemMock = jest.fn(),
  setItemMock = jest.fn();

console.log = jest.fn(); // mock console logs

function clearLocalMocks() {
  delete global.localStorage;
  global.localStorage = {};
  global.localStorage.getItem = getItemMock;
  global.localStorage.setItem = setItemMock;
}

clearLocalMocks();

describe("<Watchlist />", () => {
  test("renders watchlist, empty", () => {
    axios.mockResolvedValue(yahooQuoteEmptyResponse);
    const { container } = render(<Watchlist />);
    expect(container.querySelector(".time")).toHaveTextContent(/^(.*?)$/);

    expect(container.querySelector(".search-bar")).toBeVisible();
    expect(getItemMock).toHaveBeenCalled();

    const indices = container.querySelector(".indices");
    expect(indices.children.length).toEqual(0);
  });

  test("renders watchlist, fetch stock from local, delete btn click", async () => {
    axios.mockResolvedValue(yahooQuoteResponse);
    global.localStorage.getItem = () => {
      return '{"TSLA":0}';
    };

    const { container } = render(<Watchlist />);

    await waitFor(() => expect(axios).toHaveBeenCalled());

    const indices = container.querySelector(".indices");
    expect(indices.children.length).toEqual(1);
    fireEvent.mouseOver(indices.firstChild);

    const deleteBtn = container.querySelector(".delete-btn");
    expect(deleteBtn).toBeVisible();
    fireEvent.click(deleteBtn);
    expect(setItemMock).toHaveBeenCalledTimes(1);

    clearLocalMocks();
  });

  test("renders watchlist, searching for ticker works", async () => {
    axios.mockResolvedValue(yahooSearchResponse);
    const { container } = render(<Watchlist />);
    expect(container.querySelector(".time")).toHaveTextContent(/^(.*?)$/);

    const input = container.querySelector(".search-bar");
    expect(input).toBeVisible();

    expect(container.querySelector(".search-results")).toBeNull();

    fireEvent.change(input, { target: { value: "ts" } });
    await waitFor(() => expect(axios).toHaveBeenCalled());
    expect(axios).toHaveBeenCalledTimes(1);

    const searchResults = container.querySelector(".search-results");
    expect(searchResults.children.length).toEqual(2);
  });

  test("renders watchlist, search and add ticker works", async () => {
    axios.mockResolvedValue(yahooSearchResponse);
    const { container } = render(<Watchlist />);

    const input = container.querySelector(".search-bar");
    expect(input).toBeVisible();

    fireEvent.change(input, { target: { value: "ts" } });
    await waitFor(() => expect(axios).toHaveBeenCalled());
    expect(axios).toHaveBeenCalledTimes(1);

    const searchResults = container.querySelector(".search-results");
    expect(searchResults.children.length).toEqual(2);

    axios.mockResolvedValue(yahooQuoteResponse);
    fireEvent.click(searchResults.firstChild);
    expect(axios).toHaveBeenCalledTimes(2);
    expect(setItemMock).toHaveBeenCalled();
  });
});
