import React from "react";
import { ReactComponent as IconRefresh } from "./icon_refresh.svg";

const axios = require("axios");
const { log } = console;

// refer => https://stackoverflow.com/questions/43262121/trying-to-use-fetch-and-pass-in-mode-no-cors/43268098#43268098
// https://github.com/Rob--W/cors-anywhere/
var proxyUrl = "https://cors-anywhere.herokuapp.com/",
  targetUrl = "https://app-money.tmx.com/graphql";

const getStocksConfig = (stocksList) => {
  const data = JSON.stringify({
    operationName: "getQuoteForSymbols",
    variables: {
      symbols: stocksList,
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
};

const getRealtimeData = async (stocksList) => {
  try {
    const response = await axios(
      proxyUrl + targetUrl,
      getStocksConfig(stocksList)
    );
    return response["data"]["data"]["getQuoteForSymbols"];
  } catch (err) {
    log(err);
    return [];
  }
};

const indices = ["^TSX", "^JX:CA", "^COMPX:US", "^NYA:US", "^SPX:US"];

class MarketSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { stocks: [] };
  }

  async reloadStockPrices() {
    let stocks = await getRealtimeData(indices);
    this.setState({ stocks });
  }

  async componentDidMount() {
    let stocks = await getRealtimeData(indices);
    this.setState({ stocks });
  }

  render() {
    let { stocks } = this.state;
    return (
      <div className="page">
        <div className="settings clearfix">
          <div className="pull-left">Market Indices</div>
          <div
            className="reload-btn pull-right"
            onClick={this.reloadStockPrices.bind(this)}
          >
            <IconRefresh />
          </div>
        </div>
        <div className="indices">
          {stocks.map((stock, index) => (
            <div className="index" key={index}>
              <div className="first-row clearfix">
                <span className="pull-left truncate">
                  <span>{stock.longname}</span>
                </span>
                <span className="current-price pull-right">{stock.price}</span>
              </div>
              <div className="second-row clearfix">
                <span className="ticker pull-left">
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={"https://money.tmx.com/en/quote/" + stock.symbol}
                  >
                    {stock.symbol}
                  </a>
                </span>
                {stock.priceChange >= 0 ? (
                  <span className="change bull pull-right">
                    +{stock.priceChange} (+{stock.percentChange}%)
                  </span>
                ) : (
                  <span className="change bear pull-right">
                    {stock.priceChange} ({stock.percentChange}%)
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default MarketSummary;
