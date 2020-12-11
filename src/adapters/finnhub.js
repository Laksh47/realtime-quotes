const axios = require("axios");

const targetUrl = "https://finnhub.io/api/v1/stock/symbol";

const { log } = console;

const finnHub = {
  buildRequest: () => {
    return {
      method: "get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Finnhub-Token": "but0dnv48v6ue3ptd090",
      },
    };
  },

  parseResponse: (finnHubResponse) => {
    return finnHubResponse["data"];
  },

  getTickers: async (exchange) => {
    const USTickersUrl = `${targetUrl}?exchange=${exchange}`;
    try {
      const response = await axios(USTickersUrl, finnHub.buildRequest());
      return finnHub.parseResponse(response);
    } catch (err) {
      log(err);
      return Promise.resolve([]);
    }
  },
};

export default finnHub;
