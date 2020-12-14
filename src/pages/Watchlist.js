import React from "react";

import Ticker from "../components/Ticker";
import yahooAPI from "../adapters/yahoo";
import * as constants from "../common/constants";
import * as utils from "../common/utils";

import { SemipolarLoading } from "react-loadingg";
import { ReactComponent as IconRefresh } from "../assets/icon_refresh.svg";

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
    window.localStorage.setItem(
      constants.STORAGE_KEY,
      utils.serialize(symbols)
    );
  }

  async componentDidMount() {
    let symbols = [],
      stocks = [];

    this.setState({ isLoading: true });

    symbols = utils.deserialize(
      window.localStorage.getItem(constants.STORAGE_KEY)
    );
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

    // check for duplicates
    if (symbols.indexOf(symbol) === -1) {
      symbols.unshift(symbol);
    }

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
      <div>
        <div className="page">
          <div className="settings clearfix">
            <div className="time">{utils.getTimestamp()}</div>
            <div className="reload-btn" onClick={this.reloadStocks.bind(this)}>
              <IconRefresh />
            </div>
          </div>
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
                          {result.longname} ({result.typeDisp} -{" "}
                          {result.exchange})
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div>
            {stocks.length === 0 && (
              <h4 align="center">Search and add tickers to track them!</h4>
            )}
            <div className="indices">
              {isLoading ? (
                <SemipolarLoading />
              ) : (
                stocks.map((stock, index) => (
                  <Ticker
                    stock={stock}
                    key={index}
                    showDelete={true}
                    onDelete={this.deleteAndUpdate.bind(this)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
        <div class="footer">
          <a
            href="https://ca.finance.yahoo.com/"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="https://poweredby.yahoo.com/white.png"
              width="134"
              height="29"
              alt="Powered by Yahoo API"
            />
          </a>
        </div>
      </div>
    );
  }
}

export default Watchlist;
