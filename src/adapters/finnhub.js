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

  getUSTickers: async () => {
    const USTickersUrl = `${targetUrl}?exchange=US`;
    try {
      const response = await axios(USTickersUrl, finnHub.buildRequest());
      return finnHub.parseResponse(response);
    } catch (err) {
      log(err);
      return [];
    }
  },

  getCanadaTickers: async () => {
    const canadaTickersUrl = `${targetUrl}?exchange=TO`;
    try {
      const response = await axios(canadaTickersUrl, finnHub.buildRequest());
      return finnHub.parseResponse(response);
    } catch (err) {
      log(err);
      return [];
    }
  },
};

export default finnHub;
