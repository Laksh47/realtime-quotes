const axios = require("axios");
const targetUrl = "https://app-money.tmx.com/graphql";
const { log } = console;

const symbols = ["^SPX:US", "^NYA:US", "^COMPX:US", "^JX:CA", "^TSX"];

const WebTMX = {
  buildRequest: () => {
    const data = JSON.stringify({
      operationName: "getQuoteForSymbols",
      variables: {
        symbols: symbols,
      },
      query:
        "query getQuoteForSymbols($symbols: [String]) {\n  getQuoteForSymbols(symbols: $symbols) {\n    symbol\n    currency\n    longname\n    price\n    volume\n    priceChange\n    percentChange\n  exchange\n}\n}\n",
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
        currency: stock.currency,
        exchange: stock.exchange,
      };
    });
  },

  getMarketSummary: async () => {
    try {
      const response = await axios(targetUrl, WebTMX.buildRequest());
      return WebTMX.parseResponse(response);
    } catch (err) {
      log(err);
      return Promise.reject([]);
    }
  },
};

export default WebTMX;
