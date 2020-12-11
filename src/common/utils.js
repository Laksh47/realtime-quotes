import { YAHOO_MARKET_OPEN } from "./constants";

const getTimestamp = () => {
  const dt = new Date();
  const time = dt.toLocaleTimeString("en-us", { timeZoneName: "short" });
  return `${dt.toDateString()}, ${time}`;
};

const serialize = (symbols) => {
  if (symbols) {
    let symbolsHash = {};
    for (let i = 0; i < symbols.length; i++) {
      symbolsHash[symbols[i]] = 0;
    }
    return JSON.stringify(symbolsHash);
  }
  return null;
};

const uniq = (array) => {
  return array.filter((value, index, item) => {
    return item.indexOf(value) === index;
  });
};

const deserialize = (obj) => {
  if (obj && obj !== "") {
    const symbolsHash = JSON.parse(obj);
    return Object.keys(symbolsHash);
  }
  return null;
};

const isMarketOpen = (status) => {
  return status === YAHOO_MARKET_OPEN;
};

export { getTimestamp, serialize, deserialize, isMarketOpen, uniq };
