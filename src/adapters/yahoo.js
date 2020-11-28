const axios = require("axios");

const symbols = ["^GSPC", "^NYA", "^IXIC", "^SPCDNX", "^GSPTSE"];
const targetUrl =
  "https://cors-anywhere.herokuapp.com/https://query2.finance.yahoo.com/v7/finance/quote?symbols=" +
  encodeURIComponent(symbols);

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

  parseResponse: (yahooResponse) => {
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
      };
    });
  },

  getMarketSummary: async () => {
    try {
      const response = await axios(targetUrl, yahooAPI.buildRequest());
      return yahooAPI.parseResponse(response);
    } catch (err) {
      log(err);
      return Promise.reject([]);
    }
  },
};

export default yahooAPI;
