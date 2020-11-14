import React from 'react';
import './App.css';

const axios = require('axios');
const { log } = console;

// refer => https://stackoverflow.com/questions/43262121/trying-to-use-fetch-and-pass-in-mode-no-cors/43268098#43268098
// https://github.com/Rob--W/cors-anywhere/
var proxyUrl = 'https://cors-anywhere.herokuapp.com/',
    targetUrl = 'https://app-money.tmx.com/graphql'

const getStocksConfig = (stocksList) => {
  const data = JSON.stringify({
    "operationName": "getQuoteForSymbols",
    "variables":{
      "symbols": stocksList
    },
    "query": "query getQuoteForSymbols($symbols: [String]) {\n  getQuoteForSymbols(symbols: $symbols) {\n    symbol\n    longname\n    price\n    volume\n    openPrice\n    priceChange\n    percentChange\n    dayHigh\n    dayLow\n    prevClose\n    __typename\n  }\n}\n"
  });

  return {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    data
  };
};

const getRealtimeData = async (stocksList) => {
  try {
    const response = await axios(proxyUrl + targetUrl, getStocksConfig(stocksList));
    return response["data"]["data"]["getQuoteForSymbols"];
  }
  catch (err) {
    log(err);
    return [];
  }
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { stocks: [] };
  }

  async componentDidMount() {
    let stocks = await getRealtimeData(["SHOP", "VRE", "ZRE"]);
    this.setState({ stocks });
  }

  render() {
    let { stocks } = this.state;
    return (
      <div class="table-container">
        <table aria-label="customized table">
          <thead>
            <tr class="table-header">
              <th>Ticker</th>
              <th align="center">Price</th>
              <th align="center">Previous Close</th>
              <th align="center">Change (%)</th>
              <th align="center">Volume</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <tr key={stock.symbol}>
                <td>
                  {stock.symbol}
                </td>
                <td align="center">{stock.price}</td>
                <td align="center">{stock.prevClose}</td>
                <td align="center">{stock.percentChange}</td>
                <td align="center">{stock.volume}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;
