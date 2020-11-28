const axios = require("axios");

const targetUrl =
  "https://cors-anywhere.herokuapp.com/https://raw.githubusercontent.com/Laksh47/curate-tickers/master/tickers.json";

const { log } = console;

const finnHub = {
  buildRequest: () => {
    return {
      method: "get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
  },

  parseResponse: (finnHubResponse) => {
    return finnHubResponse["data"];
  },

  getTickers: async () => {
    try {
      const response = await axios(targetUrl, finnHub.buildRequest());
      return finnHub.parseResponse(response);
    } catch (err) {
      log(err);
      return Promise.reject([]);
    }
  },
};

export default finnHub;
