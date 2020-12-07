import React from "react";
import yahooAPI from "../../adapters/yahoo";
import Ticker from "../../common/Ticker";
import { SemipolarLoading } from "react-loadingg";
import * as constants from "../../constants";

const serialize = (obj) => {
  if (obj) return JSON.stringify(obj);
  return null;
};

const deserialize = (obj) => {
  if (obj && obj !== "") return JSON.parse(obj);
  return null;
};

class Watchlist extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      symbols: [],
      searchResults: [],
      stocks: [],
    };

    this.textInput = React.createRef();
    this.search = this.search.bind(this);
    this.addAndReload = this.addAndReload.bind(this);
    this.reloadStocks = this.reloadStocks.bind(this);
  }

  clearTextInput() {
    this.textInput.current.value = "";
  }

  updateStorage(symbols) {
    console.log("Updating local storage: " + symbols);
    window.localStorage.setItem(constants.STORAGE_KEY, serialize(symbols));
  }

  async componentDidMount() {
    let symbols = [],
      stocks = [];

    this.setState({ isLoading: true });

    symbols = deserialize(window.localStorage.getItem(constants.STORAGE_KEY));
    if (symbols && symbols.length) {
      stocks = await yahooAPI.getSummary(symbols);
      this.setState({ symbols, stocks, isLoading: false });
    }

    this.setState({ isLoading: false });
  }

  async search(event) {
    const query = event.target.value;

    if (query.trim() === "") {
      this.setState({ searchResults: [] });
      return;
    }

    const queryResults = await yahooAPI.searchStocks(query);
    this.setState({ searchResults: queryResults });
  }

  async reloadStocks() {
    const { symbols } = this.state;
    this.setState({ isLoading: true });
    const stocks = await yahooAPI.getSummary(symbols);
    this.setState({ stocks, isLoading: false });
  }

  async addAndReload(symbol) {
    console.log("Adding: " + symbol);
    let { symbols } = this.state;
    symbols.push(symbol);
    this.setState({ searchResults: [], symbols });
    this.updateStorage(symbols);
    this.reloadStocks();
    this.clearTextInput();
  }

  deleteAndUpdate(symbol) {
    console.log("Deleting: " + symbol);
    let { symbols, stocks } = this.state;

    symbols = symbols.filter(function (item) {
      return item !== symbol;
    });
    stocks = stocks.filter(function (stock) {
      return stock.ticker !== symbol;
    });

    this.setState({ symbols, stocks });
    this.updateStorage(symbols);
  }

  render() {
    let { stocks, searchResults, isLoading } = this.state;
    return (
      <div className="watchlist">
        <div className="settings clearfix"></div>
        <div className="watchlist-tickers">
          <div className="search">
            <input
              className="search-bar"
              placeholder="search for stocks"
              onChange={(evt) => this.search(evt)}
              list="search-results"
              ref={this.textInput}
            ></input>
            {searchResults.length > 0 && (
              <div id="search-results" className="search-results">
                {searchResults.map((result, index) => {
                  return (
                    <div
                      className="search-result"
                      onClick={() => this.addAndReload(result.symbol)}
                      key={result.symbol}
                      value={result.symbol}
                    >
                      <div className="symbol">{result.symbol}</div>
                      <div className="longname">
                        {result.longname} ({result.typeDisp} - {result.exchange}
                        )
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {isLoading ? (
            <SemipolarLoading />
          ) : (
            <div>
              {stocks.length === 0 && (
                <h4 align="center">Search and add tickers to track them!</h4>
              )}
              <div className="indices">
                {stocks.map((stock, index) => (
                  <Ticker
                    stock={stock}
                    key={index}
                    showDelete={true}
                    onDelete={this.deleteAndUpdate.bind(this)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Watchlist;
