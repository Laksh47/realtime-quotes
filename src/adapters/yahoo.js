const axios = require("axios");

const marketIndices = [
  "^GSPC",
  "^GSPTSE",
  "^NSEI",
  "^IXIC",
  "^DJI",
  "CADINR=X",
  "CADUSD=X",
  "BTC-CAD",
  "GC=F",
  "CL=F",
  "^TNX",
  "^VIX",
];
const summaryUrl = "https://query2.finance.yahoo.com/v7/finance/quote";

const quotesCount = 5;
const searchUrl = `https://query1.finance.yahoo.com/v1/finance/search?quotesCount=${quotesCount}`;

const { log } = console;

const yahooAPI = {
  buildRequest: () => {
    return {
      method: "get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
  },

  parseSummaryResponse: (yahooResponse) => {
    const stocks = yahooResponse["data"]["quoteResponse"]["result"];
    return stocks.map((stock) => {
      return {
        ticker: stock.symbol,
        companyName: stock.shortName,
        price: stock.regularMarketPrice.toFixed(2),
        priceChange: stock.regularMarketChange.toFixed(2),
        percentChange: stock.regularMarketChangePercent.toFixed(2),
        currency: stock.currency,
        exchange: stock.exchange,
        marketState: stock.marketState,
      };
    });
  },

  getSummary: async (symbols) => {
    const targetUrl = `${summaryUrl}?symbols=` + encodeURIComponent(symbols);
    try {
      const response = await axios(targetUrl, yahooAPI.buildRequest());
      return yahooAPI.parseSummaryResponse(response);
    } catch (err) {
      log(err);
      return Promise.reject([]);
    }
  },

  getMarketSummary: async () => {
    return yahooAPI.getSummary(marketIndices);
  },

  parseQueryResponse: (yahooResponse) => {
    return yahooResponse["data"]["quotes"];
  },

  searchStocks: async (query) => {
    const searchUrlWithQuery = `${searchUrl}&q=${query}`;
    try {
      const response = await axios(searchUrlWithQuery, yahooAPI.buildRequest());
      return yahooAPI.parseQueryResponse(response);
    } catch (err) {
      log(err);
      return Promise.reject([]);
    }
  },
};

export default yahooAPI;
