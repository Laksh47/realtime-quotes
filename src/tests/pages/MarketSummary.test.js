import { render, waitFor, fireEvent } from "@testing-library/react";
import MarketSummary from "../../pages/MarketSummary";

import axios from "axios";
import yahooQuoteEmptyResponse from "../fixtures/yahooQuoteEmptyResponse.json";
import yahooQuoteResponse from "../fixtures/yahooQuoteResponse.json";

describe("<MarketSummary />", () => {
  test("renders market summary tab without data/err from yahoo", async () => {
    axios.mockResolvedValue(yahooQuoteEmptyResponse);

    const { container } = render(<MarketSummary />);
    expect(container.querySelector(".time")).toHaveTextContent(/^(.*?)$/);

    await waitFor(() => expect(axios).toHaveBeenCalled());

    const price = container.querySelector(".current-price");
    expect(price).toBeNull();
    const deleteBtn = container.querySelector(".delete-btn");
    expect(deleteBtn).toBeNull();
  });

  test("renders market summary tab with data", async () => {
    axios.mockResolvedValue(yahooQuoteResponse);

    const { container } = render(<MarketSummary />);
    expect(container.querySelector(".time")).toHaveTextContent(/^(.*?)$/);

    await waitFor(() => expect(axios).toHaveBeenCalled());

    const price = container.querySelector(".current-price");
    expect(price).toHaveTextContent("3655.69 USD");
  });

  test("renders market summary tab and reload works", async () => {
    axios.mockResolvedValue(yahooQuoteResponse);

    const { container } = render(<MarketSummary />);
    expect(container.querySelector(".time")).toHaveTextContent(/^(.*?)$/);

    await waitFor(() => expect(axios).toHaveBeenCalled());
    expect(axios).toHaveBeenCalledTimes(1);

    const price = container.querySelector(".current-price");
    expect(price).toHaveTextContent("3655.69 USD");

    const mockClickFn = jest.fn();
    let reloadBtn = container.querySelector(".reload-btn");
    reloadBtn.onclick = mockClickFn;
    fireEvent.click(reloadBtn);
    expect(mockClickFn).toHaveBeenCalled();
    expect(axios).toHaveBeenCalledTimes(2);
  });
});
