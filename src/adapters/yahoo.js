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

const statsUrl = `https://query1.finance.yahoo.com/v10/finance/quoteSummary`;

// const yahooFinancialsModules = [
//   "incomeStatementHistory, cashflowStatementHistory, balanceSheetHistory, incomeStatementHistoryQuarterly, cashflowStatementHistoryQuarterly, balanceSheetHistoryQuarterly",
// ];
const yahooStatsModules = [
  "defaultKeyStatistics",
  "financialsTemplate",
  "price",
  "financialData",
  "quoteType",
  "calendarEvents",
  "summaryDetail",
  "symbol",
  "pageViews",
];

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

  parseStatsResponse: (yahooResponse) => {
    const stats =
      yahooResponse["data"]["quoteSummary"]["result"][0][
        "defaultKeyStatistics"
      ];
    // const financials =
    //   yahooResponse["data"]["quoteSummary"]["result"][0]["financialData"];
    const summaryDetails =
      yahooResponse["data"]["quoteSummary"]["result"][0]["summaryDetail"];
    const quoteType =
      yahooResponse["data"]["quoteSummary"]["result"][0]["quoteType"];
    const price = yahooResponse["data"]["quoteSummary"]["result"][0]["price"];

    return {
      priceToBook: stats["priceToBook"]?.["fmt"],

      marketCap: summaryDetails["marketCap"]?.["fmt"],
      volume: summaryDetails["volume"]?.["fmt"],
      fiftyTwoWeekLow: summaryDetails["fiftyTwoWeekLow"]?.["fmt"],
      fiftyTwoWeekHigh: summaryDetails["fiftyTwoWeekHigh"]?.["fmt"],
      dividendYield: summaryDetails["dividendYield"]?.["fmt"] || "-",
      forwardPE: summaryDetails["forwardPE"]?.["fmt"] || "-",
      trailingPE: summaryDetails["trailingPE"]?.["fmt"] || "-",

      ticker: quoteType["symbol"],
      shortName: quoteType["shortName"],
      price: price["regularMarketPrice"]?.["fmt"],
      currency: price["currency"],
    };
  },

  getStats: async (symbol) => {
    const targetUrl = `${statsUrl}/${symbol}?formatted=true&modules=${yahooStatsModules.join(
      "%2C"
    )}`;
    try {
      const response = await axios(targetUrl, yahooAPI.buildRequest());
      return yahooAPI.parseStatsResponse(response);
    } catch (err) {
      log(err);
      return Promise.resolve([]);
    }
  },

  getSummary: async (symbols) => {
    const targetUrl = `${summaryUrl}?symbols=` + encodeURIComponent(symbols);
    try {
      const response = await axios(targetUrl, yahooAPI.buildRequest());
      return yahooAPI.parseSummaryResponse(response);
    } catch (err) {
      log(err);
      return Promise.resolve([]);
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
      return Promise.resolve([]);
    }
  },
};

export default yahooAPI;
