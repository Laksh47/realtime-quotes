import React from "react";
import yahooAPI from "../../adapters/yahoo";
import Ticker from "../../common/Ticker";
import { SemipolarLoading } from "react-loadingg";

const serialize = (obj) => {
  if (obj) return JSON.stringify(obj);
  return null;
};

const deserialize = (obj) => {
  if (obj && obj !== "") return JSON.parse(obj);
  return null;
};

const storageKey = "watchlist";

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

  updateStorage() {
    const { symbols } = this.state;
    if (symbols && symbols.length) {
      window.localStorage.setItem(storageKey, serialize(symbols));
    }
  }

  componentWillUnmount() {
    this.updateStorage();
  }

  async componentDidMount() {
    let symbols = [],
      stocks = [];

    this.setState({ isLoading: true });

    symbols = deserialize(window.localStorage.getItem("watchlist"));
    if (symbols && symbols.length) {
      stocks = await yahooAPI.getSummary(symbols);
      this.setState({ symbols, stocks, isLoading: false });
    }

    this.setState({ isLoading: false });
  }

  clearTextInput() {
    this.textInput.current.value = "";
  }

  async reloadStocks() {
    const { symbols } = this.state;
    this.setState({ isLoading: true });
    const stocks = await yahooAPI.getSummary(symbols);
    this.setState({ stocks, isLoading: false });
    this.updateStorage();
    this.clearTextInput();
  }

  async search(event) {
    const query = event.target.value;

    if (query.trim() === "") {
      this.setState({ searchResults: [] });
      return;
    }

    console.log(query);

    const queryResults = await yahooAPI.searchStocks(query);
    const symbols = queryResults.map((result) => {
      return result["symbol"];
    });
    console.log(symbols);
    this.setState({ searchResults: symbols });
  }

  async addAndReload(symbol) {
    console.log(symbol);
    let { symbols } = this.state;
    symbols.push(symbol);
    this.setState({ searchResults: [], symbols });
    this.reloadStocks();
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
              <div id="search-results">
                {searchResults.map((result, index) => {
                  return (
                    <div
                      className="search-result"
                      onClick={() => this.addAndReload(result)}
                      key={result}
                      value={result}
                    >
                      {result}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {isLoading ? (
            <SemipolarLoading />
          ) : (
            <div className="indices">
              {stocks.map((stock, index) => (
                <Ticker stock={stock} key={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Watchlist;
