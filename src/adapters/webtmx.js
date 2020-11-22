const axios = require("axios");
const targetUrl = "https://app-money.tmx.com/graphql";
const { log } = console;

const symbols = ["^TSX", "^JX:CA", "^COMPX:US", "^NYA:US", "^SPX:US"];

const WebTMX = {
  buildRequest: () => {
    const data = JSON.stringify({
      operationName: "getQuoteForSymbols",
      variables: {
        symbols: symbols,
      },
      query:
        "query getQuoteForSymbols($symbols: [String]) {\n  getQuoteForSymbols(symbols: $symbols) {\n    symbol\n    longname\n    price\n    volume\n    openPrice\n    priceChange\n    percentChange\n    dayHigh\n    dayLow\n    prevClose\n    __typename\n  }\n}\n",
    });

    return {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data,
    };
  },

  parseResponse: (webTMXResponse) => {
    const stocks = webTMXResponse["data"]["data"]["getQuoteForSymbols"];
    return stocks.map((stock) => {
      return {
        ticker: stock.symbol,
        companyName: stock.longname,
        price: stock.price,
        priceChange: stock.priceChange,
        percentChange: stock.percentChange,
      };
    });
  },

  getMarketSummary: async () => {
    try {
      const response = await axios(targetUrl, WebTMX.buildRequest());
      return WebTMX.parseResponse(response);
    } catch (err) {
      log(err);
      return [];
    }
  },
};

export default WebTMX;
