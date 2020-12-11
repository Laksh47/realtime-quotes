import { render, screen } from "@testing-library/react";
import App from "../App";

import axios from "axios";
import yahooQuoteEmptyResponse from "./fixtures/yahooQuoteEmptyResponse.json";

describe("<App />", () => {
  test("renders tabs", () => {
    axios.mockResolvedValue(yahooQuoteEmptyResponse);

    render(<App />);
    const marketSummaryTab = screen.getByText(/Market Summary/i);
    expect(marketSummaryTab).toBeInTheDocument();

    const WatchlistTab = screen.getByText(/Watchlist/i);
    expect(WatchlistTab).toBeInTheDocument();
  });
});
